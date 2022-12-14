let {runQuery} = require("./sql.js")
let crypto = require("./crypto.js")

let pepper = "-dVBC5Al-_4Pg5UULeHbo65JOfkrAC3w"

// #region Get Session ID through Login
function getSID(email,pass,ip,fingerprint){
    return runQuery(`
    SELECT 
      SUS,SALT,PASS,EMAIL
    FROM 
      KPO_USER
    WHERE 
      email=@email AND LM IS NULL AND Aktiv IS NOT NULL
    `,{email}).then(queryresult=>{return queryresult.recordset}).then(data=>{
      switch (data.length){
        case 1: {
          if(data[0].SUS==null){
            if(data[0].PASS==crypto.hash(data[0].SALT+pass+pepper)){
              let sid = crypto.genHash(32)
              runQuery("INSERT INTO KPO_SES (SID,ID_USER,IP) VALUES (@sid,(SELECT ID FROM KPO_USER WHERE email=@email),@ip);",{sid:crypto.hash(fingerprint+sid),email,ip})
              return {sid,status:200,msg:"Login successful"};
            }
            return {sid:null,status:401,msg:"Wrong password"};
          }
          return {sid:null,status:401,msg:"Account suspended for suspicious activity"};
        }
        case 0: return {sid:null,status:404,msg:"User not found"};
        default: return {sid:null,status:412,msg:"Disproportionate amount of users found"};
      }
    })
}
// #endregion

// #TODO: add return
// #region Insert data through Registration
function insertUserData(name,surname,foa,email,pass,type,company,mobil){
  let salt = crypto.genHash(32)
  runQuery(`
  IF NOT EXISTS(SELECT EMAIL FROM KPO_USER WHERE email=@email) 
    INSERT INTO KPO_USER (VORNAME,NACHNAME,SALT,PASS,EMAIL,ANREDE,TYP,FIRMA,MOBILTEL) VALUES (@name,@surname,@salt,@pass,@email,@foa,@type,@company,@mobil);
  ELSE
    SELECT * from KPO_USER WHERE email=@email and aktiv is null and lm is null
  `,{name,surname,foa,email,pass:(crypto.hash(salt+pass+pepper)),salt,type,company,mobil}).then(queryresult=>{
    //TODO
    console.log(queryresult)
  })
}
// #endregion

// #TODO: add return
// #region Activate user
function activate(email){
  runQuery(`UPDATE KPO_USER SET Aktiv = 1 WHERE email=@email`,{email}).then(queryresult=>{
    //TODO
    console.log(queryresult)
  })
}
// #endregion
// #region Check for UserID while logged in
function getUIDfromSID(sid,fingerprint){
  return runQuery(`SELECT ID_USER FROM KPO_SES WHERE SID=@sid`,{sid:crypto.hash(fingerprint+sid)}).then(queryresult=>{return queryresult.recordset}).then(data=>{    
    switch(data.length){
      case 1: return {uid:data[0].ID_USER, status:200, msg:"Session found"};
      case 0: return {uid:null, status:404, msg:"Session not found"};
      default: return {uid:null, status:412, msg:"Disproportionate amount of sessions found"};
    }
  })
}
// #endregion

module.exports={getSID,insertUserData,activate,getUIDfromSID}
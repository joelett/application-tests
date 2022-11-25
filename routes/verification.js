let {runQuery} = require("./sql.js")
let crypto = require("./crypto.js")

function testUserData(email,pass){
    return runQuery(`SELECT SUS,SALT,PASS,SID,EMAIL FROM dbo.KPO_USER WHERE email=@email AND LM IS NULL AND ACTIVATED IS NOT NULL`,{email}).then(queryresult=>{return queryresult.recordset}).then(data=>{
      switch (data.length){
        case 1: return data[0].SUS==null?(data[0].PASS==crypto.hash(data[0].SALT+pass)?{sid:data[0].SID,status:200,msg:"Login successful"}:{sid:null,status:401,msg:"Wrong password"}):{sid:null,status:401,msg:"Account suspended for suspicious activity"}; break;
        case 0: return {sid:null,status:404,msg:"User not found"}; break;
        default: return {sid:null,status:412,msg:"Disproportionate amount of users found"}
      }
    })
}

function insertUserData(name,surname,foa,email,pass,type,company){
  let salt = crypto.genHash(32)
  let sid = crypto.genHash(32)
  runQuery(`INSERT INTO KPO_USER 
  (NAME,SURNAME,SALT,PASS,SID,EMAIL,ANREDE,TYP,FIRMA)
  VALUES (@name,@surname,@salt,@pass,@sid,@email,@foa,@type,@company)
  `,{name,surname,foa,email,pass:(crypto.hash(salt+pass)),salt,sid,type,company}).then(queryresult=>{
    console.log(queryresult)
  })
}

function activate(email){
  runQuery(`UPDATE KPO_USER SET ACTIVATED = 1 WHERE email=@email`,{email}).then(queryresult=>{
    console.log(queryresult)
  })
}

module.exports={testUserData,insertUserData,activate}
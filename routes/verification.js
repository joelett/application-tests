let {runQuery} = require("./sql.js")
let crypto = require("./crypto.js")

function testUserData(user,pass){
    return runQuery(`SELECT SUS,USERNAME,SALT,PASS,SID FROM dbo.KPO_USER WHERE USERNAME=@user AND LM IS NULL`,[{name:"user",value:user}]).then(queryresult=>{return queryresult.recordset}).then(data=>{
      switch (data.length){
        case 1: return data[0].SUS==null?(data[0].PASS==crypto.hash(data[0].SALT+pass)?{sid:data[0].SID,status:200,msg:"Login successful"}:{sid:null,status:401,msg:"Wrong password"}):{sid:null,status:401,msg:"Account suspended for suspicious activity"}; break;
        case 0: return {sid:null,status:404,msg:"User not found"}; break;
        default: return {sid:null,status:412,msg:"Disproportionate amount of users found"}
      }
    })
}

module.exports={testUserData}
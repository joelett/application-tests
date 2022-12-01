var express = require('express');
const { MSSQLError } = require('mssql');
var router = express.Router();
let crypto = require("../crypto.js")
let verification = require("../verification.js")

/* GET home page. */
router.get('/', (req, res, next)=>{
  if(req.cookies['kpo.sid']==undefined||req.cookies['kpo.sid']==null){
    res.render("register.html")
  }else{
    res.redirect("/ais/kundenportal/")
  }
});
router.post('/',async (req,res)=>{
  let name = (await crypto.decryptData(req.body.name))
  let surname = (await crypto.decryptData(req.body.surname))
  let foa = (await crypto.decryptData(req.body.foa))
  let email = (await crypto.decryptData(req.body.email))
  let pass = (await crypto.decryptData(req.body.pass))

  let type = (await crypto.decryptData(req.body.type))
  let company = (await crypto.decryptData(req.body.company))
  let mobil = (await crypto.decryptData(req.body.mobil))
  
  //let ret = await verification.insertUserData(name,surname,foa,email,pass,type,company)
  verification.insertUserData(name,surname,foa,email,pass,type,company,mobil)

  //if(ret.sid!=null){
  //  res.cookie("kpo.sid",ret.sid)
  //}
  //res.status(ret.status).send(ret.msg)
  res.status(200).send("Testing")
})

router.post('/activate',async(req,res)=>{
  let email = (await crypto.decryptData(req.body.email))

  verification.activate(email)
  res.status(200).send("Testing")
})

module.exports = router;

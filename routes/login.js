var express = require('express');
var router = express.Router();
let crypto = require("../crypto.js")
let verification = require("../verification.js")

router.get('/', (req, res, next)=>{
  if(req.session==undefined||req.session==null){
    res.render("login.html")
  }else{
    res.redirect("/ais/kundenportal/")
  }
});
router.post('/',async (req,res)=>{
  if(req.session==undefined||req.session==null){
    let email = (await crypto.decryptData(req.body.email))
    let pass = (await crypto.decryptData(req.body.pass))
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    let ret = await verification.getSID(email,pass,ip,req.fingerprint)
    if(ret.sid!=null){
      res.cookie("USBKundenportal.sid",ret.sid,{
        httpOnly:true,
        secure:true,
        maxAge:3600000*24*(365)
      })
    }
    res.status(ret.status).send(ret.msg)
  }else{
    res.status(449).send("You have to logout before logging in again!")
  }
})

module.exports = router;

var express = require('express');
var router = express.Router();
var crypto = require("./crypto.js")
var fs = require('fs')
let verification = require("./verification.js")

//Homepage
router.get('/', async function(req, res, next) {
  let session = req.cookies['kpo.sid']
  let fingerprint = req.fingerprint
  let ret = await verification.getUIDfromSID(session,fingerprint)
  if(ret.uid!=null){
    res.render('index.html');
  }else{
    res.cookie("kpo.sid","",{
      maxAge:0
    })
    res.status(ret.status).redirect("/ais/kundenportal/login")
  }
});
//Publickey Referenz
router.get('/pubkey',async(req,res)=>{
  res.send(JSON.stringify({ pubkey: await crypto.getPubKey()}));
})
//Check if Session is valid
router.get('/valid',async (req,res)=>{
  let session = req.cookies['kpo.sid']
  let fingerprint = req.fingerprint
  let ret = await verification.getUIDfromSID(session,fingerprint)
  if(ret.uid==null){
    res.cookie("kpo.sid","",{
      maxAge:0
    })
  }
  res.status(ret.status).send(ret.msg)
})

router.get('/logout',(req,res)=>{
  res.cookie("kpo.sid","",{
    maxAge:0
  })
  res.redirect("/ais/kundenportal/login")
})

module.exports = router;

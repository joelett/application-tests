var express = require('express');
var router = express.Router();
var crypto = require("../crypto.js")
let verification = require("../verification.js")

//Homepage
router.get('/', function(req, res, next) {
  let ret = req.session
  if(ret.uid!=null){
    res.render('index.html');
  }else{
    res.cookie("kpo.sid","",{
      maxAge:0
    })
    res.status(ret.response.status).redirect("/ais/kundenportal/login")
  }
});
//Publickey Referenz
router.get('/pubkey',async(req,res)=>{
  res.send(JSON.stringify({ pubkey: await crypto.getPubKey()}));
})
//Check if Session is valid
router.get('/valid',async (req,res)=>{
  let ret = req.session
  if(ret.uid==null){
    res.cookie("kpo.sid","",{
      maxAge:0
    })
  }
  res.status(ret.response.status).send(ret.response.msg)
})

router.get('/logout',(req,res)=>{
  res.cookie("kpo.sid","",{
    maxAge:0
  })
  res.redirect("/ais/kundenportal/login")
})

module.exports = router;

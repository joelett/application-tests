var express = require('express');
var router = express.Router();
let crypto = require("./crypto.js")
let verification = require("./verification.js")

/* GET home page. */
router.get('/', (req, res, next)=>{
  res.render("register.html")
});
router.post('/',async (req,res)=>{
  let uid = (await crypto.decryptData(req.body.uid))
  let pass = (await crypto.decryptData(req.body.pass))
  
  let ret = await verification.testUserData(uid,pass)
  if(ret.sid!=null){
    res.cookie("kpo.sid",ret.sid)
  }
  res.status(ret.status).send(ret.msg)
})

module.exports = router;

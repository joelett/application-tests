var express = require('express');
var router = express.Router();
var crypto = require("./crypto.js")
var fs = require('fs')

//Homepage
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});
//Publickey Referenz
router.get('/pubkey',async(req,res)=>{
  res.send(JSON.stringify({ pubkey: await crypto.getPubKey()}));
})

module.exports = router;

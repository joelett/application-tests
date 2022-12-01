var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let crypto = require("./crypto.js")
//var Fingerprint = require('express-fingerprint')

let verify = require("./verification.js")

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

var app = express();

app.engine('html',require('ejs').renderFile)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function fingerprint(req,res,next){
    let useragent = req.headers['user-agent']
    let acclang = req.headers['accept-language']
    let accenc = req.headers['accept-encoding']
    req.fingerprint = crypto.hash(useragent+acclang+accenc)
    next()
})

app.use(async function session(req,res,next){
    let sid = req.cookies["USBKundenportal.sid"]
    if(sid){
        let resp = await verify.getUIDfromSID(sid,req.fingerprint)
        let msg = resp.msg
        let status = resp.status
        req.session = {
            uid:resp.uid,
            sid,
            response:{
                msg,
                status
            }
        }
    }
    next()
})



app.use('/ais/kundenportal', indexRouter);
app.use('/ais/kundenportal/login', loginRouter);
app.use('/ais/kundenportal/register', registerRouter);

module.exports = app;

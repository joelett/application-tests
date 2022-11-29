var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let crypto = require("./routes/crypto.js")
//var Fingerprint = require('express-fingerprint')

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

function fingerprint(req,res,next){
    let useragent = req.headers['user-agent']
    let acclang = req.headers['accept-language']
    let accenc = req.headers['accept-encoding']
    req.fingerprint = crypto.hash(useragent+acclang+accenc)
    next()
}
app.use(fingerprint)

let tmpbanned = []
let count = {}
function checktmpban(req,res,next){
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let id = crypto.hash(req.fingerprint+ip)
    count[id] = count[id]?count[id]:{}
    count[id].lt = count[id].tt
    count[id].tt = Date.now()
    if(count[id].lt+100>count[id].tt){
        count[id].count=count[id].count?count[id].count+1:1
    }else{
        count[id].count=0
    }
    if(count[id].lt+60000>Date.now()&&count[id].count>100){
        tmpbanned.push(id)
    }else if((count[id].lt+60000-Date.now())<0){
        tmpbanned.splice(tmpbanned.indexOf(id),1)
    }
    console.log((count[id].lt+60000-Date.now()))

    if(!tmpbanned.includes(id)){
        next()
    }else{
        res.status(429).send("Too Many Requests")
    }
}
app.use(checktmpban)



/*app.use(Fingerprint({
    parameters:[
        // Defaults
        Fingerprint.useragent,
        //Fingerprint.acceptHeaders,
        Fingerprint.geoip,
    ]
}))*/


app.use('/ais/kundenportal', indexRouter);
app.use('/ais/kundenportal/login', loginRouter);
app.use('/ais/kundenportal/register', registerRouter);

module.exports = app;

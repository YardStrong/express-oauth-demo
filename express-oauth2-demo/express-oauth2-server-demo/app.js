const express = require('express');
const path = require('path');
const ejs = require('ejs');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');

let conf = require('./profiles');
let routersKit = require('./toolkit/routersKit');
let sessionKit = require('./toolkit/sessionKit');
let mongodbKit = require('./toolkit/mongodbKit');
let redisKit = require('./toolkit/redisKit');
let passportKit = require('./toolkit/passportKit');


let app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.set('server-port', conf.app.port);

// middle module
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// [STARTER] plugin module
sessionKit.saveInRedis(app, conf.redis, conf.session);

mongodbKit.init(conf.mongodb);
redisKit.init(conf.redis);

app.use(passport.initialize());
app.use(passport.session());
passportKit.init();

routersKit.init(app);
// [END] plugin module


// error handling
app.use(function(error, req, res, next) {
   let errCode = error.status || 500;
   if(errCode == 500) {
       console.dir(error);
   }
   res.locals.errCode = errCode;
   res.status(errCode);
   res.render('error/error');
});


module.exports = app;

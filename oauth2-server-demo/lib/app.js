const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const ejs = require('ejs');
const sysConfig = {
    session: {
        name: 'demain.com',
        secret: 'foiea323jfavi3hff2',
        cookie: { domain: 'localhost', maxAge: 24 * 3600 * 1000}
    },
    sessionDB: {host: '127.0.0.1', port: 6379, db: 5},
    mongodb: {url: 'mongodb://127.0.0.1:27017/test'},
    redis: {host: '127.0.0.1', port: 6379, db: 1},
}
let app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**************************** plugins config ****************************/
//注意：优先初始化数据库相关插件，避免因为顺序而报错（其他插件可能依赖数据库）
const mongodbPlugin = require('../common/plugins/mongodbPlugin');
const redisPlugin = require('../common/plugins/redisPlugin');
const sessionPlugin = require('../common/plugins/sessionPlugin');
const passportOauth2Plugin = require('../common/plugins/passportOauth2Plugin');
mongodbPlugin.init(sysConfig.mongodb);
redisPlugin.init(sysConfig.redis);
app.use(sessionPlugin.saveInRedis(sysConfig.sessionDB, sysConfig.session));
// app.use(sessionPlugin.saveInRom(sysConfig.session));
app.use(passport.initialize());
app.use(passport.session());
passportOauth2Plugin.init();
const restfulMiddleware = require('../common/middleware/restfulMiddleware');
app.use(restfulMiddleware);


/**************************** routers config ****************************/
app.all('/ping', function(req, res) {res.send('OK')});
const routers = require('./router');
app.use('/', routers.oauthRouter);
app.use('/api', routers.apiRouter);
app.use('/my', routers.myRouter);
app.use('/client', routers.clientRouter);



/**************************** exception catch ****************************/
app.use(function(req, res) {res.notFound(req.url)});
app.use(function(error, req, res, next) {
    let errCode = error.status || 500;
    if(error) console.dir(error);
    res.status(errCode);
    res.json({code: errCode, msg: 'bad'});
});


module.exports = app;

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
// const ejs = require('ejs');

let app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', ejs.__express);
// app.set('view engine', 'html');
// app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());


/**************************** plugins config ****************************/
const restfulMiddleware = require('../common/middleware/restfulMiddleware');
app.use(restfulMiddleware);


/**************************** routers config ****************************/
app.all('/ping', function(req, res) {res.send('OK')});
const routers = require('./router');
app.use('/', routers.oauth2Router);


/**************************** exception catch ****************************/
app.use(function(req, res) {res.notFound(req.url)});
app.use(function(error, req, res, next) {
    let errCode = error.status || 500;
    if(error) console.dir(error);
    res.status(errCode);
    res.end('Bad');
});


module.exports = app;

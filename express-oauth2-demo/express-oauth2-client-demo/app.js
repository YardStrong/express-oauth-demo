const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');

let conf = require('./profiles');
let routersKit = require('./toolkit/routersKit');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.set('server-port', conf.app.port);

app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routersKit.init(app);


app.use(function(err, req, res, next) {
    let errCode = err.status || 500;
    if(errCode == 500) console.dir(err);
    res.locals.errCode = errCode;
    res.status = errCode;
    res.render('error/error');
});

module.exports = app;

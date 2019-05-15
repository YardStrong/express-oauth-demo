const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const ejs = require('ejs');

var sessionPlugin = require('../common/plugins/sessionPlugin');
var passportPlugin = require('../common/plugins/passportPlugin');


let app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/******************** plugin config ********************/
app.use(sessionPlugin.saveInRom({
    name: 'demain.com',
    secret: 'foiea323jfavi3hff2',
    cookie: { domain: 'localhost', maxAge: 24 * 3600 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
passportPlugin.init();


/******************** router config ********************/
app.all('/ping', function(req, res) {
    res.send('OK');
});
app.all('/home', [passportPlugin.authFilter, function(req, res) {
    res.end('home');
}]);
app.get('/toLogin', function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/home');
    }
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<!DOCTYPE html><html><head><title>login</title></head><body>');
    res.write('<form action="/doLogin" method="post"><input type="text" name="username" placeholder="用户名" />');
    res.write('<input type="password" name="password" placeholder="密码" />');
    res.write('<input type="submit" value="提交" /></form></body></html>');
});
// router.post('doLogin', passport.authenticate('local', {successRedirect: '/home', failtureRedirect: '/toLogin'}));
app.post('/doLogin', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
        if(error || !user) {
            console.log('[LOGIN-LOG] User (%s) fail to login at %s', user.username, new Date().toLocaleString());
            return res.redirect('/toLogin');
        }

        req.logIn(user, function(error) {
            if(error) return next(error);
            console.log('[LOGIN-LOG] User (%s) success to login at %s', user.username, new Date().toLocaleString());
            return res.redirect('/home');
        });
    })(req, res, next);
});



/******************** exception catch ********************/
app.use(function(error, req, res, next) {
    let errCode = error.status || 500;
    if(error) console.dir(error);
    res.status(errCode);
    res.end('error');
});


module.exports = app;

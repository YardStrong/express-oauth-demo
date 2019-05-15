const passport = require('passport');
const UserModel = require('mongoose').model('userModel');
const paramUtil = require('../../common/utils/paramUtil');
const randomUtil = require('../../common/utils/randomUtil');

// 登录页
module.exports.toLogin = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/home');
    }
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<!DOCTYPE html><html><head><title>login</title></head><body>');
    res.write('<form action="/doLogin" method="post"><input type="text" name="username" placeholder="用户名" />');
    res.write('<input type="password" name="password" placeholder="密码" />');
    res.write('<input type="submit" value="提交" /></form></body></html>');
}

// 登陆验证
// module.exports.doLogin = passport.authenticate('local', {successRedirect: '/home', failtureRedirect: '/toLogin'});
module.exports.doLogin = function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
        if(error || !user) {
            console.log('[LOGIN-LOG] User (%s) fail to login at %s', user.username, new Date().toLocaleString());
            return res.redirect('/toLogin');
        }

        req.logIn(user, function(error) {
            if(error) return next(error);
            console.log('[LOGIN-LOG] User (%s) success to login at %s', user.username, new Date().toLocaleString());
            return res.redirect('/my/ping');
        });
    })(req, res, next);
}

// 退出登陆
module.exports.toLogout = function(req, res) {
    req.logout();
    res.redirect('/toLogin');
}


module.exports.doRegister = function(req, res) {
    // TODO account 唯一性判断
    let params = req.body;
    if(!paramUtil.isValid(params.account)) return res.paramInvalid('account');
    if(!paramUtil.isValid(params.nickname)) return res.paramInvalid('nickname');
    if(!paramUtil.isValid(params.password)) return res.paramInvalid('password');
    if(!paramUtil.isValid(params.sex)) return res.paramInvalid('sex');
    if(!paramUtil.isEmail(params.email)) return res.paramInvalid('email');
    params.birthday = paramUtil.toDate(params.birthday);
    if(!params.birthday) return res.paramInvalid('birthday');
    let timestamp = new Date().getTime();
    let salt = randomUtil.getRandomStr(10);
    new UserModel({
        account: params.account, nickname: params.nickname,
        password: params.password, salt: salt,
        sex: params.sex, email: params.email,
        birthday: params.birthday, createTime: timestamp,
        updateTime: timestamp
    }).save(function(error, data) {
        if(error) {
            console.error(error);
            return res.json({code: 500, msg: 'Error'});
        }
        delete data.salt;
        res.json({code:200, msg: 'Success', data: data});
    });
}

module.exports.deleteUser = function(req, res) {
    let userID = req.query.userID;
    if(!paramUtil.isValid(userID)) return res.paramInvalid('userID');
    UserModel.deleteById(userID, res.callback);
}

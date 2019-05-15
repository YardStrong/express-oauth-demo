/**
 * [http路由] 登陆 /
 * [访问权限] 无限制
 *
 * /toLogin 登陆页面
 * /doLogin 登陆信息 form 表单提交
 * /toLogout 退出登陆
 * 
 */


const passport = require('passport');
const createError = require('http-errors');
const moment = require('moment');

exports.index = function(req, res) {
    res.redirect('/home');
}

exports.toLogin = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/home');
    }
    res.render('login/login');
}

exports.doLogin = passport.authenticate('local', { successReturnToOrRedirect: '/home', failureRedirect: '/toLogin' });
// exports.doLogin = function(req, res, next) {
//     passport.authenticate('local', function(error, user, info) {
//         if(error || !user) {
//             if(error) console.dir(error);
//             return res.json({error: 1, message: "Incorrect account or password."});
//         }
//
//         req.logIn(user, function(err) {
//             if(err) return next(createError(err));
//             console.log('[LOGIN-LOG] User (%s) success to login at %s', user.account, moment().format('YYYY-MM-DD HH:mm:ss'));
//             return res.redirect('/ping');
//         });
//     })(req, res, next);
// }

exports.toLogout = function(req, res) {
    req.logout();
    res.redirect('/home');
}

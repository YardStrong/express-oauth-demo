/**
 * [http路由] 首页 /home
 * [访问权限] 用户 local 模式登陆后即可访问
 *
 * 简单示例一个页面 /home 和 简单接口 /home/info
 */

const login = require('connect-ensure-login');
const passport = require('passport');

exports.index = function(req, res) {
    res.render('home/home');
}

exports.info = function(req, res) {
    res.json({error: 0, data: {where: 'home', auth: '1'}});
}

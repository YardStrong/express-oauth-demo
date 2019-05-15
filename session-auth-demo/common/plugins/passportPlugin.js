/**
 * passport nodejs 权限管理
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const user = { id: '1', username: 'admin', password: 'password'};

// 插件初始化，设置登陆用户信息的序列化与反序列化
module.exports.init = function() {
    // passport auth 登陆信息验证
    passport.use('local', new LocalStrategy(function(username, password, done) {
        console.log('username:', username, '  password', password);
        if(username != user.username || password != user.password) {
            return done(null, null, {error: 1, message: 'Incorrect username or password'});
        }
        console.dir(user);
        return done(null, user);
    }));
    // info serialize 序列化（存储在 session 中的信息）：对象转存储
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    // info deserialize 反序列化（提取信息）：存储转对象
    passport.deserializeUser(function(userId, done) {
       done(null, user);
    });
}

// 鉴权过滤器
module.exports.authFilter = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/toLogin");
}

// 登陆验证
module.exports.login = passport.authenticate('local', {
    successRedirect: '/home',
    failtureRedirect: '/toLogin'
});


// 退出登陆
module.exports.logout = function(req, res) {
    req.logout();
    res.redirect('/toLogin');
}

/**
 * 本配置按照 oauth2orize 官方提供的 demo 修改
 * （https://github.com/gerges-beshay/oauth2orize-examples.git）
 *
 * passport 认证需要配置数据库，所以此部分需要在数据库完成配置的基础上完成
 * 为避免在使用 require 的时候出错，将其放置在函数中
 *
 * token 放置在 redis 中，存储结构和 session 相仿，
 * token 采用 key-value 形式存储，其中 key 值格式： “token：iofjeoaijoijjf”，value 为 json 字符串
 */
exports.init = function() {

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy =
    require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const mongoose = require('mongoose');
const UserModel = mongoose.model('userModel');
const ClientModel = mongoose.model('clientModel');
const redisClient = require('./redisKit');
const redisTokenKey = 'token:';

/*************************************************************
 * 数据库接口
 */

var getUserByAccount = function(account, callback) {
    UserModel.getByAccount(account, callback);
}

var getUserById = function(userId, callback) {
    UserModel.getById(userId, callback);
}

var getClientByAppID = function(appID, callback) {
    ClientModel.getByAppID(appID, callback);
}

// 获取 accessToken 信息
var getAccessToken = function(accessToken, callback) {
    redisClient.get(redisTokenKey + accessToken, callback);
}


/*************************************************************
 * 配置本地登陆方式，用于普通用户登陆
 */
// 登陆验证
passport.use(new LocalStrategy(function(account, password, done) {
    getUserByAccount(account, function(err, user) {
        if(err) {
            dir(err);
            return done(err);
        }
        if(!user) return done(null, false, {error: 1, message: "No user"});
        // TODO 密码需要salt加密验证
        if(user.password != password) return done(null, false, {error: 1, message: "Incorrect account or password"});
        return done(null, user);
    });
}));

// 序列化 与 反序列化
passport.serializeUser(function(user, done) {
   done(null, user._id);
});
passport.deserializeUser(function(userId, done) {
    getUserById(userId, function(err, user) {
        done(err, user);
    });
});


/***************************************************************
 * 配置客户端认证方式
 */

// 客户端识别策略
var authClient = function(appID, secretKey, done) {
    getClientByAppID(appID, function(err, client) {
        if(err) return done(err);
        if(!client) return done(null, false, {error:1, message: 'No client'});
        if(client.secretKey != secretKey) return done(null, false, {error: 1, messge: 'Incorrect secretKey'});
        return done(null, client);
    });
}
passport.use(new BasicStrategy(authClient));
passport.use(new ClientPasswordStrategy(authClient));

// 令牌身份识别
passport.use(new BearerStrategy(function(accessToken, done) {
    getAccessToken(accessToken, function(err, tokenInfo) {
        if(err) return done(err);
        try { tokenInfo = JSON.parse(tokenInfo); } catch(e) { tokenInfo = null; }
        if(!tokenInfo) return done(null, false, {error: 1, message: "No tokenInfo"});
        if(tokenInfo.userId) {
            getUserById(tokenInfo.userId, function(err, user) {
                if(err) return done(err);
                if(!user) return done(null, false, {error: 1, message: "No user"});
                done(null, user, { scope: '*' });
            });
        } else {
            getClientByAppID(tokenInfo.appID, function(err, client) {
                if(err) return done(err);
                if(!client) return done(null, false, {error:1, message: 'No client'});
                done(null, client, { scope: '*' });
            });
        }
    });
}));

}

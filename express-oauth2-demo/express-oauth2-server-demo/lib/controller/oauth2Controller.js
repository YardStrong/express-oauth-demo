/**
 * oauth 授权过程
 *
 * [描述] 本配置按照 oauth2orize 官方提供的 demo 修改
 * （https://github.com/gerges-beshay/oauth2orize-examples.git）
 * token 和 code 放置在 redis 中
 *
 * [条件] passport 配置顺序在此配置之前
 */
const oauth2orize = require('oauth2orize');
const passport = require('passport');
const login = require('connect-ensure-login');
const mongoose = require('mongoose');

const ClientModel = mongoose.model('clientModel');
const UserModel = mongoose.model('userModel');
const redisClient = require('../../toolkit/redisKit');
const randomUtil = require('../../utils/randomUtil');
const redisTokenKey = 'token:';
const redisCodeKey = 'code:';

var server = oauth2orize.createServer();

/************************************************
 * 数据库接口
 */

// 保存 code 码
var saveCode = function(code, appID, redirectURI, userId, callback) {
    redisClient.set(redisCodeKey + code, JSON.stringify({ appID: appID, redirectURI: redirectURI, userId: userId }), callback);
}

// 获取 code 码
var getCode = function(code, callback) {
    redisClient.get(redisCodeKey + code, callback);
}

// 保存 token 码
var saveToken = function(token, userId, appID, callback) {
    redisClient.set(redisTokenKey + token, JSON.stringify({ userId: userId, appID: appID }), callback);
}

var getClientByAppID = function(appID, callback) {
    ClientModel.getByAppID(appID, callback);
}

var getUserByAccount = function(account, callback) {
    UserModel.getByAccount(account, callback);
}

/************************************************
 * 授权认证配置
 */

// 序列化 与 反序列化
server.serializeClient(function(client, done) {
   done(null, client.appID);
});
server.deserializeClient(function(appID, done) {
    getClientByAppID(appID, function(err, client) {
       if(err) return done(err);
       return done(null, client);
    });
});

// 用户登录之后，生成 code 码，返还给客户端
server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
    const code = randomUtil.getRandomStr(16); // 16位

    saveCode(code, client.appID, redirectURI, user._id, function(err) {
        if(err) return done(err);
        return done(null, code);
    });
}));

// 生成 token 令牌
server.grant(oauth2orize.grant.token(function(client, user, ares, done) {
    const token = randomUtil.getRandomStr(32); // 256 位

    saveToken(token, user._id, client.appID, function(err) {
        if(err) return done(err);
        return done(null, token);
    });

    return done(null, token);
}));


// 客户端换取令牌，由 code 换取 token
server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
    getCode(code, function(err, codeInfo) {
        if(err) return done(err);
        try { codeInfo = JSON.parse(codeInfo); } catch(e) { codeInfo = null };
        if(!codeInfo || codeInfo.appID !== client.appID || codeInfo.redirectURI !== redirectURI) {
            return done(null, false);

        }
        const token = randomUtil.getRandomStr(32); // 256
        saveToken(token, codeInfo.userId, codeInfo.appID, function(err) {
            if(err) return done(err);
            return done(null, token);
        });
    });
}));

// account password 用户授权登陆获取 token
server.exchange(oauth2orize.exchange.password(function(client, account, password, scope, done) {
    getClientByAppID(client.appID, function(err, dbClient) {
        if(err) return done(err);
        if(!dbClient || dbClient.secretKey !== client.secretKey) return done(null, false);
        getUserByAccount(account, function(err, user) {
           if(err) return done(err);
           if(!user) return done(null, false);
           // TODO 密码需要salt加密验证
           if(user.password != password) return done(null, false);

           const token = randomUtil.getRandomStr(32); // 256
           saveToken(token, user._id, client.appID, function(err) {
               if(err) return done(err);
               return done(null, token);
           });
        });
    });
}));

// account password 用户授权登陆获取 token
server.exchange(oauth2orize.exchange.clientCredentials(function(client, scope, done) {
    getClientByAppID(client.appID, function(err, dbClient) {
        if(err) return done(err);
        if(!dbClient || dbClient.secretKey !== client.secretKey) return done(null, false);

        const token = randomUtil.getRandomStr(32); // 256
        saveToken(token, null, client.appID, function(err) {
            if(err) return done(err);
            return done(null, token);
        });
    });
}));

/********************************************************
 * 暴露业务接口
 */
// 客户端访问此接口，校验客户端信息 和 用户登陆验证
exports.authorization = [
    login.ensureLoggedIn('/toLogin'),
    server.authorization(function(appID, redirectURI, done) {
        // 客户端访问到此，校验参数中的客户端信息
        getClientByAppID(appID, function(err, client) {
            if(err) return done(err);
            return done(null, client, redirectURI);
        });
    }),
    // function(client, user, done) {
    //     // 此处用来添加用户授权记录，配置下面 ‘情况②’ 来使用，避免重复授权
    //     // 根据 client 和 user 信息查找授权记录
    //     // 无须再次授权 done(null, true);
    //     // 需要再次授权 done(null, false);
    // },
    // 情况① 默认授权，直接下一步
    server.decision()

    // 情况② 授权页面，该部分将跳转到用户授权页面，询问用户是否授权
    // function(req, res, next) {
    //     res.render('login/auth', { transactionId: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    // }
];

// 配合上面 ’情况②‘ 使用，当用户选择是否授权后的处理
// POST
// 用户同意授权 {"transaction_id":"上边的 req.oauth2.transactionID"}
// 用户不同意授权 {"transaction_id":"上边的 req.oauth2.transactionID","cancel":"Deny"}
exports.decision = [
    login.ensureLoggedIn('/toLogin'),
    server.decision()
];

// 获取 token
exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
];

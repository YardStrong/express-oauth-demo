/**
 * 本配置按照 oauth2orize 官方提供的 demo 修改
 * （https://github.com/gerges-beshay/oauth2orize-examples.git）
 * @Author YardStrong<yardstrong@163.com>
 *
 * passport 认证需要配置数据库，所以此部分需要在数据库完成配置的基础上完成
 * 为避免在使用 require 的时候出错，将其放置在函数中
 *
 * token 放置在 redis 中，存储结构和 session 相仿，
 * token 采用 key-value 形式存储，其中 key 值格式： “token：iofjeoaijoijjf”，value 为 json 字符串
 */
const loginFilter = require('connect-ensure-login');
const oauth2orize = require('oauth2orize');
const passport = require('passport');

/************************** 待初始化对象 **************************/
var dbAPI = null;  // 持久层API
var oauth2orizeServer = oauth2orize.createServer();; // oauth2orize鉴权服务


/************************** 初始化组件和对象 **************************/
exports.init = function() {
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
// 我把持久层的依赖放到方法里require，是为了保证持久层插件已经初始化完毕
const mongoose = require('mongoose');
const UserModel = mongoose.model('userModel');
const ClientModel = mongoose.model('clientModel');
const redisClient = require('./redisPlugin').redisClient;
const randomUtil = require('../utils/randomUtil');
const redisTokenKey = 'token:';
const redisCodeKey = 'code:';


/************************** 模型层接口--数据库访问API **************************/
dbAPI = {
    // account → user  用户登陆：账号→用户信息
    getUserByAccount: function(account, callback) {
        UserModel.getByAccount(account, callback);
    },
    // userID → user
    getUserById: function(userId, callback) {
        UserModel.getById(userId, callback);
    },
    // 保存 code 码
    saveCode: function(code, appID, redirectURI, userId, callback) {
        redisClient.set(redisCodeKey + code, JSON.stringify({ appID: appID, redirectURI: redirectURI, userId: userId }), callback);
    },
    // 获取 code 码
    getCode: function(code, callback) {
        redisClient.get(redisCodeKey + code, callback);
    },
    // appID → client
    getClientByAppID: function(appID, callback) {
        ClientModel.getByAppID(appID, callback);
    },
    // 保存 token
    saveAccessToken: function(token, userId, appID, callback) {
        redisClient.set(redisTokenKey + token, JSON.stringify({ userId: userId, appID: appID }), callback);
    },
    // 获取 accessToken 信息
    getAccessToken: function(accessToken, callback) {
        redisClient.get(redisTokenKey + accessToken, callback);
    }
}


/******************* 配置本地登陆方式，用于普通用户登陆 ******************/
// 登陆验证
passport.use(new LocalStrategy(function(account, password, done) {
    dbAPI.getUserByAccount(account, function(err, user) {
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
    dbAPI.getUserById(userId, function(err, user) {
        done(err, user);
    });
});


/******************* 配置客户端认证方式 ******************/
// 客户端识别策略
var authClient = function(appID, secretKey, done) {
    dbAPI.getClientByAppID(appID, function(err, client) {
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
    dbAPI.getAccessToken(accessToken, function(err, tokenInfo) {
        if(err) return done(err);
        try { tokenInfo = JSON.parse(tokenInfo); } catch(e) { tokenInfo = null; }
        if(!tokenInfo) return done(null, false, {error: 1, message: "No tokenInfo"});
        if(tokenInfo.userId) {
            dbAPI.getUserById(tokenInfo.userId, function(err, user) {
                if(err) return done(err);
                if(!user) return done(null, false, {error: 1, message: "No user"});
                done(null, user, { scope: '*' });
            });
        } else {
            dbAPI.getClientByAppID(tokenInfo.appID, function(err, client) {
                if(err) return done(err);
                if(!client) return done(null, false, {error:1, message: 'No client'});
                done(null, client, { scope: '*' });
            });
        }
    });
}));




/************************** 授权认证配置 **************************/
// 序列化 与 反序列化（appID ↔ client）
oauth2orizeServer.serializeClient(function(client, done) {
    done(null, client.appID);
});
oauth2orizeServer.deserializeClient(function(appID, done) {
    dbAPI.getClientByAppID(appID, function(err, client) {
        if(err) return done(err);
        return done(null, client);
    });
});

// 用户登录之后，生成 code 码，返还给客户端  // ares 授权域
oauth2orizeServer.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
    const code = randomUtil.getRandomStr(16); // 16位随机码
    dbAPI.saveCode(code, client.appID, redirectURI, user._id, function(err) {
        if(err) return done(err);
        return done(null, code);
    });
}));

// 生成 token 令牌
oauth2orizeServer.grant(oauth2orize.grant.token(function(client, user, ares, done) {
    const token = randomUtil.getRandomStr(32); // 256 位

    dbAPI.saveAccessToken(token, user._id, client.appID, function(err) {
        if(err) return done(err);
        return done(null, token);
    });

    return done(null, token);
}));


// 客户端换取令牌，由 code 换取 token
oauth2orizeServer.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
    dbAPI.getCode(code, function(err, codeInfo) {
        if(err) return done(err);
        try { codeInfo = JSON.parse(codeInfo); } catch(e) { codeInfo = null };
        if(!codeInfo || codeInfo.appID !== client.appID || codeInfo.redirectURI !== redirectURI) {
            return done(null, false);

        }
        const token = randomUtil.getRandomStr(32); // 256
        dbAPI.saveAccessToken(token, codeInfo.userId, codeInfo.appID, function(err) {
            if(err) return done(err);
            return done(null, token);
        });
    });
}));

// account password 用户授权登陆获取 token
oauth2orizeServer.exchange(oauth2orize.exchange.password(function(client, account, password, scope, done) {
    dbAPI.getClientByAppID(client.appID, function(err, dbClient) {
        if(err) return done(err);
        if(!dbClient || dbClient.secretKey !== client.secretKey) return done(null, false);
        dbAPI.getUserByAccount(account, function(err, user) {
            if(err) return done(err);
            if(!user) return done(null, false);
            // TODO 密码需要salt加密验证
            if(user.password != password) return done(null, false);

            const token = randomUtil.getRandomStr(32); // 256
            dbAPI.saveAccessToken(token, user._id, client.appID, function(err) {
               if(err) return done(err);
               return done(null, token);
            });
        });
    });
}));

// account password 用户授权登陆获取 token
oauth2orizeServer.exchange(oauth2orize.exchange.clientCredentials(function(client, scope, done) {
    dbAPI.getClientByAppID(client.appID, function(err, dbClient) {
        if(err) return done(err);
        if(!dbClient || dbClient.secretKey !== client.secretKey) return done(null, false);

        const token = randomUtil.getRandomStr(32); // 256
        dbAPI.saveAccessToken(token, null, client.appID, function(err) {
            if(err) return done(err);
            return done(null, token);
        });
    });
}));
}






/************************** 暴露业务接口 **************************/
// 客户端访问此接口，校验客户端信息 和 用户登陆验证
exports.authorization = [
    loginFilter.ensureLoggedIn('/toLogin'),
    oauth2orizeServer.authorization(function(appID, redirectURI, done) {
        // 客户端访问到此，校验参数中的客户端信息
        dbAPI.getClientByAppID(appID, function(err, client) {
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
    oauth2orizeServer.decision()

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
    loginFilter.ensureLoggedIn('/toLogin'),
    oauth2orizeServer.decision()
];

// 获取 token
exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    oauth2orizeServer.token(),
    oauth2orizeServer.errorHandler()
];

/**
 * session 使用的各种场景
 *
 * app.use(saveInRom());
 */


// 内存存储 session 配置
exports.saveInRom = function(app, sessionConfig) {
        var session = require('express-session');
        app.use(session({
            name: sessionConfig.name,
            // key: sessionConfig.id,
            secret: sessionConfig.secret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                    // domain: config.session.domain
                    maxAge: sessionConfig.cookie.maxAge //60 * 1000
            }
        }));
}

// redis 存储 session 实现 session 共享
exports.saveInRedis = function(app, redisConfig, sessionConfig) {
        var session = require('express-session');
        var RedisStore = require('connect-redis')(session);
        app.use(session({
            store: new RedisStore({
                host: redisConfig.host, // 127.0.0.1
                port: redisConfig.port, // 6379
                db: redisConfig.db, // 1
                ttl: redisConfig.ttl // 3600 * 24 * 365
            }),
            secret: sessionConfig.secret, // session - save - secret
            resave: false,
            saveUninitialized: true,
            name: sessionConfig.name, // application name
            cookie: {
                    // domain: sessionConfig.domain, // 单域名时配置，多个二级域名共享则配置一级域名
                    httpOnly:false
            }
        }));
}

// mongodb 存储 session 实现 session 共享
exports.saveInMongodb = function(app, mongodbConfig, sessionConfig) {
        var session = require('express-session');
        var mongoStore = require('connect-mongo')(session);
        app.use(session({
            store: new mongoStore({
                host: mongodbConfig.host,
                port: mongodbConfig.port,
                db: mongodbConfig.db
            }),
            secret: sessionConfig.secret, // session - save - secret
            resave: false,
            saveUninitialized: true,
            name: sessionConfig.name, // application name
            cookie: {
                domain: sessionConfig.cookie.domain, // 单域名时配置，多个二级域名共享则配置一级域名
                httpOnly:false
            }
        }));
}

// file 存储 session 实现 session 共享
exports.saveInFile = function(app, sessionConfig) {
        var session = require('express-session');
        var FileStore = require('session-file-store')(session);
        app.use(session({
            store: new FileStore(),
            secret: sessionConfig.secret, // session - save - secret
            resave: false,
            saveUninitialized: true,
            name: sessionConfig.name, // application name
            cookie: {
                domain: sessionConfig.domain, // 单域名时配置，多个二级域名共享则配置一级域名
                httpOnly:false,
                maxAge: 60 * 1000  // 有效期，单位是毫秒
            }
        }));
}

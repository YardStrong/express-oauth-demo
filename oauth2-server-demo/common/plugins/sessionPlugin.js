/**
 * session 使用的各种场景，举例（存储在内存中）：
 * app.use(sessionPlugin.saveInRom({
 *     name: 'demo',
 *     secret: 'foiea323jfavi3hff2',
 *     cookie: { domain: 'localhost', maxAge: 24 * 3600 * 1000}
 * })
 */

// 内存存储 session 配置
exports.saveInRom = function(sessionConfig) {
    const session = require('express-session');
    return session({
        name: sessionConfig.name,
        secret: sessionConfig.secret,
        saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
        resave: false, // 是否每次都重新保存会话，建议false
        cookie: {
            domain: sessionConfig.cookie.domain,
            maxAge: sessionConfig.cookie.maxAge, //60 * 1000
        }
    });
}

// redis 存储 session 实现 session 共享
exports.saveInRedis = function(redisConfig, sessionConfig) {
    const session = require('express-session');
    const RedisStore = require('connect-redis')(session);
    return session({
        store: new RedisStore({
            host: redisConfig.host || '127.0.0.1',
            port: redisConfig.port || 6379,
            db: redisConfig.db || 1,
            ttl: redisConfig.ttl || 3600 * 24 * 365
        }),
        secret: sessionConfig.secret, // session - save - secret
        saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
        resave: false, // 是否每次都重新保存会话，建议false
        name: sessionConfig.name, // application name
        cookie: {
            // domain: sessionConfig.domain, // 单域名时配置，多个二级域名共享则配置一级域名
            httpOnly:false
        }
    });
}

// mongodb 存储 session 实现 session 共享
exports.saveInMongodb = function(mongodbConfig, sessionConfig) {
    const session = require('express-session');
    const mongoStore = require('connect-mongo')(session);
    return session({
        store: new mongoStore({
            host: mongodbConfig.host,
            port: mongodbConfig.port,
            db: mongodbConfig.db
        }),
        secret: sessionConfig.secret, // session - save - secret
        saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
        resave: false, // 是否每次都重新保存会话，建议false
        name: sessionConfig.name, // application name
        cookie: {
            domain: sessionConfig.cookie.domain, // 单域名时配置，多个二级域名共享则配置一级域名
            httpOnly:false
        }
    });
}

// file 存储 session 实现 session 共享
exports.saveInFile = function(sessionConfig) {
    const session = require('express-session');
    const FileStore = require('session-file-store')(session);
    return session({
        store: new FileStore(),
        secret: sessionConfig.secret, // session - save - secret
        saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
        resave: false, // 是否每次都重新保存会话，建议false
        name: sessionConfig.name, // application name
        cookie: {
            domain: sessionConfig.domain, // 单域名时配置，多个二级域名共享则配置一级域名
            httpOnly:false,
            maxAge: 60 * 1000  // 有效期，单位是毫秒
        }
    });
}

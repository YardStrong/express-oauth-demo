/**
 * redis 数据库连接模块 redis
 */

var redisClient = {};

/**
 * connect redis 连接 redis 数据库
 * @Param {object} 数据库连接配置{host: '127.0.0.1', port: 6379, db: 1}
 **/
let init = function(config) {
    const redis = require('redis');
    let onReadyCallback = function() {
        redisClient.ready = true;
        redisClient.removeListener('ready', onReadyCallback);
        redisClient.removeListener('error', onErrorCallback);
        console.log('[REDIS--LOG] Redis connected:', config.host+':'+config.port+'/'+config.db);
        redisClient.on('ready', onReadyListener);
        redisClient.on('error', onErrorListener);
    }

    // reconnect when error to try to connect 出错重连
    var retryLeft = 3;
    let onErrorCallback = function(err) {
        if(!--retryLeft) {
            console.log('[REDIS--LOG] Redis disconnected:', config.host+':'+config.port+'/'+config.db);
            process.exit(1);
        }
    }

    redisClient = redis.createClient(config.port || '127.0.0.1', config.host || 6379);

    redisClient.select(config.db || 0);
    redisClient.ready = false;
    redisClient.on('ready', onReadyCallback);
    redisClient.on('error', onErrorCallback);
}

// redis 重连事件
var onReadyListener = function() {
    redisClient.ready = true;
    console.log('[REDIS--LOG] Redis redisClient reconnect ...');
}
// redis error 事件
var onErrorListener = function(err) {
    redisClient.ready = false;
    console.log('[REDIS--LOG] Redis redisClient connect lost ...');
    console.dir(err);
}


module.exports.init = init;
module.exports.redisClient = redisClient;
module.exports.select = redisClient.select;

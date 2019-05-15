var redis = require('redis');

var client = {};

var init = function(config) {
    var onReadyCallback = function() {
        client.ready = true;
        client.removeListener('ready', onReadyCallback);
        client.removeListener('error', onErrorCallback);
        console.log('[REDIS-LOG] Redis client ready on:', config.host, config.port, config.db);
        client.on('ready', onReadyListener);
        client.on('error', onErrorListener);
    }

    var retryLeft = 3;
    var onErrorCallback = function(err) {
        if(!--retryLeft) {
            console.log('[REDIS-LOG] Redis client disconnected:', config.host, config.port, config.db);
            process.exit(1);
        }
    }

    client = redis.createClient(config.port, config.host);

    client.select(config.db);
    client.ready = false;
    client.on('ready', onReadyCallback);
    client.on('error', onErrorCallback);
}

var onReadyListener = function() {
    client.ready = true;
    console.log('[REDIS-LOG] Redis client reconnect ...');
}

var onErrorListener = function(err) {
    client.ready = false;
    console.log('[REDIS-LOG] Redis client connect lost ...');
    console.dir(err);
}


exports.init = init;
exports.get = function(key, callback) {
    console.log('>>> redis.get(%s)', key);
    client.get(key, callback);
}
exports.set = function(key, value, callback) {
    console.log('>>> redis.set(%s, %s)', key, value);
    client.set(key, value, callback);
}

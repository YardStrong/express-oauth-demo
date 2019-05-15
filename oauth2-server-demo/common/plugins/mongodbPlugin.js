/**
 * mongoose module config
 */
var db = {};

/**
 * connect mongodb，init mongoose.model('', Schema)
 * 连接数据库，并初始化 mongoose Schema 数据库结构
 * @Param {object} 数据库连接{url:'mongodb://127.0.0.1:27017'}
 */
let init = function(config) {
    const mongoose = require('mongoose');

    const option = "?readPreference=secondaryPreferred&auto_reconnect=true&poolSize=3";
    try {
        mongoose.connection
            .on('error', function(error) {
                console.log('[MONGO--LOG]', 'Mongo connect error', config.url);
                console.error(error);
            })
            .on('disconnected', function() { console.log('[MONGO--LOG]', 'Mongo disconnected', config.url) })
            .once('open', function() { console.log('[MONGO--LOG]', 'Mongo connected', config.url)});

        db = mongoose.connect(config.url + option, {useNewUrlParser: true, autoIndex: false });

        /**
         * 在这里引入model
         **/
        require('../../lib/model/clientModel');
        require('../../lib/model/userModel');

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

exports.init = init;

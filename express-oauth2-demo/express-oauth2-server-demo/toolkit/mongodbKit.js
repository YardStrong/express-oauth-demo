/* dependency modules */
var mongoose = require('mongoose');

var db = {};

var init = function(config) {
    var option = "?readPreference=secondaryPreferred&auto_reconnect=true&poolSize=3";
    try {
        var mongodb = mongoose.connect(config.url + option, {useNewUrlParser: true});
        mongoose.connection
            .on('error', function(error) { console.log('[MONGO-LOG]', 'Mongo error', config.url) })
            .on('disconnected', function() { console.log('[MONGO-LOG]', 'Mongo disconnected', config.url) })
            .once('open', function() { console.log('[MONGO-LOG]', 'Mongo connected', config.url)});

        /* require models */
        require('../lib/model/clientModel');
        require('../lib/model/userModel');

        db = mongodb;
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

exports.init = init;
exports.db = db;

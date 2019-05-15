const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = require('mongodb').ObjectID;
const ObjectId = Schema.ObjectId;
var clientSchema = new Schema({
    appID: String,
    appName: String,
    secretKey: String,
    redirectURI: String,
    createTime: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: 'client'
});

clientSchema.statics.findByAppName = function(appName, callback) {
    return this.find({ appName: new RegExp(appName, 'i') }, callback);
}

clientSchema.statics.getByAppID = function(appID, callback) {
    return this.findOne({ appID: appID }, callback);
}

clientSchema.statics.findByAdminID = function(adminID, callback) {
    return this.find({ adminID: ObjectID(adminID) }, callback);
}

mongoose.model('clientModel', clientSchema);

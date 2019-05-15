/*********************************************************
可授权的客户端
*********************************************************/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = require('mongodb').ObjectID;
var clientSchema = new Schema({
    appID: String,
    appName: String,
    secretKey: String,
    redirectURI: String,
    createTime: Number,
    updateTime: Number
}, {
    collection: 'client'
});

clientSchema.statics.findByAppName = function(appName, callback) {
    return this.find({appName: new RegExp(appName, 'i') }, callback);
}

clientSchema.statics.getByAppID = function(appID, callback) {
    return this.findOne({appID: appID }, callback);
}

clientSchema.statics.deleteClient = function(id, callback) {
    return this.deleteOne({ _id: ObjectID(id)}, callback);
}
// 定义索引
clientSchema.index({appID: 1});

mongoose.model('clientModel', clientSchema);

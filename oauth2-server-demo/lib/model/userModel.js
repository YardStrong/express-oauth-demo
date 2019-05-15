/*********************************************************
登陆用户信息
*********************************************************/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = require('mongodb').ObjectID;

var userSchema = new Schema({
   account: String,
   // openId: String,
   nickname: String,
   password: String,
   salt: String,
   sex: {type: Number, default: 0}, // 1:boy 2:girl
   email: String,
   birthday: Number,
   createTime: Number,
   updateTime: Number
}, {
    collection: 'user'
});

userSchema.statics.getByAccount = function(account, callback) {
    return this.findOne({ account: account }, callback);
}

userSchema.statics.getById = function(id, callback) {
    return this.findOne({ _id: ObjectID(id)}, callback);
}

userSchema.statics.deleteById = function(id, callback) {
    return this.deleteOne({ _id: ObjectID(id)}, callback);
}

mongoose.model('userModel', userSchema);

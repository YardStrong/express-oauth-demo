const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

var userSchema = new Schema({
   account: String,
   // openId: String,
   nickname: String,
   password: String,
   salt: String,
   sex: {
       type: Number,
       default: 0
   },
   email: String,
   birthday: Date,
   createTime: {
       type: Date,
       default: Date.now()
   }
}, {
    collection: 'user'
});

userSchema.statics.getByAccount = function(account, callback) {
    return this.findOne({ account: account }, callback);
}

userSchema.statics.getById = function(id, callback) {
    return this.findOne({ _id: ObjectID(id)}, callback);
}

mongoose.model('userModel', userSchema);

const ClientModel = require('mongoose').model('clientModel');
const paramUtil = require('../../common/utils/paramUtil');
const randomUtil = require('../../common/utils/randomUtil');

/*******************  new client  *******************/
module.exports.newClient = function(req, res) {
    let appName = req.body.appName;
    let redirectURI = req.body.redirectURI;
    if(!paramUtil.isValid(appName)) return res.paramInvalid('appName');
    if(!paramUtil.isURI(redirectURI)) return res.paramInvalid('redirectURI');
    // TODO appID 唯一性校验
    let appID = randomUtil.getRandomInt(10);
    let timestamp = new Date().getTime();
    let secretKey = randomUtil.getRandomStr(32);
    new ClientModel({
        appID: appID, appName: appName,
        secretKey: secretKey, redirectURI: redirectURI,
        createTime: timestamp, updateTime: timestamp
    }).save(res.callback);
}

/*******************  del client  *******************/
module.exports.deleteClient = function(req, res) {
    let clientID = req.query.clientID;
    if(!paramUtil.isValid(clientID)) return res.paramInvalid('clientID');
    ClientModel.deleteClient(clientID, res.callback);
}

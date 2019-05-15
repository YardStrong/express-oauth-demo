/**
 * 将所有 require 放入 init 函数，只有执行 init() 时才会进行加载
 * 这样避免了 require 此模块时不必提前配置 mongodb， 只需执行 init() 前完成 mongodb 配置
 */
exports.init = function(app) {

const createError = require('http-errors');

let oauthRouter = require('../lib/routers/oauthRouter');

app.use('/', oauthRouter);

app.use(function(req, res, next) {
   next(createError(404));
});

}

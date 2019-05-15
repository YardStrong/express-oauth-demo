/**
 * 将所有 require 放入 init 函数，只有执行 init() 时才会进行加载
 * 这样避免了 require 此模块时不必提前配置 mongodb， 只需执行 init() 前完成 mongodb 配置
 */
exports.init = function(app) {

const createError = require('http-errors');
const passport = require('passport');
const login = require('connect-ensure-login');

let oauthRouter = require('../lib/routers/oauthRouter');
let homeRouter = require('../lib/routers/homeRouter');
let apiRouter = require('../lib/routers/apiRouter');

let localFilter = login.ensureLoggedIn('/toLogin');
let apiFilter = passport.authenticate('bearer', { session: false });

app.use('/', oauthRouter);
app.use('/home', localFilter, homeRouter);
app.use('/api', apiFilter, apiRouter);

app.use(function(req, res, next) {
   next(createError(404));
});

}

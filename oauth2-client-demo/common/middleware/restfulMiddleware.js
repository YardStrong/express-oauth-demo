/******************************************
Restful风格同一http返回
******************************************/

module.exports = function(req, res, next) {
    // not found
    res.notFound = function(what) {
        res.status = 404;
        res.json({code: 404, msg: 'Not found', what: what});
    }
    // success
    res.success = function() {res.json({code: 200, msg: 'Success'})}
    // error
    res.error = function() {
        res.status = 500;
        res.json({code: 500, msg: 'Error'});
    }
    // data
    res.data = function() {res.json({code:200, msg: 'Success', data: data})}
    // 未授权
    res.unauthorized = function() {
        res.status = 401;
        res.json({code: 401, msg: 'Unauthorized'});
    }
    // 参数不合法
    res.paramInvalid = function(paramName) {
        res.status = 400;
        res.json({code: 400, msg: 'Param invalid', param: paramName});
    }
    next();
}

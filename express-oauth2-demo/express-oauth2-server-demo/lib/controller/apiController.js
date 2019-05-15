/**
 * [http路由] api接口 /api
 * [访问权限] 客户端 token 令牌授权
 *
 * 简单 api 接口示例 /api/getApiVersion
 */
exports.getApiVersion = function(req, res) {
    res.json({apiServer: 'oauth2-server', version: 'v1.0.0'});
}

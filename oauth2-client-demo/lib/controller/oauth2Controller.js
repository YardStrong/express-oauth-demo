
const ClientOAuth2 = require('client-oauth2');
const config = {
    clientId: '12345678901',
    clientSecret: 'pff3232938u98jfj3p214u29ffh3h2af3u',
    authorizationUri: 'http://localhost:3000/dialog/authorize',
    accessTokenUri: 'http://localhost:3000/oauth/token',
    redirectUri: 'http://localhost:3001/oauth/callback',
    scopes: ['*']
}
const popsicle = require('popsicle');

var accountAuth = {};

accountAuth = new ClientOAuth2(config);

/**********************************************
 * 获取认证URL
 */
exports.authorize = function(req, res) {
    let uri = accountAuth.code.getUri();
    res.redirect(uri);
}

/*************************************************
 * oauth 认证返回域，由 code 换取 token
 */
exports.getToken = function(req, res) {
    // res.send(req.query.code);
    accountAuth.code.getToken(req.originalUrl)
        .then(function(clientOAuth2Token) {
            console.log('>>> callback clientOAuth2Token:');
            console.dir(clientOAuth2Token);

            // 刷新 token 值，本例服务器端没有提供接口
            // clientOAuth2Token.refresh().then(function(updateUser) {
            //     console.log(updateUser.accessToken);
            // });


            // {
            //  method: 'get',
            //  url: 'http://localhost:3000/api/getApiVersion',
            //  headers: { Authorization: 'Bearer jvIsEuYnIXAKTtyWqk28qKt0NFUsunCF'} // 划重点
            // }
            console.dir(clientOAuth2Token.sign({method: 'get', url: 'http://localhost:3000/api/getApiVersion'}));

            // TODO 存储 token， clientOAuth2Token.accessToken

            // popsicle 是 http 请求插件，重点在 clientOAuth2Token.sign
            popsicle.request(clientOAuth2Token.sign({
                method: 'get',
                url: 'http://localhost:3000/api/getApiVersion'
            })).then(function (result) {
                if(result.status === 200) console.dir(result.body);
                res.json({accessToken: clientOAuth2Token.accessToken});
            })
        });

}

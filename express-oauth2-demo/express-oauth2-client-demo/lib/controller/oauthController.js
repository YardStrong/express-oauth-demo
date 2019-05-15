
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

// // Can also just pass the raw `data` object in place of an argument.
// var token = githubAuth.createToken('access token', 'optional refresh token', 'optional token type', { data: 'raw user data' })
//
// // Set the token TTL.
// token.expiresIn(1234) // Seconds.
// token.expiresIn(new Date('2016-11-08')) // Date.
//
// // Refresh the users credentials and save the new access token and info.
// token.refresh().then(storeNewToken)
//
// // Sign a standard HTTP request object, updating the URL with the access token
// // or adding authorization headers, depending on token type.
// token.sign({
//   method: 'get',
//   url: 'https://api.github.com/users'
// }) //=> { method, url, headers, ... }

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
            // console.dir(clientOAuth2Token) 打印 clientOAuth2Token 的值如下:
            //
            // ClientOAuth2Token {
            //   client:
            //    ClientOAuth2 {
            //      options:
            //       { clientId: '12345678901',
            //         clientSecret: 'pff3232938u98jfj3p214u29ffh3h2af3u',
            //         authorizationUri: 'http://localhost:3000/dialog/authorize',
            //         accessTokenUri: 'http://localhost:3000/oauth/token',
            //         redirectUri: 'http://localhost:3001/oauth/callback',
            //         scopes: [Object] },
            //      request: [Function: request],
            //      code: CodeFlow { client: [Circular] },
            //      token: TokenFlow { client: [Circular] },
            //      owner: OwnerFlow { client: [Circular] },
            //      credentials: CredentialsFlow { client: [Circular] },
            //      jwt: JwtBearerFlow { client: [Circular] } },
            //   data:
            //    { access_token: '0Pt4zzuurMxdQwaywI711I8O1tJiVcOE',
            //      token_type: 'Bearer' },
            //   tokenType: 'bearer',
            //   accessToken: '0Pt4zzuurMxdQwaywI711I8O1tJiVcOE',
            //   refreshToken: undefined,
            //   expires: Invalid Date }
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

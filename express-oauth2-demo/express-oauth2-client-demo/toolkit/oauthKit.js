const ClientOAuth2 = require('client-oauth2');

var accountAuth = {};

exports.init = function(auth2Config) {
    accountAuth = new ClientOAuth2(auth2Config);

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
}

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
    accountAuth.code.getToken(req.originalUrl)
        .then(function(user) {
            console.log('>>> callback user:');
            console.dir(user);

            // user.refresh().then(function(updateUser) {
            //     console.log(updateUser.accessToken);
            // });

            user.sign({method: 'get', url: 'http://localhost:3001'});

            return res.send(user.accessToken);
        });
}

const http = require('http')
const auth = require('basic-auth')

var server = http.createServer(function(req, res) {
    console.dir(req.headers.authorization);

    var info = auth(req)

    if(!info || info.name != 'myname' || info.pass != 'mypass') {
        res.statusCode = 401

        res.setHeader('WWW-Authenticate', 'Basic realm="default"') // 缺省值-明文Basic realm="default"
        res.end('Access denied')
    } else {
        // res.setHeader('WWW-Authenticate', 'Basic "base64(myname:mypass)"') // base64加密信息
        res.end('Access granted')
    }


})


server.listen(3000)

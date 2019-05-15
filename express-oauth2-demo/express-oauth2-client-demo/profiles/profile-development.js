module.exports = {
    app: {
        name: 'oauth2-server',
        port: '3001'
    },
    mongodb: {
        url: 'mongodb://127.0.0.1:27017/test'
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        db: 1,
        ttl: 30 * 24 * 3600
    },
    session: {
        name: 'oauth2-sever',
        secret: 'foiea323jfavi3hff2',
        cookie: {
            domain: 'localhost',
            maxAge: 24 * 3600 * 1000
        }
    },
    oauth: {
        clientId: '12345678901',
        clientSecret: 'pff3232938u98jfj3p214u29ffh3h2af3u',
        authorizationUri: 'http://localhost:3000/dialog/authorize',
        accessTokenUri: 'http://localhost:3000/oauth/token',
        redirectUri: 'http://localhost:3001/oauth/callback',
        scopes: ['*']
    }
    // oauth: {
    //     clientId: 'abc123',
    //     clientSecret: 'ssh-secret',
    //     authorizationUri: 'http://localhost:3000/dialog/authorize',
    //     accessTokenUri: 'http://localhost:3000/oauth/token',
    //     redirectUri: 'http://localhost:3001/oauth/callback',
    //     scopes: ['*']
    // }
}

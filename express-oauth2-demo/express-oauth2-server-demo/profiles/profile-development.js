module.exports = {
    app: {
        name: 'oauth2-server',
        port: '3000'
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
    }
}

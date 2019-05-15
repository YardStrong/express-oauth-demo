const router = require('express').Router();

let controller = require('../controller/oauthController');

router.all('/ping', function(req, res) {res.json('OK')});

router.get('/oauth', controller.authorize);

router.get('/oauth/callback', controller.getToken);

module.exports = router;

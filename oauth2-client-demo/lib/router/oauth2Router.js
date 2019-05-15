const router = require('express').Router();
const controller = require('../controller/oauth2Controller');


router.get('/oauth', controller.authorize);
router.get('/oauth/callback', controller.getToken);

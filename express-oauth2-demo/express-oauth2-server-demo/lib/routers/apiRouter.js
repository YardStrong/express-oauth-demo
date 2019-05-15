const router = require('express').Router();

let controller = require('../controller/apiController');

router.get('/getApiVersion', controller.getApiVersion);

module.exports = router;

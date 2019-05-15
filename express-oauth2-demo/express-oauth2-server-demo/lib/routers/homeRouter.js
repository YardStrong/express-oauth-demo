const router = require('express').Router();

let controller = require('../controller/homeController');

router.get('/', controller.index);
router.get('/info', controller.info);

module.exports = router;

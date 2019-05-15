const router = require('express').Router();

let controller = require('../controller/oauth2Controller');
let loginController = require('../controller/loginController');

router.all('/', loginController.index);
router.get('/ping', function(req, res) {res.send('OK');});
router.get('/toLogin', loginController.toLogin);
router.post('/doLogin', loginController.doLogin);
router.get('/toLogout', loginController.toLogout);

router.get('/dialog/authorize', controller.authorization);
router.post('/dialog/authorize/decision', controller.decision);
router.post('/oauth/token', controller.token);

module.exports = router;

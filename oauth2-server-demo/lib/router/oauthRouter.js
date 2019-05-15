const router = require('express').Router();

let passportOauth2Plugin = require('../../common/plugins/passportOauth2Plugin');
let loginController = require('../controller/loginController');

router.get('/toLogin', loginController.toLogin);
router.post('/doLogin', loginController.doLogin);
router.get('/toLogout', loginController.toLogout);
router.post('/doRegister', loginController.doRegister);
router.get('/deleteUser', function(req, res, next) {
    if(req.headers['operator'] != 'admin' || req.headers['opcode'] != '123456789')
        return res.unauthorized();
    next();
}, loginController.deleteUser);

router.get('/dialog/authorize', passportOauth2Plugin.authorization);
router.post('/dialog/authorize/decision', passportOauth2Plugin.decision);
router.post('/oauth/token', passportOauth2Plugin.token);

module.exports = router;

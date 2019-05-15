const router = require('express').Router();
const localFilter = require('connect-ensure-login').ensureLoggedIn('/toLogin');

router.get('/ping', localFilter, function(req, res) {
    res.end('/my/ping');
});

module.exports = router;

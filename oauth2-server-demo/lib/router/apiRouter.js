const router = require('express').Router();
// const apiFilter = require('passport').authenticate('bearer', { session: false });
const apiFilter = function(req, res, next) {
    require('passport').authenticate('bearer', function(error, client, info) {
        if(error) return next(error);
        if(!client) return res.unauthorized();
        next();
    })(req, res, next);
}

router.get('/ping', apiFilter, function(req, res) {
    res.end('/api/ping');
});


module.exports = router;

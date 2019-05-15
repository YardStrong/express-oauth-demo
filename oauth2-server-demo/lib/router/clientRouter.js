const router = require('express').Router();
const clientController = require('../controller/clientController');
const adminOperatorFilter = function(req, res, next) {
    if(req.headers['operator'] != 'admin' || req.headers['opcode'] != '123456789')
        return res.unauthorized();
    next();
}

router.post('/newClient', adminOperatorFilter, clientController.newClient);
router.get('/deleteClient', adminOperatorFilter, clientController.deleteClient);


module.exports = router;

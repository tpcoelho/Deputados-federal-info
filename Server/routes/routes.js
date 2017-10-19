
var express = require('express');
var actions = require('../methods/actions');

var router = express.Router();

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Content-Type', 'application/json');
    // Website you wish to allow to connect
    res.header("Access-Control-Allow-Origin", "*");
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    next();
  });

router.post('/deputados', actions.addNewDeputado);
router.get('/deputados', actions.getDeputado);

router.get('/ping', actions.ping);

module.exports = router;
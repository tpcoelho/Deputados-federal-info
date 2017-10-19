
var express = require('express');
var actions = require('../methods/actions');

var router = express.Router();

router.post('/addDeputado', actions.addNewDeputado);

router.get('/ping', actions.ping);

module.exports = router;
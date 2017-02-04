var express = require('express');
var router = express.Router();

module.exports = router;

router.get('/', function(req, res) {
   res.send('api works'); 
});

router.get('/test', function(req, res) {
    res.send('this test works.');
});

router.get('*', function(req, res) {
    res.status(404).send();
});
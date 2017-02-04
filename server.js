var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var api = require('./server/routes/api.js');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', api);

app.get('*', function(req, res) {
    res.sendFile('index.html');
});

var port = process.env.PORT || 3000;
app.set('port', port);

app.listen(port, function() {
    console.log('API running on locahost:'+port);
});
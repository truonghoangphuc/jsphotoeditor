var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '/static')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    // res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/photo', function(req, res) {
  
});

app.post('/api/photo', function(req, res) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl.replace('/api/photo','');
  var image = req.body.data;
  var data = image.replace(/^data:image\/\w+;base64,/, '');
  var fileName = '/static/data/' + Date.now() + '.png';
  var fullFileName = path.join(__dirname, fileName); 
  fs.writeFile(fullFileName, data, {encoding: 'base64'}, function(err){
    res.json({'photoURL':fullUrl + fileName.replace('/static','')});
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

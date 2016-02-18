'use strict';
var express = require('express');
var app = express();
var parser = require('body-parser');
var path = require('path');
var userRoute = require('./server/routes/user');
var documentRoute = require('./server/routes/document');
var roleRoute = require('./server/routes/role');


app.use(parser.urlencoded({
  extended: true
}));

app.use(parser.json());

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, './public')));

var router = express.Router();
app.use('/api', router);

router.get('/', (req, res) => {
  res.status(200).json({
    'welcome': 'Welcome to the DMS API'
  });
});

userRoute(router);
documentRoute(router);
roleRoute(router);

app.use((req, res) => {
  return res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000);
console.log('Listening at http://localhost:' + process.env.PORT || 3000);
module.exports = app;

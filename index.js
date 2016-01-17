'use strict';
var express = require('express');
var app = express();
var parser = require('body-parser');
var userRoute = require('./server/routes/user');
var documentRoute = require('./server/routes/document');
var roleRoute = require('./server/routes/role');

app.use(parser.urlencoded({
  extended: true
}));
app.use(parser.json());

var router = express.Router();
app.use('/', router);

router.get('/', (req, res) => {
  res.status(200).json({
    'welcome': 'Welcome to the DMS'
  });
});

userRoute(router);
documentRoute(router);
roleRoute(router);

app.listen(3000);
console.log('Listening at http://localhost:' + 3000);
module.exports = app;

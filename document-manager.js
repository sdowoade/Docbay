var express = require('express');
var app = express();
var parser = require('body-parser');
var userCtrl = require('./server/controllers/user');
var roleCtrl = require('./server/controllers/role');
var documentCtrl = require('./server/controllers/document');
var authCtrl = require('./server/authentication/auth');


app.use(parser.urlencoded({
  extended: false
}));
app.use(parser.json());

var router = express.Router();
app.use('/', router);


router.post('/login', function(req, res) {
  authCtrl.authenticate(req, res);
});

router.get('/', function(req, res) {
  res.status(200).json({
    'welcome': 'Welcome to the DMS'
  });
});

/*Users route handle finding matching instance of users
and creating new users*/
router.route('/users')

.get(function(req, res) {
  userCtrl.getAllUsers(function(err, users) {
    err ? res.status(err.status).send(err) : res.status(200).json(users);
  });
})

.post(function(req, res) {
  userCtrl.createUser(req.body, function(err, user) {
    err ? res.status(err.status).send(err) : res.status(201).json(user);
  });
});

/*Users route -finds an existing user,
update user attributes and delete user*/
router.route('/users/:id')

.get(function(req, res) {
  userCtrl.getUser(req.params.id, function(err, user) {
    err ? res.status(err.status).send(err) : res.status(200).json(user);
  });
})

.put(authCtrl.authorise, function(req, res) {
  userCtrl.updateUser(req.params.id, req.body, req.decoded._doc, function(err, user) {
    err ? res.status(err.status).send(err) : res.status(200).json(user);
  });
})

.delete(authCtrl.authorise, function(req, res) {
  userCtrl.deleteUser(req.params.id, req.decoded._doc, function(err, user) {
    err ? res.status(err.status).send(err) : res.status(200).json({
      message: 'Deleted'
    });
  });
});


/*document route handle finding matching instance documents
and creating new documents*/
router.route('/documents')

.get(function(req, res) {
  documentCtrl.getAllDocuments(50, function(err, docs) {
    err ? res.status(err.status).send(err) : res.status(200).json(docs);
  });
})

.post(authCtrl.authorise, function(req, res) {
  documentCtrl.createDocument(req.body, req.decoded._doc, function(err, doc) {
    err ? res.status(err.status).send(err) : res.status(201).json(doc);

  });

});


/*document route -finds an existing document,
update document attributes and delete document*/
router.route('/documents/:id')

.get(function(req, res) {
  documentCtrl.getDocument(req.params.id, function(err, docs) {
    err ? res.status(err.status).send(err) : res.status(200).json(docs);
  });
})

.put(authCtrl.authorise, function(req, res) {
  documentCtrl.updateDocument(req.params.id, req.body, req.decoded._doc, function(err, user) {
    err ? res.status(err.status).send(err) : res.status(200).json({
      message: 'Updated'
    });
  });
})

.delete(authCtrl.authorise, function(req, res) {
  documentCtrl.deleteDocument(req.params.id, req.decoded._doc, function(err, docs) {
    err ? res.status(err.status).send(err) : res.status(200).json({
      message: 'Deleted'
    });
  });
});


router.get('/users/:id/documents', function(req, res) {
  documentCtrl.getDocumentByUser(req.params.id, function(err, docs) {
    err ? res.status(err.status).send(err) : res.status(200).json({
      message: 'Deleted'
    });
  })
});

app.listen(3000);
console.log('Magic happens at http://localhost:' + 3000);
module.exports = app;

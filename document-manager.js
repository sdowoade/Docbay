'use strict';
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

router.post('/users/login', (req, res) => {
  authCtrl.authenticate(req, res);
});

router.post('/users/logout', (req, res) => {
  res.status(200).json({
    'message': 'Goodbye'
  });
});

router.get('/', (req, res) => {
  res.status(200).json({
    'welcome': 'Welcome to the DMS'
  });
});

/*Users route handle finding matching instance of users
and creating new users*/
router.route('/users')
  .get((req, res) => {
    userCtrl.getAllUsers((err, users) => {
      err ? res.status(err.status).send(err) : res.status(200).json(users);
    });
  })

.post((req, res) => {
  userCtrl.createUser(req.body, (err, user) => {
    err ? res.status(err.status).send(err) : res.status(201).json(user);
  });
});

/*Users route -finds an existing user,
update user attributes and delete user*/
router.route('/users/:id')

.get((req, res) => {
  userCtrl.getUser(req.params.id, (err, user) => {
    err ? res.status(err.status).send(err) : res.status(200).json(user);
  });
})

.put(authCtrl.authorise, (req, res) => {
  userCtrl.updateUser(req.params.id, req.body,
    req.decoded._doc, (err, user) => {
      err ? res.status(err.status).send(err) : res.status(200).json(user);
    });
})

.delete(authCtrl.authorise, (req, res) => {
  userCtrl.deleteUser(req.params.id, req.decoded._doc, (err, user) => {
    err ? res.status(err.status).send(err) : res.status(200).json({
      message: 'Deleted'
    });
  });
});

/*document route handle finding matching instance documents
and creating new documents*/
router.route('/documents')

.get((req, res) => {
  documentCtrl.getAllDocuments(req.query.limit, (err, docs) => {
    err ? res.status(err.status).send(err) : res.status(200).json(docs);
  });
})

.post(authCtrl.authorise, (req, res) => {
  documentCtrl.createDocument(req.body, req.decoded._doc, (err, doc) => {
    err ? res.status(err.status).send(err) : res.status(201).json(doc);

  });
});

/*document route -finds an existing document,
update document attributes and delete document*/
router.route('/documents/:id')

.get((req, res) => {
  documentCtrl.getDocument(req.params.id, (err, docs) => {
    err ? res.status(err.status).send(err) : res.status(200).json(docs);
  });
})

.put(authCtrl.authorise, (req, res) => {
  documentCtrl.updateDocument(req.params.id, req.body,
    req.decoded._doc, (err, user) => {
      err ? res.status(err.status).send(err) : res.status(200).json({
        message: 'Updated'
      });
    });
})

.delete(authCtrl.authorise, (req, res) => {
  documentCtrl.deleteDocument(req.params.id, req.decoded._doc, (err, docs) => {
    err ? res.status(err.status).send(err) : res.status(200).json({
      message: 'Deleted'
    });
  });
});

/* get documents belonging to a user*/
router.get('/users/:id/documents', (req, res) => {
  documentCtrl.getAllDocumentsByUser(req.params.id,
    req.query.limit, (err, docs) => {
      err ? res.status(err.status).send(err) : res.status(200).json(docs);
    });
});

app.listen(3000);
console.log('Magic happens at http://localhost:' + 3000);
module.exports = app;

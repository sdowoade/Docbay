'use strict';
var userCtrl = require('../controllers/user');
var documentCtrl = require('../controllers/document');
var authCtrl = require('../authentication/auth');

module.exports = (router) => {
  router.post('/users/login', (req, res) => {
    authCtrl.authenticate(req, res);
  });

  router.post('/users/logout', (req, res) => {
    res.status(200).json({
      'message': 'Goodbye'
    });
  });

  /**
   *Users route handle finding matching instance of users
   *and creating new users
   */
  router.route('/users')

  .get((req, res) => {
    userCtrl.getAll((err, users) => {
      err ? res.status(err.status).send(err) : res.status(200).json(users);
    });
  })

  .post((req, res) => {
    userCtrl.create(req.body, (err, user) => {
      err ? res.status(err.status).send(err) : res.status(201).json(user);
    });
  });

  /**
   *Users route -finds an existing user,
   *update user attributes and delete user
   */
  router.route('/users/:id')

  .get((req, res) => {
    userCtrl.get(req.params.id, (err, user) => {
      err ? res.status(err.status).send(err) : res.status(200).json(user);
    });
  })

  .put(authCtrl.authorise, (req, res) => {
    userCtrl.update(req.params.id, req.body,
      req.decoded._doc, (err, user) => {
        err ? res.status(err.status).send(err) : res.status(200).json(user);
      });
  })

  .delete(authCtrl.authorise, (req, res) => {
    userCtrl.delete(req.params.id, req.decoded._doc, (err, user) => {
      err ? res.status(err.status).send(err) : res.status(200).json({
        message: 'Deleted'
      });
    });
  });

  /*get documents belonging to a user*/
  router.get('/users/:id/documents', (req, res) => {
    documentCtrl.getAllByUser(req.params.id,
      req.query.limit, (err, docs) => {
        err ? res.status(err.status).send(err) : res.status(200).json(docs);
      });
  });
};

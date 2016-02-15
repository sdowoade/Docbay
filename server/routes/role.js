'use strict';
var userCtrl = require('../controllers/user');
var documentCtrl = require('../controllers/document');
var roleCtrl = require('../controllers/role');
var authCtrl = require('../authentication/auth');

module.exports = (router) => {
  /**
   *role route handles finding matching instance of roles
   *and creating new roles
   */
  router.route('/roles')

  .get((req, res) => {
    roleCtrl.getAll((err, roles) => {
      err ? res.status(err.status).send(err) : res.status(200).json(roles);
    });
  })

  .post(authCtrl.authorise, (req, res) => {
    roleCtrl.create(req.body, req.decoded._doc, (err, role) => {
      err ? res.status(err.status).send(err) : res.status(201).json(role);
    });
  });

  /*get a single role by id*/
  router.get('/roles/:id', (req, res) => {
    roleCtrl.get(req.params.id, (err, role) => {
      err ? res.status(err.status).send(err) : res.status(200).json(role);
    });
  });

  /*get documents belonging to a role*/
  router.get('/roles/:id/documents', authCtrl.authorise, (req, res) => {
    documentCtrl.getAllByRole(req.params.id, req.decoded._doc,
      req.query.limit, req.query.skip, (err, docs) => {
        err ? res.status(err.status).send(err) : res.status(200).json(docs);
      });
  });

  /*get users in role*/
  router.get('/roles/:id/users', (req, res) => {
    userCtrl.getAllInRole(req.params.id, (err, docs) => {
      err ? res.status(err.status).send(err) : res.status(200).json(docs);
    });
  });
};

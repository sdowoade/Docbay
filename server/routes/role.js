'use strict';
var userCtrl = require('../controllers/user');
var roleCtrl = require('../controllers/role');
var authCtrl = require('../authentication/auth');

module.exports = (router) => {
  /*role route handles finding matching instance of roles
  and creating new roles*/
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
};

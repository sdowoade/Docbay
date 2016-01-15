'use strict';
var userCtrl = require('../controllers/user');
var documentCtrl = require('../controllers/document');
var authCtrl = require('../authentication/auth');

module.exports = (router) => {
  /*document route handle finding matching instance documents
   and creating new documents*/
  router.route('/documents')

  .get((req, res) => {
    documentCtrl.getAll(req.query.limit, (err, docs) => {
      err ? res.status(err.status).send(err) : res.status(200).json(docs);
    });
  })

  .post(authCtrl.authorise, (req, res) => {
    documentCtrl.create(req.body, req.decoded._doc, (err, doc) => {
      err ? res.status(err.status).send(err) : res.status(201).json(doc);
    });
  });

  /*document route -finds an existing document,
  update document attributes and delete document*/
  router.route('/documents/:id')

  .get((req, res) => {
    documentCtrl.get(req.params.id, (err, docs) => {
      err ? res.status(err.status).send(err) : res.status(200).json(docs);
    });
  })

  .put(authCtrl.authorise, (req, res) => {
    documentCtrl.update(req.params.id, req.body,
      req.decoded._doc, (err, user) => {
        err ? res.status(err.status).send(err) : res.status(200).json({
          message: 'Updated'
        });
      });
  })

  .delete(authCtrl.authorise, (req, res) => {
    documentCtrl.delete(req.params.id,
      req.decoded._doc, (err, docs) => {
        err ? res.status(err.status).send(err) : res.status(200).json({
          message: 'Deleted'
        });
      });
  });
};

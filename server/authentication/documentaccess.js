'use strict';
var userModel = require('../controllers/user');

var AuthCtrl = class {

  canAccessDocument(req, res, next) {

    documentCtrl.findOne({
      _id: req.params.id
    }, function(err, doc) {

      if (err) {
        res.status(500).send(err);
      } else {

      }

    });
  }

}

module.exports = new AuthCtrl();

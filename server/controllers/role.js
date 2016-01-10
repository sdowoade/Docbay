'use strict';
var roleModel = require('../models/role');
var userCtrl = require('./user');

  var roleCtrl = class {
    createRole(newRole, user, cb) {
      roleModel.create({
        title: newRole.title,
      }, function(err, role) {
        if (!err) {
          userCtrl.assignRole(user._id, role._id, function(err,user) {
            cb(null, role);
          });
        } else {
          cb({
            'status': 409,
            'actual': err
          })
        }
      });
    }

    getAllRoles(cb) {
      roleModel.find({}, function(err, roles) {
        err ? cb({
          'status': 500,
          'actual': err
        }) : cb(null, roles);
      })
    }
  };

module.exports = new roleCtrl();

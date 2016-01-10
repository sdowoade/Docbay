'use strict';
var roleModel = require('../models/role');
var userCtrl = require('./user');

var RoleCtrl = class {
  createRole(newRole, user, cb) {
    roleModel.create({
      title: newRole.title,
    }, (err, role) => {
      if (!err) {
        userCtrl.assignRole(user._id, role._id, (err, user) => {
          cb(null, role);
        });
      } else {
        cb({
          'status': 409,
          'actual': err
        });
      }
    });
  }

  getAllRoles(cb) {
    roleModel.find({}, (err, roles) => {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, roles);
    });
  }
};

module.exports = new RoleCtrl();

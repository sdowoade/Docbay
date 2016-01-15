'use strict';
var roleModel = require('../models/role');
var userCtrl = require('./user');

var RoleCtrl = class {
  /*Creates role and assigns the role to a user*/
  create(newRole, user, cb) {
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

  /*Query role model to get all roles*/
  getAll(cb) {
    roleModel.find({}, (err, roles) => {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, roles);
    });
  }
};

module.exports = new RoleCtrl();

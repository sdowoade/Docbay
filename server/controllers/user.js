'use strict';
var userModel = require('../models/user'),
  helpers = require('../../helpers/helpers'),
  bcrypt = require('bcrypt-nodejs');


var UserCtrl = class {
  /*Creates user with default public role
  and new user roles*/
  createUser(newUser, cb) {
    userModel.create({
      username: newUser.username,
      role: [0],
      name: {
        first: newUser.firstname,
        last: newUser.lastname,
      },
      email: newUser.email,
      password: bcrypt.hashSync(newUser.password),
    }, function(err, user) {
      err ? cb({
        'status': 409,
        'actual': err
      }) : cb(null, user);
    });
  }

  updateUser(id, newUser, user, cb) {
    if (user._id != id) {
      cb({
        'status': 401,
        'actual': {
          'message': 'Access Denied'
        }
      });
    } else {
      userModel.findById(id).exec(function(err, user) {
        if (err) {
          cb({
            'status': 404,
            'actual': {
              'message': 'User not found'
            }
          });
        }
        user.username = newUser.username || user.username;
        user.name = newUser.name || user.name;
        user.email = newUser.email || user.email;
        user.password = bcrypt.hashSync(newUser.password) || user.password;
        user.save(function(err, user) {
          err ? cb({
            'status': 409,
            'actual': err
          }) : cb(null, user);
        })
      });
    }
  }

  assignRole(id, roleId, cb) {
    userModel.findById(id).exec(function(err, user) {
      if (!user) {
        cb({
          'status': 404,
          'actual': {
            'message': 'User not found'
          }
        });
      } else {
        user.role = helpers.getUserRoles([user.role, roleId]);
        user.save(function(err, user) {
          err ? cb({
            'status': 500,
            'actual': err
          }) : cb(null, user);
        })
      }
    });

  }

  getAllUsers(cb) {
    userModel.find({}).exec(function(err, users) {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, users);
    });
  }

  getUser(id, cb) {
    userModel.findById(id).exec(function(err, user) {
      !user ? cb({
        'status': 404,
        'actual': err
      }) : cb(null, user);
    })
  }

  deleteUser(id, user, cb) {
    if (user._id != id) {
      cb({
        'status': 401,
        'actual': {
          'message': 'Access Denied'
        }
      });
    } else {
      userModel.remove({
        _id: id
      }, function(err, status) {
        err ? cb({
          'status': 500,
          'actual': err
        }) : cb(null, status);
      });
    }
  }
};

module.exports = new UserCtrl();

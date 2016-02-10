'use strict';
var userModel = require('../models/user'),
  helpers = require('../../helpers/helpers'),
  bcrypt = require('bcrypt-nodejs');


var UserCtrl = class {
  /*Creates user with default public role.*/
  create(newUser, cb) {
    userModel.create({
      username: newUser.username,
      role: [0],
      name: {
        first: newUser.firstname,
        last: newUser.lastname,
      },
      email: newUser.email,
      password: bcrypt.hashSync(newUser.password),
    }, (err, user) => {
      err ? cb({
        'status': 409,
        'actual': err
      }) : cb(null, user);
    });
  }

  /*Updates user with default public role.*/
  update(id, newUser, user, cb) {
    if (user._id != id) {
      cb({
        'status': 403,
        'actual': {
          'message': 'Access Denied'
        }
      });
    } else {
      userModel.findById(id).exec((err, user) => {
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
        user.save((err, user) => {
          err ? cb({
            'status': 409,
            'actual': err
          }) : cb(null, user);
        });
      });
    }
  }

  /*Assign a specific role to a user.*/
  assignRole(id, roleId, cb) {
    userModel.findById(id).exec((err, user) => {
      if (!user) {
        cb({
          'status': 404,
          'actual': {
            'message': 'User not found'
          }
        });
      } else {
        user.role = helpers.getUserRoles([user.role, roleId]);
        user.save((err, user) => {
          err ? cb({
            'status': 500,
            'actual': err
          }) : cb(null, user);
        });
      }
    });
  }

  /*Query users model to get all users.*/
  getAll(cb) {
    userModel.find({}).exec((err, users) => {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, users);
    });
  }

  /*Query users model to get all users in a role.*/
  getAllInRole(id,cb) {
    userModel.find({role:id}).exec((err, users) => {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, users);
    });
  }

  /*Query users model to get a single user by id.*/
  get(id, cb) {
    userModel.findById(id).populate('role').exec((err, user) => {
      !(user) ? cb({
        'status': 404,
        'actual': err
      }): cb(null, user);
    });
  }

  /**
   *Deletes a user.
   *Conditional check to check if user has correct
   *access rights.
   */
  delete(id, user, cb) {
    if (user._id != id) {
      cb({
        'status': 403,
        'actual': {
          'message': 'Access Denied'
        }
      });
    } else {
      userModel.remove({
        _id: id
      }, (err, status) => {
        err ? cb({
          'status': 500,
          'actual': err
        }) : cb(null, status);
      });
    }
  }
};

module.exports = new UserCtrl();

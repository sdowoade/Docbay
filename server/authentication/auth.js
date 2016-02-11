'use strict';
var userModel = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var config = require('../config/app');

var AuthCtrl = class {
  /* login user and create token*/
  authenticate(req, res) {
    userModel.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (!user) {
          res.status(401).json({
            success: false,
            message: 'Authentication failed'
          });
        } else if (user) {
          if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.status(401).json({
              success: false,
              message: 'Authentication failed'
            });
          } else {
            var token = jwt.sign(user, config.secret, {
              expiresIn: 86400
            });
            user.password = null;
            res.json({
              success: true,
              message: 'Authenticated',
              token: token,
              data: user
            });
          }
        }
      }
    }).populate('role');
  }

  /*Use token to authorise user*/
  authorise(req, res, next) {
    var token = req.body.token || req.params.token ||
      req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).send({
        success: false,
        message: 'No token provided.'
      });
    }
  }

  /*Use token to authorise user*/
  session(req, res) {
    var token = req.body.token || req.params.token ||
      req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          res.status(200).json({
            success: true,
            message: 'Token exists.'
          });
        }
      });
    } else {
      return res.status(401).send({
        success: false,
        message: 'No token provided.'
      });
    }
  }
};

module.exports = new AuthCtrl();

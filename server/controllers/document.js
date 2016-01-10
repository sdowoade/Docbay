'use strict';

var documentModel = require('../models/document');
var moment = require('moment');

var documentCtrl = class {

  createDocument(newDocument, user, cb) {
    documentModel.create({
      ownerId: user._id,
      title: newDocument.title,
      role: newDocument.role,
      content: newDocument.content,
    }, function(err, doc) {
      err ? cb({
        'status': 409,
        'actual': err
      }) : cb(null, doc);
    });
  }

  updateDocument(id, newDocument, user, cb) {
    documentModel.findById(id).exec(function(err, doc) {
      if (!doc) {
        cb({
          'status': 404,
          'actual': err
        });
      } else {
        if (user._id != doc.ownerId && doc.role.intersect(user.role).length == 0) {
          cb({
            'status': 401,
            'actual': {
              'message': 'Access Denied'
            }
          });
        } else {
          doc.title = newDocument.title || doc.title;
          doc.role = newDocument.role || doc.role;
          doc.content = newDocument.content || doc.content;
          doc.save(function(err, doc) {
            err ? cb({
              'status': 409,
              'actual': err
            }) : cb(null, doc);
          })
        }
      }
    });
  }

  getAllDocuments(limit, cb) {
    documentModel.find({}, function(err, docs) {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, docs);
    }).limit(limit);
  }

  getDocument(id, cb) {
    documentModel.findById(id, function(err, doc) {
      !doc ? cb({
        'status': 404,
        'actual': err
      }) : cb(null, doc);
    });
  }

  getAllDocumentsByDate(date, limit, cb) {
    documentModel.find({
      dateCreated: {
        '$gte': moment(date).startOf('Day'),
        '$lte': moment(date).endOf('Day')
      }
    }, function(err, docs) {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, docs);
    }).limit(limit);
  }

  getAllDocumentsByRole(role, limit, cb) {
    documentModel.find({
      role: role
    }, function(err, docs) {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, docs);
    });
  }

  getAllDocumentsByUser(id, limit, cb) {
    documentModel.find({
      ownerId: id
    }, function(err, docs) {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, docs);
    });
  }


  deleteDocument(id, user, cb) {
    documentModel.findById(id).exec(function(err, doc) {
      if (!doc) {
        cb({
          'status': 404,
          'actual': {
            'message': 'Not Found'
          }
        });
      } else {
        if (user._id != doc.ownerId) {
          cb({
            'status': 401,
            'actual': {
              'message': 'Access Denied'
            }
          });
        } else {
          documentModel.remove({
            _id: id
          }, function(err, status) {
            err ? cb({
              'status': 500,
              'actual': err
            }) : cb(null, status);
          });
        }
      }
    })
  }
};

module.exports = new documentCtrl();

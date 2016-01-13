'use strict';

var documentModel = require('../models/document');
var moment = require('moment');

var DocumentCtrl = class {
  createDocument(newDocument, user, cb) {
    documentModel.create({
      ownerId: user._id,
      title: newDocument.title,
      role: newDocument.role,
      content: newDocument.content,
    }, (err, doc) => {
      err ? cb({
        'status': 409,
        'actual': err
      }) : cb(null, doc);
    });
  }

  updateDocument(id, newDocument, user, cb) {
    documentModel.findById(id).exec((err, doc) => {
      if (!doc) {
        cb({
          'status': 404,
          'actual': err
        });
      } else {
        if (user._id !== doc.ownerId || doc.role.intersect(user.role).length === 0) {
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
          doc.save((err, doc) => {
            err ? cb({
              'status': 409,
              'actual': err
            }) : cb(null, doc);
          });
        }
      }
    });
  }

  getAllDocuments(limit, cb) {
    limit = limit || 50;
    documentModel.find({}, (err, docs) => {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, docs);
    }).limit(limit);
  }

  getDocument(id, cb) {
    documentModel.findById(id, (err, doc) => {
      !doc ? cb({
        'status': 404,
        'actual': err
      }) : cb(null, doc);
    });
  }

  getAllDocumentsByDate(date, limit, cb) {
    limit = limit || 50;
    documentModel.find({
      dateCreated: {
        '$gte': moment(date).startOf('Day'),
        '$lte': moment(date).endOf('Day')
      }
    }, (err, docs) => {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, docs);
    }).limit(limit);
  }

  getAllDocumentsByRole(role, limit, cb) {
    limit = limit || 50;
    documentModel.find({
      role: role
    }, (err, docs) => {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, docs);
    }).limit(limit);
  }

  getAllDocumentsByUser(id, limit, cb) {
    limit = limit || 50;
    documentModel.find({
      ownerId: id
    }, (err, docs) => {
      err ? cb({
        'status': 500,
        'actual': err
      }) : cb(null, docs);
    }).limit(limit);
  }

  deleteDocument(id, user, cb) {
    documentModel.findById(id).exec((err, doc) => {
      if (!doc) {
        cb({
          'status': 404,
          'actual': {
            'message': 'Not Found'
          }
        });
      } else {
        if (user._id !== doc.ownerId) {
          cb({
            'status': 401,
            'actual': {
              'message': 'Access Denied'
            }
          });
        } else {
          documentModel.remove({
            _id: id
          }, (err, status) => {
            err ? cb({
              'status': 500,
              'actual': err
            }) : cb(null, status);
          });
        }
      }
    });
  }
};

module.exports = new DocumentCtrl();

/*Document Spec: contains tests for document controllers and routes.*/
'use strict';
process.env.NODE_ENV = 'testing';
var mongoose = require('../../server/config/db'),
  moment = require('moment'),
  mockgoose = require('mockgoose'),
  roleModel = require('../../server/models/role'),
  userCtrl = require('../../server/controllers/user'),
  roleCtrl = require('../../server/controllers/role'),
  documentCtrl = require('../../server/controllers/document'),
  testUsers = require('./data/users'),
  testDocuments = require('./data/documents'),
  app = require('../../index'),
  request = require('supertest')(app),
  async = require('async');

mockgoose(mongoose);

describe('Document', () => {
  beforeAll((done) => {
    console.log('Running document test suite');
    var documents = [testDocuments.docy, testDocuments.docz];
    var users = [testUsers.dotun, testUsers.walter];
    var usersForDocs = [testUsers.fakeUser_1, testUsers.fakeUser_2];
    mockgoose.reset(() => {
      async.series([
        (callback) => {
          roleModel.count({}, function(err, count) {
            if (count === 0) {
              roleModel.create({
                title: '_Public',
              }, (err, role) => {
                console.log(role)
                callback(err, role);
              });
            }
          });
        }, (callback) => {
          async.times(2, (iter, next) => {
            userCtrl.create(users[iter], (err, user) => {
              next(err, user);
            });
          }, (err, users) => {
            callback(err, users);
          });
        }, (callback) => {
          async.times(2, (iter, next) => {
            documentCtrl.create(documents[iter],
              usersForDocs[iter], (err, doc) => {
                next(err, doc);
              });
          }, (err, docs) => {
            callback(err, docs);
          });
        }
      ], (err, results) => {
        done();
      });
    });
  });

  afterAll((done) => {
    mockgoose.reset(() => {
      done();
    });
  });

  it('should ensure new document is unique', (done) => {
    async.times(2, (iter, next) => {
      documentCtrl.create(testDocuments.docx,
        testUsers.fakeUser_1, (err, doc) => {
          next(err, doc);
        });
    }, (err, docs) => {
      expect(err.actual.code).toEqual(11000);
      done();
    });
  });

  it('should get all documents specified by limit', (done) => {
    async.times(2, (iter, next) => {
      documentCtrl.getAll(iter + 1, (err, doc) => {
        next(err, doc);
      });
    }, (err, docs) => {
      expect(docs[0].length).toBe(1);
      expect(docs[1].length).toBe(2);
      done();
    });
  });

  it('should get all documents in order of date of creation', (done) => {
    documentCtrl.getAll(2, (err, docs) => {
      expect(docs[1].dateCreated)
        .not.toBeLessThan(
          docs[0].dateCreated
        );
      done();
    });
  });

  it('should search document by date', (done) => {
    documentCtrl.getAllByDate(moment().format(), 1, (err, docs) => {
      expect(moment(docs[0].dateCreated).startOf('Day').format())
        .toBe(moment().startOf('Day').format());
      done();
    });
  });

  it('should search document by user', (done) => {
    documentCtrl.getAllByUser(1, testUsers.fakeUser_1, 1, (err, docs) => {
      docs.forEach((x) => expect(x.ownerId).toBe(1));
      done();
    });
  });

  it('should search document by role', (done) => {
    documentCtrl.getAllByRole(0, testUsers.fakeUser_1, 1, (err, docs) => {
      docs.forEach((x) => expect(x.role).toContain(0));
      done();
    });
  });

  describe('Endpoints', () => {
    var testToken;
    beforeAll((done) => {
      request.post('/api/users/login')
        .send(testUsers.walter)
        .end((err, res) => {
          testToken = res.body.token;
          done();
        });
    });

    it('should GET /documents/', (done) => {
      request.get('/api/documents')
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(3);
          expect(res.body[0]).toEqual(jasmine.objectContaining({
            'title': 'Doc y'
          }));
          done();
        });
    });

    it('should POST /documents/', (done) => {
      request.post('/api/documents')
        .set('x-access-token', testToken)
        .send(testDocuments.apidoc)
        .end((err, res) => {
          expect(res.status).toBe(201);
          done();
        });
    });

    it('should not POST /documents/', (done) => {
      request.post('/api/documents')
        .send(testDocuments.apidoc)
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
    });

    it('should GET /documents/id', (done) => {
      request.get('/api/documents/1')
        .end((err, res) => {
          expect(res.body).toEqual(jasmine.objectContaining({
            'title': 'Doc y'
          }));
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not GET /documents/id', (done) => {
      request.get('/api/documents/20')
        .end((err, res) => {
          expect(res.status).toBe(404);
          done();
        });
    });

    it('should PUT /documents/id', (done) => {
      request.put('/api/documents/2')
        .set('x-access-token', testToken)
        .send(testDocuments.docz)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not PUT /documents/id', (done) => {
      request.put('/api/documents/3')
        .set('x-access-token', testToken)
        .send(testDocuments.docz)
        .end((err, res) => {
          expect(res.status).toBe(403);
          done();
        });
    });

    it('should not DELETE /documents/', (done) => {
      request.delete('/api/documents/1')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(403);
          done();
        });
    });

    it('should DELETE /documents/', (done) => {
      request.delete('/api/documents/2')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not GET /users/id/documents', (done) => {
      request.get('/api/users/3/documents')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(403);
          done();
        });
    });

    it('should GET /users/id/documents', (done) => {
      request.get('/api/users/2/documents')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(1);
          done();
        });
    });
  });
});

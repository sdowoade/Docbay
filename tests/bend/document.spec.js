/*Document Spec: contains tests for document controllers and routes.*/
'use strict';
process.env.NODE_ENV = 'testing';
var moment = require('moment'),
  roleModel = require('../../server/models/role'),
  userCtrl = require('../../server/controllers/user'),
  roleCtrl = require('../../server/controllers/role'),
  documentCtrl = require('../../server/controllers/document'),
  documentModel = require('../../server/models/document'),
  testUsers = require('./data/users'),
  testDocuments = require('./data/documents'),
  path = 'http://localhost:3000',
  request = require('superagent'),
  async = require('async');


describe('Document', () => {
  beforeAll((done) => {
    console.log('Running document test suite');
    var documents = [testDocuments.docy, testDocuments.docz];
    var users = [testUsers.dotun, testUsers.walter];
    var usersForDocs = [testUsers.fakeUser_1, testUsers.fakeUser_2];

    async.series([
      (callback) => {
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

  it('should update document', (done) => {
    spyOn(documentModel, 'findById').and.callThrough();
    documentCtrl.update(3, testDocuments.docdx,
      testUsers.fakeUser_1, (err, doc) => {
        expect(err).toBeNull();
        expect(doc).toBeDefined();
        expect(documentModel.findById).toHaveBeenCalled();
        expect(doc.title).toEqual('Doc x change');
        expect(doc.content).toBeDefined();
        expect(doc.role).toBeDefined();
        done();
      });
  });

  it('should get a document', (done) => {
    spyOn(documentModel, 'findById').and.callThrough();
    documentCtrl.get(1, (err, doc) => {
      expect(doc).toBeDefined();
      expect(err).toBeNull();
      expect(documentModel.findById).toHaveBeenCalled();
      done();
    });
  });

  it('should not delete a document', (done) => {
    spyOn(documentModel, 'findById').and.callThrough();
    documentCtrl.delete(99, testUsers.fakeUser_1, (err, doc) => {
      expect(doc).not.toBeDefined();
      expect(err).not.toBeNull();
      expect(err.status).toBe(404);
      expect(documentModel.findById).toHaveBeenCalled();
      done();
    });
  });

  it('should not delete a document', (done) => {
    spyOn(documentModel, 'findById').and.callThrough();
    documentCtrl.delete(1, testUsers.fakeUser_2, (err, doc) => {
      expect(doc).not.toBeDefined();
      expect(err).not.toBeNull();
      expect(err.status).toBe(403);
      expect(documentModel.findById).toHaveBeenCalled();
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
    documentCtrl.getAllByUser(1, testUsers.fakeUser_1, 1, 0, (err, docs) => {
      docs.docs.forEach((x) => expect(x.ownerId).toBe(1));
      done();
    });
  });

  it('should search document by role', (done) => {
    documentCtrl.getAllByRole(0, testUsers.fakeUser_1, 1, 0, (err, docs) => {
      docs.docs.forEach((x) => expect(x.role).toContain(0));
      done();
    });
  });

  describe('Endpoints', () => {
    var testToken;
    beforeAll((done) => {
      request.post(path + '/api/users/login')
        .send(testUsers.walter)
        .end((err, res) => {
          testToken = res.body.token;
          done();
        });
    });

    it('should GET /documents/', (done) => {
      request.get(path + '/api/documents')
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
      request.post(path + '/api/documents')
        .set('x-access-token', testToken)
        .send(testDocuments.apidoc)
        .end((err, res) => {
          expect(res.status).toBe(201);
          done();
        });
    });

    it('should not POST /documents/', (done) => {
      request.post(path + '/api/documents')
        .send(testDocuments.apidoc)
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
    });

    it('should GET /documents/id', (done) => {
      request.get(path + '/api/documents/2')
        .end((err, res) => {
          expect(res.body).toEqual(jasmine.objectContaining({
            'title': 'Doc z'
          }));
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not GET /documents/id', (done) => {
      request.get(path + '/api/documents/20')
        .end((err, res) => {
          expect(res.status).toBe(404);
          done();
        });
    });

    it('should PUT /documents/id', (done) => {
      request.put(path + '/api/documents/2')
        .set('x-access-token', testToken)
        .send(testDocuments.docz)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not PUT /documents/id', (done) => {
      request.put(path + '/api/documents/3')
        .set('x-access-token', testToken)
        .send(testDocuments.docz)
        .end((err, res) => {
          expect(res.status).toBe(403);
          done();
        });
    });

    it('should not DELETE /documents/id', (done) => {
      request.delete(path + '/api/documents/1')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(403);
          done();
        });
    });

    it('should DELETE /documents/id', (done) => {
      request.delete(path + '/api/documents/2')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not GET /users/id/documents', (done) => {
      request.get(path + '/api/users/1/documents')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(403);
          done();
        });
    });

    it('should GET /users/id/documents', (done) => {
      request.get(path + '/api/users/3/documents')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.docs.length).toBe(1);
          done();
        });
    });
  });
});

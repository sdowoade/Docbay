'use strict';
var mongoose = require('./db_connect'),
  moment = require('moment'),
  mockgoose = require('mockgoose'),
  userCtrl = require('./server/controllers/user'),
  roleCtrl = require('./server/controllers/role'),
  documentCtrl = require('./server/controllers/document'),
  app = require('./document-manager'),
  request = require('supertest')(app),
  async = require('async');

mockgoose(mongoose);

var testUsers = {
  'dotun': {
    username: 'dowoade',
    firstname: 'Dotun',
    lastname: 'Owoade',
    email: 'd@c.com',
    password: 'pass'
  },
  'apiuser': {
    username: 'shelly',
    firstname: 'Sheldon',
    lastname: 'cooper',
    email: 'big@bang.com',
    password: 'pass'
  },
  'walter': {
    username: 'breakingbad',
    firstname: 'Walter',
    lastname: 'White',
    email: 'ww@bad.com',
    password: 'pass'
  },
  'noLastname': {
    username: 'breakingbad',
    firstname: 'Walter',
    email: 'ww@bad.com',
    password: 'pass'
  },
  'noFirstname': {
    username: 'breakingbad',
    lastname: 'White',
    email: 'ww@bad.com',
    password: 'pass'
  },
  'fakeX': {
    _id: 0,
  },
  'fakeY': {
    _id: 2,
  }
};

var testRoles = {
  'x': {
    title: 'can do x',
  },
  'y': {
    title: 'can do y',
  }
};

var testDocuments = {
  'docx': {
    title: 'Doc x',
    content: 'some content for x',
    role: [0],
  },
  'docy': {
    title: 'Doc y',
    content: 'some content for x',
    role: [0],
  },
  'docz': {
    title: 'Doc z',
    content: 'some content for z',
    role: [0],
  },
  'apidoc': {
    title: 'Bazinga',
    content: 'some content for Bazzinga',
    role: [0],
  }
};

describe('Document management system', () => {
  beforeAll((done) => {
    mockgoose.reset(() => {
      done();
    });
  });

  afterAll((done) => {
    mockgoose.reset(() => {
      done();
    });
  });

  describe('User', () => {
    it('should ensure new user is unique', (done) => {
      async.times(2, (iter, next) => {
        userCtrl.createUser(testUsers.dotun, (err, user) => {
          next(err, user);
        });
      }, (err, users) => {
        expect(err).not.toBeNull();
        expect(err.status).toBe(409);
        expect(err.actual.code).toBe(11000);
        done();
      });
    });

    it('should ensure new user has a role', (done) => {
      userCtrl.createUser(testUsers.walter, (err, user) => {
        expect(err).toBeNull();
        expect(user).not.toBeNull();
        expect(user.role).toBeTruthy();
        expect(user.role.length).toBeGreaterThan(0);
        expect(user.role[0]).toBeDefined();
        done();
      });
    });

    it('should ensure new user has first name', (done) => {
      userCtrl.createUser(testUsers.noFirstname, (err, user) => {
        expect(err).not.toBeNull();
        expect(user).not.toBeDefined();
        expect(err.actual.message).toEqual('User validation failed');
        expect(err.actual.errors).toEqual(jasmine.objectContaining({
          'name.first': jasmine.anything()
        }));
        done();
      });
    });

    it('should ensure new user has last name', (done) => {
      userCtrl.createUser(testUsers.noLastname, (err, user) => {
        expect(err).not.toBeNull();
        expect(user).not.toBeDefined();
        expect(err.actual.message).toEqual('User validation failed');
        expect(err.actual.errors).toEqual(jasmine.objectContaining({
          'name.last': jasmine.anything()
        }));
        done();
      });
    });

    it('should get all users', (done) => {
      userCtrl.getAllUsers((err, users) => {
        expect(users).toBeDefined();
        expect(users.length).toBe(2);
        done();
      });
    });
  });

  describe('Role', () => {
    it('should ensure new role is unique', (done) => {
      async.times(2, (iter, next) => {
        roleCtrl.createRole(testRoles.x, testUsers.fakeX, (err, role) => {
          next(err, role);
        });
      }, (err, roles) => {
        expect(err).not.toBeNull();
        expect(err.actual.code).toBe(11000);
        done();
      });
    });

    it('should get all roles', (done) => {
      roleCtrl.getAllRoles((err, roles) => {
        expect(roles).toBeDefined();
        expect(roles.length).toBe(2);
        done();
      });
    });
  });

  describe('Document', () => {
    beforeAll((done) => {
      var documents = [testDocuments.docy, testDocuments.docz];
      var users = [testUsers.fakeX, testUsers.fakeY];
      async.times(2, (iter, next) => {
        documentCtrl.createDocument(documents[iter], users[iter], (err, doc) => {
          next(err, doc);
        });
      }, (err, docs) => {
        done();
      });
    });

    it('should ensure new document is unique', (done) => {
      async.times(2, (iter, next) => {
        documentCtrl.createDocument(testDocuments.docx, testUsers.fakeX, (err, doc) => {
          next(err, doc);
        });
      }, (err, docs) => {
        expect(err.actual.code).toEqual(11000);
        done();
      });
    });

    it('should get all document specified by limit', (done) => {
      async.times(2, (iter, next) => {
        documentCtrl.getAllDocuments(iter + 1, (err, doc) => {
          next(err, doc);
        });
      }, (err, docs) => {
        expect(docs[0].length).toBe(1);
        expect(docs[1].length).toBe(2);
        done();
      });
    });

    it('should get all documents in order of date of creation', (done) => {
      documentCtrl.getAllDocuments(2, (err, docs) => {
        expect(docs[1].dateCreated)
          .not.toBeLessThan(
            docs[0].dateCreated
          );
        done();
      });
    });
  });

  describe('Search', () => {
    it('should search document by date', (done) => {
      documentCtrl.getAllDocumentsByDate(moment().format(), 1, (err, docs) => {
        expect(moment(docs[0].dateCreated).startOf('Day').format()).toBe(moment().startOf('Day').format());
        done();
      });
    });

    it('should search document by user', (done) => {
      documentCtrl.getAllDocumentsByUser(0, 1, (err, docs) => {
        docs.forEach((x) => expect(docs[0].ownerId).toBe(0));
        done();
      });
    });

    it('should search document by role', (done) => {
      documentCtrl.getAllDocumentsByRole(0, 1, (err, docs) => {
        docs.forEach((x) => expect(docs[0].role.indexOf(0)).not.toBe(-1));
        done();
      });
    });
  });

  describe('Api Endpoints', () => {
    var testToken;
    beforeAll((done) => {
      request.post('/login')
        .send(testUsers.walter)
        .end((err, res) => {
          testToken = res.body.token;
          done();
        });
    });

    it('should /', (done) => {
      request.get('/')
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should GET /users/', (done) => {
      request.get('/users')
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(2);
          expect(res.body[0]).toEqual(jasmine.objectContaining({
            'username': 'dowoade'
          }));
          done();
        });
    });

    it('should POST /users/', (done) => {
      request.post('/users')
        .send(testUsers.apiuser)
        .end((err, res) => {
          expect(res.status).toBe(201);
          done();
        });
    });

    it('should GET /users/id', (done) => {
      request.get('/users/0')
        .end((err, res) => {
          expect(res.body).toEqual(jasmine.objectContaining({
            'username': 'dowoade'
          }));
          expect(res.status).toBe(200);
          done();
        });
      request.get('/users/20')
        .end((err, res) => {
          expect(res.status).toBe(404);
          done();
        });
    });

    it('should PUT /users/id', (done) => {
      request.put('/users/3')
        .set('x-access-token', testToken)
        .send(testUsers.apiuser)
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
      request.put('/users/2')
        .set('x-access-token', testToken)
        .send(testUsers.walter)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should DELETE /users/', (done) => {
      request.delete('/users/3')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
      request.delete('/users/2')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should GET /documents/', (done) => {
      request.get('/documents')
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
      request.post('/documents')
        .set('x-access-token', testToken)
        .send(testDocuments.apidoc)
        .end((err, res) => {
          expect(res.status).toBe(201);
          done();
        });
    });

    it('should GET /documents/id', (done) => {
      request.get('/documents/0')
        .end((err, res) => {
          expect(res.body).toEqual(jasmine.objectContaining({
            'title': 'Doc y'
          }));
          expect(res.status).toBe(200);
          done();
        });
      request.get('/documents/20')
        .end((err, res) => {
          expect(res.status).toBe(404);
          done();
        });
    });

    it('should PUT /documents/id', (done) => {
      request.put('/documents/1')
        .set('x-access-token', testToken)
        .send(testDocuments.docz)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should DELETE /documents/', (done) => {
      request.delete('/documents/0')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
      request.delete('/documents/1')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should GET /users/id/documents', (done) => {
      request.get('/users/0/documents')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(2);
          done();
        });
    });
    
  });
});

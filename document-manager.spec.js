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


describe('Document management system', function() {
  console.log(mongoose.isMocked);
  beforeAll(function(done) {
    mockgoose.reset(function() {
      done();
    });
  });

  afterAll(function(done) {
    mockgoose.reset(function() {
      done();
    });
  });


  describe('User', function() {



    it('should ensure new user is unique', function(done) {
      async.times(2, function(iter, next) {
        userCtrl.createUser(testUsers.dotun, function(err, user) {
          next(err, user);
        });
      }, function(err, users) {
        expect(err).not.toBeNull();
        expect(err.status).toBe(409);
        expect(err.actual.code).toBe(11000);
        done();
      });
    });

    it('should ensure new user has a role', function(done) {
      userCtrl.createUser(testUsers.walter, function(err, user) {
        expect(err).toBeNull();
        expect(user).not.toBeNull();
        expect(user.role).toBeTruthy();
        expect(user.role.length).toBeGreaterThan(0);
        expect(user.role[0]).toBeDefined();
        done();
      });
    });

    it('should ensure new user has first name', function(done) {
      userCtrl.createUser(testUsers.noFirstname, function(err, user) {
        expect(err).not.toBeNull();
        expect(user).not.toBeDefined();
        expect(err.actual.message).toEqual('User validation failed');
        expect(err.actual.errors).toEqual(jasmine.objectContaining({
          'name.first': jasmine.anything()
        }));
        done();
      });
    });



    it('should ensure new user has last name', function(done) {
      userCtrl.createUser(testUsers.noLastname, function(err, user) {
        expect(err).not.toBeNull();
        expect(user).not.toBeDefined();
        expect(err.actual.message).toEqual('User validation failed');
        expect(err.actual.errors).toEqual(jasmine.objectContaining({
          'name.last': jasmine.anything()
        }));
        done();
      });
    });

    it('should get all users', function(done) {
      userCtrl.getAllUsers(function(err, users) {
        expect(users).toBeDefined();
        expect(users.length).toBe(2);
        done();
      });
    });

  });

  describe('Role', function() {
    it('should ensure new role is unique', function(done) {
      async.times(2, function(iter, next) {
        roleCtrl.createRole(testRoles.x, testUsers.fakeX, function(err, role) {
          next(err, role);
        });
      }, function(err, roles) {
        expect(err).not.toBeNull();
        expect(err.actual.code).toBe(11000);
        done();
      });
    });

    it('should get all roles', function(done) {
      roleCtrl.getAllRoles(function(err, roles) {
        expect(roles).toBeDefined();
        expect(roles.length).toBe(2);
        done();
      });
    });
  });

  describe('Document', function() {
    beforeAll(function(done) {
      var documents = [testDocuments.docy, testDocuments.docz];
      var users = [testUsers.fakeX, testUsers.fakeY];
      async.times(2, function(iter, next) {
        documentCtrl.createDocument(documents[iter], users[iter], function(err, doc) {
          next(err, doc);
        });
      }, function(err, docs) {
        done();
      });
    });

    it('should ensure new document is unique', function(done) {
      async.times(2, function(iter, next) {
        documentCtrl.createDocument(testDocuments.docx, testUsers.fakeX, function(err, doc) {
          next(err, doc);
        });
      }, function(err, docs) {
        expect(err.actual.code).toEqual(11000);
        done();
      });
    });

    it('should get all document specified by limit', function(done) {
      async.times(2, function(iter, next) {
        documentCtrl.getAllDocuments(iter + 1, function(err, doc) {
          next(err, doc);
        });
      }, function(err, docs) {
        expect(docs[0].length).toBe(1);
        expect(docs[1].length).toBe(2);
        done();
      });
    });

    it('should get all documents in order of date of creation', function(done) {
      documentCtrl.getAllDocuments(2, function(err, docs) {
        expect(docs[1].dateCreated)
          .not.toBeLessThan(
            docs[0].dateCreated
          );
        done();
      });
    });
  });

  describe('Search', function() {
    it('should search document by date', function(done) {
      documentCtrl.getAllDocumentsByDate(moment().format(), 1, function(err, docs) {
        expect(moment(docs[0].dateCreated).format()).toEqual(moment().format());
        done();
      });
    });

    it('should search document by user', function(done) {
      documentCtrl.getAllDocumentsByUser(0, 1, function(err, docs) {
        docs.forEach((x) => expect(docs[0].ownerId).toBe(0));
        done();
      });
    });

    it('should search document by role', function(done) {
      documentCtrl.getAllDocumentsByRole(0, 1, function(err, docs) {
        docs.forEach((x) => expect(docs[0].role.indexOf(0)).not.toBe(-1));
        done();
      });
    });
  });

  describe('Api Endpoints', function() {
    var testToken;
    beforeAll(function(done) {
      request.post('/login')
        .send(testUsers.walter)
        .end(function(err, res) {
          testToken = res.body.token;
          done();
        });

    });
    it('should /', function(done) {
      request.get('/')
        .end(function(err, res) {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should GET /users/', function(done) {
      request.get('/users')
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(2);
          expect(res.body[0]).toEqual(jasmine.objectContaining({
            'username': 'dowoade'
          }));
          done();
        });
    });

    it('should POST /users/', function(done) {
      request.post('/users')
        .send(testUsers.apiuser)
        .end(function(err, res) {
          expect(res.status).toBe(201);
          done();
        });
    });
    it('should GET /users/id', function(done) {
      request.get('/users/0')
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            'username': 'dowoade'
          }));
          expect(res.status).toBe(200);
          done();
        });

      request.get('/users/20')
        .end(function(err, res) {
          expect(res.status).toBe(404);
          done();
        });
    });

    it('should PUT /users/id', function(done) {
      request.put('/users/3')
        .set('x-access-token', testToken)
        .send(testUsers.apiuser)
        .end(function(err, res) {
          expect(res.status).toBe(401);
          done();
        });
      request.put('/users/2')
        .set('x-access-token', testToken)
        .send(testUsers.walter)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          done();
        });
    });
    it('should DELETE /users/', function(done) {
      request.delete('/users/3')
        .set('x-access-token', testToken)
        .end(function(err, res) {
          expect(res.status).toBe(401);
          done();
        });
      request.delete('/users/2')
        .set('x-access-token', testToken)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          done();
        });
    });


    it('should GET /documents/', function(done) {
      request.get('/documents')
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(3);
          expect(res.body[0]).toEqual(jasmine.objectContaining({
            'title': 'Doc y'
          }));
          done();
        });
    });

    it('should POST /documents/', function(done) {
      request.post('/documents')
        .set('x-access-token', testToken)
        .send(testDocuments.apidoc)
        .end(function(err, res) {
          expect(res.status).toBe(201);
          done();
        });
    });
    it('should GET /documents/id', function(done) {
      request.get('/documents/0')
        .end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            'title': 'Doc y'
          }));
          expect(res.status).toBe(200);
          done();
        });

      request.get('/documents/20')
        .end(function(err, res) {
          expect(res.status).toBe(404);
          done();
        });
    });

    it('should PUT /documents/id', function(done) {
      request.put('/documents/1')
        .set('x-access-token', testToken)
        .send(testDocuments.docz)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          done();
        });
    });
    it('should DELETE /documents/', function(done) {
      request.delete('/documents/0')
        .set('x-access-token', testToken)
        .end(function(err, res) {
          expect(res.status).toBe(401);
          done();
        });
      request.delete('/documents/1')
        .set('x-access-token', testToken)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          done();
        });
    });

  });
})

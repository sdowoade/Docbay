/*User Spec: contains tests for user controllers and routes.*/
'use strict';
process.env.NODE_ENV = 'testing';
var mongoose = require('../../server/config/db'),
  moment = require('moment'),
  mockgoose = require('mockgoose'),
  userCtrl = require('../../server/controllers/user'),
  roleCtrl = require('../../server/controllers/role'),
  documentCtrl = require('../../server/controllers/document'),
  testUsers = require('./data/users'),
  app = require('../../index'),
  request = require('supertest')(app),
  async = require('async');

mockgoose(mongoose);

describe('User', () => {
  beforeAll(() => {
    console.log('Running user test suite');
  });

  afterAll((done) => {
    mockgoose.reset(() => {
      done();
    });
  });

  it('should ensure new user is unique', (done) => {
    async.times(2, (iter, next) => {
      userCtrl.create(testUsers.dotun, (err, user) => {
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
    userCtrl.create(testUsers.walter, (err, user) => {
      expect(err).toBeNull();
      expect(user).not.toBeNull();
      expect(user.role).toBeTruthy();
      expect(user.role.length).toBeGreaterThan(0);
      expect(user.role[0]).toBeDefined();
      done();
    });
  });

  it('should ensure new user has first name', (done) => {
    userCtrl.create(testUsers.noFirstname, (err, user) => {
      expect(err).not.toBeNull();
      expect(user).not.toBeDefined();
      expect(err.actual.message).toEqual('Users validation failed');
      expect(err.actual.errors).toEqual(jasmine.objectContaining({
        'name.first': jasmine.anything()
      }));
      done();
    });
  });

  it('should ensure new user has last name', (done) => {
    userCtrl.create(testUsers.noLastname, (err, user) => {
      expect(err).not.toBeNull();
      expect(user).not.toBeDefined();
      expect(err.actual.message).toEqual('Users validation failed');
      expect(err.actual.errors).toEqual(jasmine.objectContaining({
        'name.last': jasmine.anything()
      }));
      done();
    });
  });

  it('should get all users', (done) => {
    userCtrl.getAll((err, users) => {
      expect(users).toBeDefined();
      expect(users.length).toBe(2);
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

    it('should /', (done) => {
      request.get('/api/')
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should GET /users/', (done) => {
      request.get('/api/users')
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
      request.post('/api/users')
        .send(testUsers.apiuser)
        .end((err, res) => {
          expect(res.status).toBe(201);
          done();
        });
    });

    it('should GET /users/id', (done) => {
      request.get('/api/users/1')
        .end((err, res) => {
          expect(res.body).toEqual(jasmine.objectContaining({
            'username': 'dowoade'
          }));
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not GET /users/id', (done) => {
      request.get('/api/users/20')
        .end((err, res) => {
          expect(res.status).toBe(404);
          done();
        });
    });

    it('should PUT /users/id', (done) => {
      request.put('/api/users/3')
        .set('x-access-token', testToken)
        .send(testUsers.walter)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not PUT /users/id', (done) => {
      request.put('/api/users/4')
        .set('x-access-token', testToken)
        .send(testUsers.apiuser)
        .end((err, res) => {
          expect(res.status).toBe(403);
          done();
        });
    });

    it('should not DELETE /users/id', (done) => {
      request.delete('/api/users/4')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(403);
          done();
        });
    });

    it('should DELETE /users/id', (done) => {
      request.delete('/api/users/3')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });
  });
});

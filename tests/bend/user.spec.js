/*User Spec: contains tests for user controllers and routes.*/
'use strict';
process.env.NODE_ENV = 'testing';
var moment = require('moment'),
  mockgoose = require('mockgoose'),
  userCtrl = require('../../server/controllers/user'),
  userModel = require('../../server/models/user'),
  roleCtrl = require('../../server/controllers/role'),
  documentCtrl = require('../../server/controllers/document'),
  testUsers = require('./data/users'),
  request = require('superagent'),
  path = 'http://localhost:3000',
  async = require('async');

describe('User', () => {
  beforeAll(() => {
    console.log('Running user test suite');
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

  it('should ensure only user can update self', (done) => {
    userCtrl.update(2, testUsers.dotun, testUsers.fakeUser_1, (err, user) => {
      expect(err).not.toBeNull();
      expect(user).not.toBeDefined();
      expect(err.actual.message).toEqual('Access Denied');
      expect(err.status).toEqual(403);
      done();
    });
  });

  it('should update user', (done) => {
    spyOn(userModel, 'findById').and.callThrough();
    userCtrl.update(1, testUsers.dotunImposter,
      testUsers.fakeUser_1, (err, user) => {
        expect(err).toBeNull();
        expect(user).toBeDefined();
        expect(userModel.findById).toHaveBeenCalled();
        expect(user.username).toEqual('dow');
        expect(user.name).toBeDefined();
        expect(user.name.first).toBe('Dot');
        expect(user.name.last).toBe('ade');
        expect(user.email).toEqual('d@d.com');
        expect(user.password).toBeDefined();
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

  it('should get a user', (done) => {
    spyOn(userModel, 'findById').and.callThrough();
    userCtrl.get(1, (err, user) => {
      expect(user).toBeDefined();
      expect(err).toBeNull();
      expect(userModel.findById).toHaveBeenCalled();
      done();
    });
  });

  it('should fail to get a user', (done) => {
    spyOn(userModel, 'findById').and.callThrough();
    userCtrl.get(19, (err, user) => {
      expect(err).not.toBeNull();
      expect(userModel.findById).toHaveBeenCalled();
      done();
    });
  });

  it('should gets users in role', (done) => {
    spyOn(userModel, 'find').and.callThrough();
    userCtrl.getAllInRole(0, (err, users) => {
      expect(err).toBeNull();
      expect(userModel.find).toHaveBeenCalled();
      users.forEach((x) => expect(x.role.indexOf(0)).not.toBe(-1));
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

    it('should /', (done) => {
      request.get(path + '/api/')
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should GET /users/', (done) => {
      request.get(path + '/api/users')
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(2);
          expect(res.body[0]).toEqual(jasmine.objectContaining({
            'username': 'dow'
          }));
          done();
        });
    });

    it('should POST /users/', (done) => {
      request.post(path + '/api/users')
        .send(testUsers.apiuser)
        .end((err, res) => {
          expect(res.status).toBe(201);
          done();
        });
    });

    it('should GET /users/id', (done) => {
      request.get(path + '/api/users/1')
        .end((err, res) => {
          expect(res.body).toEqual(jasmine.objectContaining({
            'username': 'dow'
          }));
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not GET /users/id', (done) => {
      request.get(path + '/api/users/20')
        .end((err, res) => {
          expect(res.status).toBe(404);
          done();
        });
    });

    it('should PUT /users/id', (done) => {
      request.put(path + '/api/users/3')
        .set('x-access-token', testToken)
        .send(testUsers.walter)
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not PUT /users/id', (done) => {
      request.put(path + '/api/users/4')
        .set('x-access-token', testToken)
        .send(testUsers.apiuser)
        .end((err, res) => {
          expect(res.status).toBe(403);
          done();
        });
    });

    it('should not DELETE /users/id', (done) => {
      request.delete(path + '/api/users/1')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(403);
          done();
        });
    });
  });
});

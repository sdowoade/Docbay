/*Role Spec: contains tests for role controllers and routes.*/
'use strict';
var mongoose = require('../../server/config/db'),
  moment = require('moment'),
  mockgoose = require('mockgoose'),
  userCtrl = require('../../server/controllers/user'),
  roleCtrl = require('../../server/controllers/role'),
  testUsers = require('./data/users'),
  testRoles = require('./data/roles'),
  app = require('../../index'),
  request = require('supertest')(app),
  async = require('async');

mockgoose(mongoose);

describe('Role', () => {
  beforeAll((done) => {
    console.log('Running role test suite');
    var users = [testUsers.dotun, testUsers.walter];
    async.times(2, (iter, next) => {
      userCtrl.create(users[iter], (err, user) => {
        next(err, user);
      });
    }, (err, users) => {
      done();
    });
  });

  afterAll((done) => {
    mockgoose.reset(() => {
      done();
    });
  });

  it('should ensure new role is unique', (done) => {
    async.times(2, (iter, next) => {
      roleCtrl.create(testRoles.admin, testUsers.fakeUser_1, (err, role) => {
        next(err, role);
      });
    }, (err, roles) => {
      expect(err).not.toBeNull();
      expect(err.actual.code).toBe(11000);
      done();
    });
  });

  it('should get all roles', (done) => {
    roleCtrl.getAll((err, roles) => {
      expect(roles).toBeDefined();
      expect(roles.length).toBe(2);
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

    it('should GET /roles/', (done) => {
      request.get('/api/roles')
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(2);
          expect(res.body[0]).toEqual(jasmine.objectContaining({
            'title': '_Public'
          }));
          done();
        });
    });

    it('should POST /roles/', (done) => {
      request.post('/api/roles')
        .set('x-access-token', testToken)
        .send(testRoles.sample_role_2)
        .end((err, res) => {
          expect(res.status).toBe(201);
          done();
        });
    });

    it('should not POST /roles/', (done) => {
      request.post('/api/roles')
        .send(testRoles.sample_role_2)
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
    });
  });
});

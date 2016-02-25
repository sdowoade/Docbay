/*Role Spec: contains tests for role controllers and routes.*/
'use strict';
process.env.NODE_ENV = 'testing';
var moment = require('moment'),
  userCtrl = require('../../server/controllers/user'),
  roleCtrl = require('../../server/controllers/role'),
  roleModel = require('../../server/models/role'),
  testUsers = require('./data/users'),
  testRoles = require('./data/roles'),
  path = 'http://localhost:3000',
  request = require('superagent'),
  async = require('async');


describe('Role', () => {
  beforeAll((done) => {
    console.log('Running role test suite');
    done();
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

  it('should get a role', (done) => {
    spyOn(roleModel, 'findById').and.callThrough();
    roleCtrl.get(0, (err, role) => {
      expect(role).toBeDefined();
      expect(err).toBeNull();
      expect(roleModel.findById).toHaveBeenCalled();
      done();
    });
  });

  it('should not get a role', (done) => {
    spyOn(roleModel, 'findById').and.callThrough();
    roleCtrl.get(99, (err, role) => {
      expect(role).not.toBeDefined();
      expect(err).not.toBeNull();
      expect(roleModel.findById).toHaveBeenCalled();
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

    it('should GET /roles/', (done) => {
      request.get(path + '/api/roles')
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(2);
          expect(res.body[0]).toEqual(jasmine.objectContaining({
            'title': 'Public'
          }));
          done();
        });
    });

    it('should GET /roles/:id/documents', (done) => {
      request.get(path + '/api/roles/0/documents')
        .set('x-access-token', testToken)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(2);
          done();
        });
    });

    it('should not GET /roles/:id/documents', (done) => {
      request.get(path + '/api/roles/0/documents')
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
    });

    it('should GET /roles/:id/users', (done) => {
      request.get(path + '/api/roles/0/users')
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(3);
          done();
        });
    });

    it('should GET /roles/:id', (done) => {
      request.get(path + '/api/roles/0')
        .end((err, res) => {
          expect(res.status).toBe(200);
          done();
        });
    });

    it('should not GET /roles/:id', (done) => {
      request.get(path + '/api/roles/99')
        .end((err, res) => {
          expect(res.status).toBe(404);
          done();
        });
    });

    it('should POST /roles/', (done) => {
      request.post(path + '/api/roles')
        .set('x-access-token', testToken)
        .send(testRoles.sample_role_2)
        .end((err, res) => {
          expect(res.status).toBe(201);
          done();
        });
    });

    it('should not POST /roles/', (done) => {
      request.post(path + '/api/roles')
        .send(testRoles.sample_role_2)
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
    });
  });
});

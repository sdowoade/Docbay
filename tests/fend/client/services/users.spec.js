'use strict';
describe('Users Service Test', () => {
  beforeEach(() => {
    module('docbay');
  });

  var Users,
    Auth,
    httpBackend;
    
  beforeEach(inject(function($injector) {
    httpBackend = $injector.get('$httpBackend');
    Users = $injector.get('Users');
    httpBackend.when('GET', 'views/landing.html')
      .respond(200, [{
        res: 'res'
      }]);

    httpBackend.when('GET', 'views/404.html')
      .respond(200, [{
        res: 'res'
      }]);

    httpBackend.when('GET', 'views/files.html')
      .respond(200, [{
        res: 'res'
      }]);
  }));

  describe('Users unit tests', () => {
    describe('Users resource unit tests', () => {
      it('update should be a function', () => {
        var response;
        var cb = (res) => {
          response = res;
        };

        httpBackend.whenPUT(/\/api\/users\/(.+)/,
            undefined, undefined, ['id'])
          .respond(200, {
            res: 'res'
          });

        Users.update({ id: 1 }, cb, cb);
        httpBackend.flush();
        expect(Users.update).toBeDefined();
        expect(typeof Users.update).toBe('function');
        expect(response.res).toBe('res');
      });

      it('save should be a function', () => {
        var response;
        var cb = (res) => {
          response = res;
        };

        httpBackend.whenPOST(/\/api\/users\//)
          .respond(200, {
            res: 'res'
          });

        Users.save({ id: 1 }, cb);
        httpBackend.flush();
        expect(Users.save).toBeDefined();
        expect(typeof Users.save).toBe('function');
        expect(response.res).toBe('res');
      });

      it('query should be a function', () => {
        var response;
        var cb = (res) => {
          response = res;
        };

        httpBackend.when('GET', '/api/users/').respond(200, ['res']);

        Users.query(cb);
        httpBackend.flush();
        expect(Users.query).toBeDefined();
        expect(typeof Users.query).toBe('function');
        expect(response).toBeDefined();
      });

      it('get should be a function', () => {
        var response;
        var cb = (res) => {
          response = res;
        };

        httpBackend.when('GET', '/api/users/').respond(200, {
          res: 'res'
        });

        httpBackend.whenGET(/\/api\/users\/(.+)/,
            undefined, undefined, ['id'])
          .respond(200, {
            res: 'res'
          });

        Users.get({ id: 1 }, cb);
        httpBackend.flush();
        expect(Users.get).toBeDefined();
        expect(typeof Users.get).toBe('function');
        expect(response.res).toBe('res');
      });

      it('delete should be a function', () => {
        var response;
        var cb = (res) => {
          response = res;
        };

        httpBackend.whenDELETE(/\/api\/users\/(.+)/,
            undefined, undefined, ['id'])
          .respond(200, {
            res: 'res'
          });

        Users.delete({ id: 1 }, cb);
        httpBackend.flush();
        expect(Users.delete).toBeDefined();
        expect(typeof Users.delete).toBe('function');
        expect(response.res).toBe('res');
      });

      it('remove should be a function', () => {
        var response;
        var cb = (res) => {
          response = res;
        };

        httpBackend.whenDELETE(/\/api\/users\/(.+)/,
            undefined, undefined, ['id'])
          .respond(200, {
            res: 'res'
          });

        Users.remove({ id: 1 }, cb);
        httpBackend.flush();
        expect(Users.remove).toBeDefined();
        expect(typeof Users.remove).toBe('function');
        expect(response.res).toBe('res');
      });
    });

    describe('Users.login unit test', () => {
      it('login should be a function', () => {
        expect(Users.login).toBeDefined();
      });

      it('should test login function', () => {
        var error, response;
        var cb = (err, res) => {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        httpBackend.when('POST', '/api/users/login').respond(200, {
          res: 'res'
        });

        Users.login({
          data: 'data'
        }, cb);

        httpBackend.flush();
        expect(response.res).toBeDefined();
        expect(response.res).toBe('res');
      });

      it('should test login function fail', () => {
        var error, response;
        var cb = (err, res) => {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        httpBackend.when('POST', '/api/users/login').respond(401, {
          err: 'err'
        });

        Users.login({
          username: 'data',
          password: 'data'
        }, cb);

        httpBackend.flush();
        expect(error.err).toBe('err');
      });
    });

    describe('Users.session unit test', () => {
      it('login should be a function', () => {
        expect(Users.session).toBeDefined();
      });

      it('should test session function', () => {
        var error, response;
        var cb = (err, res) => {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        httpBackend.when('GET', '/api/users/session').respond(200, {
          res: 'res'
        });

        Users.session(cb);
        httpBackend.flush();
        expect(response.res).toBeDefined();
        expect(response.res).toBe('res');
      });

      it('should test session function fail', () => {
        var error, response;
        var cb = (err, res) => {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        httpBackend.when('GET', '/api/users/session').respond(401, {
          err: 'err'
        });

        Users.session(cb);
        httpBackend.flush();
        expect(error.err).toBe('err');
      });
    });

    describe('Users.documents unit test', () => {
      it('documents should be a function', () => {
        expect(Users.documents).toBeDefined();
      });

      it('should test documents function', () => {
        var error, response;
        var cb = (err, res) => {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        httpBackend.whenGET(/\/api\/users\/(.+)\/documents/,
            undefined, undefined, ['id'])
          .respond(200, {
            res: 'res'
          });

        Users.documents({
          id: 'id'
        }, 1, cb);

        httpBackend.flush();
        expect(response.res).toBeDefined();
        expect(response.res).toBe('res');
      });

      it('should test documents function fail', () => {
        var error, response;
        var cb = (err, res) => {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        httpBackend.whenGET(/\/api\/users\/(.+)\/documents/,
            undefined, undefined, ['id'])
          .respond(500, {
            err: 'err'
          });

        Users.documents({
          id: 'id'
        }, 1, cb);

        httpBackend.flush();
        expect(error.err).toBeDefined();
        expect(error.err).toBe('err');
      });
    });

    describe('Users.assignRole unit test', () => {
      it('assignRole should be a function', () => {
        expect(Users.assignRole).toBeDefined();
      });

      it('should test success of assignRole function', () => {
        var error, response;
        var cb = (err, res) => {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        httpBackend.whenPOST(/\/api\/users\/(.+)\/roles/,
            undefined, undefined, ['id'])
          .respond(200, {
            res: 'res'
          });

        Users.assignRole({
          id: 'id'
        }, 'role', cb);

        httpBackend.flush();
        expect(response.res).toBeDefined();
        expect(response.res).toBe('res');
      });

      it('should test success of assignRole function', () => {
        var error, response;
        var cb = (err, res) => {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        httpBackend.whenPOST(/\/api\/users\/(.+)\/roles/,
            undefined, undefined, ['id'])
          .respond(500, {
            err: 'err'
          });

        Users.assignRole({
          id: 'id'
        }, 'role', cb);

        httpBackend.flush();
        expect(error.err).toBeDefined();
        expect(error.err).toBe('err');
      });
    });
  });
});

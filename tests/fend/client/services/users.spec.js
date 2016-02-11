'use strict';
describe('Users Service Test', () => {
  beforeEach(() => {
    module('docbay');
  });

  var Users,
    Auth,
    httpBackend;
  beforeEach(inject(($injector) => {
    httpBackend = $injector.get('$httpBackend');
    Users = $injector.get('Users');
    httpBackend.when('GET', 'views/landing.html')
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
        spyOn(Users, 'update').and.returnValue(0);
        Users.update();
        expect(Users.update).toBeDefined();
        expect(Users.update).toHaveBeenCalled();
        expect(typeof Users.update).toBe('function');
      });

      it('save should be a function', () => {
        spyOn(Users, 'save').and.returnValue(0);
        Users.save();
        expect(Users.save).toBeDefined();
        expect(Users.save).toHaveBeenCalled();
        expect(typeof Users.save).toBe('function');
      });

      it('query should be a function', () => {
        spyOn(Users, 'query').and.returnValue(0);
        Users.query();
        expect(Users.query).toBeDefined();
        expect(Users.query).toHaveBeenCalled();
        expect(typeof Users.query).toBe('function');
      });

      it('get should be a function', () => {
        spyOn(Users, 'get').and.returnValue(0);
        Users.get();
        expect(Users.get).toBeDefined();
        expect(Users.get).toHaveBeenCalled();
        expect(typeof Users.get).toBe('function');
      });

      it('delete should be a function', () => {
        spyOn(Users, 'delete').and.returnValue(0);
        Users.delete();
        expect(Users.delete).toBeDefined();
        expect(Users.delete).toHaveBeenCalled();
        expect(typeof Users.delete).toBe('function');
      });

      it('remove should be a function', () => {
        spyOn(Users, 'remove').and.returnValue(0);
        Users.remove();
        expect(Users.remove).toBeDefined();
        expect(Users.remove).toHaveBeenCalled();
        expect(typeof Users.remove).toBe('function');
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
        expect(error.err).toBeDefined();
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
        expect(error.err).toBeDefined();
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
        }, cb);
        httpBackend.flush();
        expect(response.res).toBeDefined();
        expect(response.res).toBe('res');
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
    });
  });
});

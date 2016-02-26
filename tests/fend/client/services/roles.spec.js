'use strict';
describe('Users Service Test', () => {

  beforeEach(() => {
    module('docbay');
  });

  var Users,
    Auth,
    Roles,
    httpBackend;
    
  beforeEach(inject(function($injector) {
    httpBackend = $injector.get('$httpBackend');
    Roles = $injector.get('Roles');
    Auth = $injector.get('Auth');
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

  describe('Roles unit tests', () => {
    describe('Roles resource unit tests', () => {
      it('save should be a function', () => {
        var response;
        var cb = (res) => {
          response = res;
        };

        httpBackend.whenPOST(/\/api\/roles/)
          .respond(200, {
            res: 'res'
          });

        Roles.save({ id: 1 }, cb);
        httpBackend.flush();
        expect(Roles.save).toBeDefined();
        expect(typeof Roles.save).toBe('function');
        expect(response.res).toBe('res');
      });

      it('query should be a function', () => {
        var response;
        var cb = (res) => {
          response = res;
        };

        httpBackend.when('GET', '/api/roles/').respond(200, ['res']);

        Roles.query(cb);
        httpBackend.flush();
        expect(Roles.query).toBeDefined();
        expect(typeof Roles.query).toBe('function');
        expect(response).toBeDefined();
      });

      it('get should be a function', () => {
        var response;
        var cb = (res) => {
          response = res;
        };

        httpBackend.when('GET', '/api/roles/').respond(200, {
          res: 'res'
        });

        httpBackend.whenGET(/\/api\/roles\/(.+)/,
            undefined, undefined, ['id'])
          .respond(200, {
            res: 'res'
          });

        Roles.get({ id: 1 }, cb);
        httpBackend.flush();
        expect(Roles.get).toBeDefined();
        expect(typeof Roles.get).toBe('function');
        expect(response.res).toBe('res');
      });
    });

    describe('Roles.documents unit test', () => {
      it('documents should be a function', () => {
        expect(Roles.documents).toBeDefined();
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

        httpBackend.whenGET(/\/api\/roles\/(.+)\/documents/,
            undefined, undefined, ['id'])
          .respond(200, {
            res: 'res'
          });

        Roles.documents({
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

        httpBackend.whenGET(/\/api\/roles\/(.+)\/documents/,
            undefined, undefined, ['id'])
          .respond(500, {
            err: 'err'
          });

        Roles.documents({
          id: 'id'
        }, 1, cb);

        httpBackend.flush();
        expect(error.err).toBeDefined();
        expect(error.err).toBe('err');
      });
    });

    describe('Roles.users unit test', () => {
      it('users should be a function', () => {
        expect(Roles.documents).toBeDefined();
      });

      it('should test users function', () => {
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

        httpBackend.whenGET(/\/api\/roles\/(.+)\/users/,
            undefined, undefined, ['id'])
          .respond(200, {
            res: 'res'
          });

        Roles.users({
          id: 'id'
        }, cb);

        httpBackend.flush();
        expect(response.res).toBeDefined();
        expect(response.res).toBe('res');
      });

      it('should test users function fail', () => {
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

        httpBackend.whenGET(/\/api\/roles\/(.+)\/users/,
            undefined, undefined, ['id'])
          .respond(500, {
            err: 'err'
          });

        Roles.users({
          id: 'id'
        }, cb);

        httpBackend.flush();
        expect(error.err).toBeDefined();
        expect(error.err).toBe('err');
      });
    });
  });
});

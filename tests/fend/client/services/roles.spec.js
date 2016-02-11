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
    httpBackend.when('GET', 'views/files.html')
      .respond(200, [{
        res: 'res'
      }]);
  }));

  describe('Roles unit tests', () => {
    describe('Roles resource unit tests', () => {
      it('update should be a function', () => {
        spyOn(Roles, 'update').and.returnValue(0);
        Roles.update();
        expect(Roles.update).toBeDefined();
        expect(Roles.update).toHaveBeenCalled();
        expect(typeof Roles.update).toBe('function');
      });
      it('save should be a function', () => {
        spyOn(Roles, 'save').and.returnValue(0);
        Roles.save();
        expect(Roles.save).toBeDefined();
        expect(Roles.save).toHaveBeenCalled();
        expect(typeof Roles.save).toBe('function');
      });
      it('query should be a function', () => {
        spyOn(Roles, 'query').and.returnValue(0);
        Roles.query();
        expect(Roles.query).toBeDefined();
        expect(Roles.query).toHaveBeenCalled();
        expect(typeof Roles.query).toBe('function');
      });
      it('get should be a function', () => {
        spyOn(Roles, 'get').and.returnValue(0);
        Roles.get();
        expect(Roles.get).toBeDefined();
        expect(Roles.get).toHaveBeenCalled();
        expect(typeof Roles.get).toBe('function');
      });
      it('delete should be a function', () => {
        spyOn(Roles, 'delete').and.returnValue(0);
        Roles.delete();
        expect(Roles.delete).toBeDefined();
        expect(Roles.delete).toHaveBeenCalled();
        expect(typeof Roles.delete).toBe('function');
      });
      it('remove should be a function', () => {
        spyOn(Roles, 'remove').and.returnValue(0);
        Roles.remove();
        expect(Roles.remove).toBeDefined();
        expect(Roles.remove).toHaveBeenCalled();
        expect(typeof Roles.remove).toBe('function');
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
        }, cb);
        httpBackend.flush();
        expect(response.res).toBeDefined();
        expect(response.res).toBe('res');
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
    });
  });
});

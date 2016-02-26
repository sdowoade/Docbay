'use strict';
describe('Documents Service Test', () => {
  beforeEach(() => {
    module('docbay');
  });

  var Documents,
    httpBackend,
    $http,
    $resource;
    
  beforeEach(inject(function($injector) {
    httpBackend = $injector.get('$httpBackend');
    Documents = $injector.get('Documents');
    $resource = $injector.get('$resource');
    $http = $injector.get('$http');

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

  describe('Documents resource unit tests', () => {
    it('update should be a function', () => {
      var response;
      var cb = (res) => {
        response = res;
      };

      httpBackend.whenPUT(/\/api\/documents\/(.+)/,
          undefined, undefined, ['id'])
        .respond(200, {
          res: 'res'
        });

      Documents.update({ id: 1 }, cb, cb);
      httpBackend.flush();
      expect(Documents.update).toBeDefined();
      expect(typeof Documents.update).toBe('function');
      expect(response.res).toBe('res');
    });

    it('save should be a function', () => {
      var response;
      var cb = (res) => {
        response = res;
      };

      httpBackend.whenPOST(/\/api\/documents\//)
        .respond(200, {
          res: 'res'
        });

      Documents.save({ id: 1 }, cb);
      httpBackend.flush();
      expect(Documents.save).toBeDefined();
      expect(typeof Documents.save).toBe('function');
      expect(response.res).toBe('res');
    });

    it('query should be a function', () => {
      var response;
      var cb = (res) => {
        response = res;
      };

      httpBackend.when('GET', '/api/documents/').respond(200, ['res']);

      Documents.query(cb);
      httpBackend.flush();
      expect(Documents.query).toBeDefined();
      expect(typeof Documents.query).toBe('function');
      expect(response).toBeDefined();
    });

    it('get should be a function', () => {
      var response;
      var cb = (res) => {
        response = res;
      };

      httpBackend.when('GET', '/api/documents/').respond(200, {
        res: 'res'
      });

      httpBackend.whenGET(/\/api\/documents\/(.+)/,
          undefined, undefined, ['id'])
        .respond(200, {
          res: 'res'
        });

      Documents.get({ id: 1 }, cb);
      httpBackend.flush();
      expect(Documents.get).toBeDefined();
      expect(typeof Documents.get).toBe('function');
      expect(response.res).toBe('res');
    });

    it('delete should be a function', () => {
      var response;
      var cb = (res) => {
        response = res;
      };

      httpBackend.whenDELETE(/\/api\/documents\/(.+)/,
          undefined, undefined, ['id'])
        .respond(200, {
          res: 'res'
        });

      Documents.delete({ id: 1 }, cb);
      httpBackend.flush();
      expect(Documents.delete).toBeDefined();
      expect(typeof Documents.delete).toBe('function');
      expect(response.res).toBe('res');
    });

    it('remove should be a function', () => {
      var response;
      var cb = (res) => {
        response = res;
      };

      httpBackend.whenDELETE(/\/api\/documents\/(.+)/,
          undefined, undefined, ['id'])
        .respond(200, {
          res: 'res'
        });

      Documents.remove({ id: 1 }, cb);
      httpBackend.flush();
      expect(Documents.remove).toBeDefined();
      expect(typeof Documents.remove).toBe('function');
      expect(response.res).toBe('res');
    });
  });
});

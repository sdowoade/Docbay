'use strict';
describe('Documents Service Test', () => {
  beforeEach(() => {
    module('docbay');
  });

  var Documents,
    $http,
    $resource;
  beforeEach(inject(function($injector) {
    Documents = $injector.get('Documents');
    $resource = $injector.get('$resource');
    $http = $injector.get('$http');
  }));

  describe('Documents resource unit tests', () => {
    it('update should be a function', () => {
      spyOn(Documents, 'update').and.returnValue(0);
      Documents.update();
      expect(Documents.update).toBeDefined();
      expect(Documents.update).toHaveBeenCalled();
      expect(typeof Documents.update).toBe('function');
    });

    it('save should be a function', () => {
      spyOn(Documents, 'save').and.returnValue(0);
      Documents.save();
      expect(Documents.save).toBeDefined();
      expect(Documents.save).toHaveBeenCalled();
      expect(typeof Documents.save).toBe('function');
    });

    it('query should be a function', () => {
      spyOn(Documents, 'query').and.returnValue(0);
      Documents.query();
      expect(Documents.query).toBeDefined();
      expect(Documents.query).toHaveBeenCalled();
      expect(typeof Documents.query).toBe('function');
    });

    it('get should be a function', () => {
      spyOn(Documents, 'get').and.returnValue(0);
      Documents.get();
      expect(Documents.get).toBeDefined();
      expect(Documents.get).toHaveBeenCalled();
      expect(typeof Documents.get).toBe('function');
    });

    it('delete should be a function', () => {
      spyOn(Documents, 'delete').and.returnValue(0);
      Documents.delete();
      expect(Documents.delete).toBeDefined();
      expect(Documents.delete).toHaveBeenCalled();
      expect(typeof Documents.delete).toBe('function');
    });

    it('remove should be a function', () => {
      spyOn(Documents, 'remove').and.returnValue(0);
      Documents.remove();
      expect(Documents.remove).toBeDefined();
      expect(Documents.remove).toHaveBeenCalled();
      expect(typeof Documents.remove).toBe('function');
    });
  });
});

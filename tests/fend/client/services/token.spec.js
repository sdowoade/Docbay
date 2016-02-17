'use strict';
describe('Auth Service Test', () => {

  beforeEach(() => {
    module('docbay');
  });

  var Auth;
  beforeEach(inject(function($injector) {
    Auth = $injector.get('Auth');
  }));

  describe('Token unit tests', () => {
    it('set should be a function', () => {
      expect(Auth.setUser).toBeDefined();
      expect(typeof Auth.setUser).toBe('function');
    });

    it('get should be a function', () => {
      expect(Auth.getUser).toBeDefined();
      expect(typeof Auth.getUser).toBe('function');
      Auth.setUser('token');
      expect(Auth.getUser()).toBe('token');
    });

    it('remove should be a function and be defined', () => {
      expect(Auth.logout).toBeDefined();
      expect(typeof Auth.logout).toBe('function');
      Auth.logout();
      expect(Auth.getUser()).toBe(null);
    });
  });
});

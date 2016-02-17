'use strict';
describe('Token Injector Service Test', () => {

  beforeEach(() => {
    module('docbay');
  });

  var TokenInjector,
    Auth,
    Token;
  beforeEach(inject(function($injector) {
    TokenInjector = $injector.get('TokenInjector');
    Auth = $injector.get('Auth');
  }));

  describe('Token Injector unit test', () => {
    it('request should be a function', () => {
      expect(TokenInjector.request).toBeDefined();
      expect(typeof TokenInjector.request).toBe('function');
      var config = {
        headers: {
          'x-access-token': 'yes'
        }
      };
      expect(typeof TokenInjector.request(config)).toBe('object');
    });
  });
});

'use strict';
describe('Token Injector Service Test', () => {
  var TokenInjector,
    Auth = {
      getUser: () => {
        return {
          token: 'token',
          name: 'name',
          data: {
            name: {
              first: 'first',
              last: 'last'
            }
          }
        };
      },

      isLoggedIn: () => {
        return true;
      },
    },

    Token;

  beforeEach(() => {
    module('docbay', function($provide) {
      $provide.value('Auth', Auth);
    });
  });

  beforeEach(inject(function($injector) {
    TokenInjector = $injector.get('TokenInjector');
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

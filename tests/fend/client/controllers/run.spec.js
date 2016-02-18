'use strict';
describe('example', function() {
  it('should start app with user', function() {
    var scope,
      state,
      Auth = {
        isLoggedIn: () => {
          return true;
        },

        logout: () => {
          return true;
        },

        getUser: () => {
          return {
            name: 'name',
            data: {
              name: {
                first: 'first',
                last: 'last'
              }
            }
          };
        }
      },

      Users = {
        session: (cb) => {
          cb(null, true);
        }
      };

    spyOn(Users, 'session').and.callThrough();
    spyOn(Auth, 'getUser').and.callThrough();

    module('docbay', function($provide) {
      $provide.value('Users', Users);
      $provide.value('Auth', Auth);
    });

    inject(function($injector) {
      scope = $injector.get('$rootScope');
      state = $injector.get('$state');
    });

    expect(Users.session).toHaveBeenCalled();
    expect(Auth.getUser).toHaveBeenCalled();
    expect(scope.currentUser).toEqual({
      name: {
        first: 'first',
        last: 'last'
      }
    });
  });

  it('should start app with expired token', function() {
    var scope,
      state = {
        go: (place) => {
          return place;
        }
      },
      Auth = {
        isLoggedIn: () => {
          return true;
        },

        logout: () => {
          return true;
        },

        getUser: () => {
          return {
            name: 'name',
            data: {
              name: {
                first: 'first',
                last: 'last'
              }
            }
          };
        }
      },

      Users = {
        session: (cb) => {
          cb(true, null);
        }
      };

    spyOn(Users, 'session').and.callThrough();
    spyOn(Auth, 'logout').and.callThrough();
    spyOn(state, 'go').and.callThrough();

    module('docbay', function($provide) {
      $provide.value('Users', Users);
      $provide.value('Auth', Auth);
      $provide.value('$state', state);
    });

    inject(function($injector) {
      scope = $injector.get('$rootScope');
    });

    expect(Users.session).toHaveBeenCalled();
    expect(Auth.logout).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalled();
    expect(scope.currentUser).not.toBeDefined();
  });

  it('should start app without user', function() {
    var scope,
      state = {
        go: (place) => {
          return place;
        }
      },
      Auth = {
        isLoggedIn: () => {
          return false;
        },

        logout: () => {
          return true;
        },

        getUser: () => {
          return {
            name: 'name',
            data: {
              name: {
                first: 'first',
                last: 'last'
              }
            }
          };
        }
      },

      Users = {
        session: (cb) => {
          cb(true, null);
        }
      };

    spyOn(state, 'go').and.callThrough();

    module('docbay', function($provide) {
      $provide.value('Users', Users);
      $provide.value('Auth', Auth);
      $provide.value('$state', state);
    });

    inject(function($injector) {
      scope = $injector.get('$rootScope');
    });

    expect(state.go).toHaveBeenCalled();
  });
});

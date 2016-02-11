'use strict';
describe('loginCtrl tests', () => {
  var scope,
    Document = {
      _id: 'doc'
    },
    controller,
    Auth = {
      setUser: (user) => {
        return user;
      }
    },
    state,
    Users = {
      login: (user, cb) => {
        user ? cb(null, user) : cb(true, null);
      }
    };

  beforeEach(() => {
    module('docbay');
  });

  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    state = $injector.get('$state');
    controller = $controller('loginCtrl', {
      $scope: scope,
      $state: state,
      Users: Users,
      Auth: Auth
    });
  }));

  it('should login user', () => {
    spyOn(Auth, 'setUser').and.callThrough();
    spyOn(state, 'go').and.callThrough();
    spyOn(scope, '$broadcast').and.callThrough();
    scope.user = {
      data: 'user'
    };
    scope.login();
    expect(Auth.setUser).toHaveBeenCalled();
    expect(scope.currentUser).toBe('user');
    expect(scope.$broadcast).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalled();
  });

  it('should set status message', () => {
    scope.user = null;
    scope.login();
    expect(scope.status).toBe('Incorrect username or password');
  });

});

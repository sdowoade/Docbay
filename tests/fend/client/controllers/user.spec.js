'use strict';
describe('userCtrl tests', () => {
  var scope,
    controller,
    mdDialog,
    mdToast,
    state,
    Auth = {
      isLoggedIn: () => {
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
      },
      setUser: (user) => {
        return {
          name: 'name',
          data: {
            name: {
              first: user.last,
              last: user.first
            }
          }
        };
      }
    },
    Users = {
      save: (user, cb) => {
        cb();
      },
      update: (id, user, cb) => {
        cb();
      }
    };

  beforeEach(() => {
    module('docbay');
  });

  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    mdDialog = $injector.get('$mdDialog');
    mdToast = $injector.get('$mdToast');
    state = $injector.get('$state');
    controller = $controller('userCtrl', {
      $scope: scope,
      Users: Users,
      Auth: Auth
    });
  }));

  it('scope.signup should call Users.save', () => {
    spyOn(Users, 'save').and.callThrough();
    spyOn(state, 'go').and.callThrough();
    scope.signup();
    expect(Users.save).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalled();
  });

  it('scope.update should call Users.update', () => {
    scope.user = {
      _id: 1,
      user: 'user',
      first: 'Von',
      last: 'Doom'
    };
    spyOn(Users, 'update').and.callThrough();
    spyOn(scope, '$broadcast').and.callThrough();
    spyOn(Auth, 'getUser').and.callThrough();
    spyOn(Auth, 'setUser').and.callThrough();
    spyOn(mdToast, 'show').and.callThrough();
    scope.update();
    expect(Users.update).toHaveBeenCalled();
    expect(scope.$broadcast).toHaveBeenCalled();
    expect(Auth.getUser).toHaveBeenCalled();
    expect(Auth.setUser).toHaveBeenCalled();
    expect(scope.userData).toBeDefined();
    expect(scope.userData.data).toEqual({
      _id: 1,
      user: 'user',
      first: 'Von',
      last: 'Doom'
    });
    expect(scope.currentUser).toEqual(scope.user);
    expect(mdToast.show).toHaveBeenCalled();
  });

  it('scope.init should set user model', () => {
    scope.currentUser = 'user';
    scope.init();
    expect(scope.user).toEqual('user');
  });

  it('scope.login should change state', () => {
    spyOn(state, 'go').and.callThrough();
    scope.login();
    expect(state.go).toHaveBeenCalled();
  });
});

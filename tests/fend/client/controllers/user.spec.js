'use strict';
describe('userCtrl tests', () => {
  var scope,
    controller,
    statusError409 = { status: 409 },
    statusError500 = { status: 500 },
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
      save: (user, cb, err) => {
        if (user.data === 1) {
          cb();
        } else if (user.data === 2) {
          err(statusError409);
        } else {
          err(statusError500);
        }
      },

      login: (user, cb) => {
        cb(null,user);
      },

      update: (id, user, cb, err) => {
        if (user === 1) {
          err(statusError500);
        } else if (user === 2) {
          err(statusError409);
        } else {
          cb();
        }
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
    scope.user = { data: 1, first: 'first', last: 'last' };
    spyOn(Auth, 'setUser').and.callThrough();
    spyOn(scope, '$broadcast').and.callThrough();
    spyOn(Users, 'save').and.callThrough();
    spyOn(Users, 'login').and.callThrough();
    spyOn(state, 'go').and.callThrough();
    scope.signup();
    expect(Users.save).toHaveBeenCalled();
    expect(Users.login).toHaveBeenCalled();
    expect(Auth.setUser).toHaveBeenCalled();
    expect(scope.currentUser).toBe(1);
    expect(scope.$broadcast).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalled();
  });

  it('scope.signup should call Users.save with error 409', () => {
    scope.user = { data: 2 };
    spyOn(Users, 'save').and.callThrough();
    spyOn(mdToast, 'show').and.callThrough();
    scope.signup();
    expect(Users.save).toHaveBeenCalled();
    expect(mdToast.show).toHaveBeenCalled();
  });

  it('scope.signup should call Users.save with error 500', () => {
    scope.user = { data: null };
    spyOn(Users, 'save').and.callThrough();
    spyOn(state, 'go').and.callThrough();
    scope.signup();
    expect(Users.save).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalledWith('500');
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

  it('scope.update should call Users.update with error 409', () => {
    scope.user = 2;
    spyOn(Users, 'update').and.callThrough();
    spyOn(mdToast, 'show').and.callThrough();
    scope.update();
    expect(Users.update).toHaveBeenCalled();
    expect(mdToast.show).toHaveBeenCalled();
  });

  it('scope.update should call Users.update with error 500', () => {
    scope.user = 1;
    spyOn(Users, 'update').and.callThrough();
    spyOn(state, 'go').and.callThrough();
    scope.update();
    expect(Users.update).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalledWith('500');
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

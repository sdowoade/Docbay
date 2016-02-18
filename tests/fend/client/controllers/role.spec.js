'use strict';
describe('docCtrl tests', () => {
  var scope,
    controller,
    mdDialog,
    mdToast,
    state,
    Roles = {
      save: (role, cb, err) => {
        role.title === 'role' ? cb(role) : err();
      }
    },

    Users = {
      get: (user, cb) => {
        cb({
          role: [1, 2, 3]
        });
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
    controller = $controller('roleCtrl', {
      $scope: scope,
      $mdToast: mdToast,
      $mdDialog: mdDialog,
      Roles: Roles,
      Users: Users
    });
  }));

  it('should init the controller call Users.get', () => {
    scope.currentUser = {
      _id: 'id'
    };
    spyOn(Users, 'get').and.callThrough();
    scope.init();
    expect(scope.user).toBeDefined();
    expect(Users.get).toHaveBeenCalled();
    expect(scope.roles).toEqual(scope.user.role);
  });

  it('scope.members should show dialog', () => {
    spyOn(mdDialog, 'show').and.callThrough();
    scope.members();
    expect(mdDialog.show).toHaveBeenCalled();
  });

  it('scope.invite should show dialog', () => {
    spyOn(mdDialog, 'show').and.callThrough();
    scope.invite();
    expect(mdDialog.show).toHaveBeenCalled();
  });

  it('scope.save should call Roles.save', () => {
    spyOn(Roles, 'save').and.callThrough();
    spyOn(mdToast, 'show').and.callThrough();
    scope.roles = [];
    scope.role = {
      title: 'role'
    };
    scope.save();
    expect(scope.role.title).toBe(null);
    expect(scope.roles[0]).toEqual(scope.role);
    expect(mdToast.show).toHaveBeenCalled();
  });

  it('scope.save should call Roles.save with error', () => {
    spyOn(Roles, 'save').and.callThrough();
    spyOn(mdToast, 'show').and.callThrough();
    scope.role = {
      title: 'roleless'
    };
    scope.roles = [];
    scope.save();
    expect(scope.role.title).not.toBe(null);
    expect(scope.roles.length).toEqual(0);
    expect(mdToast.show).toHaveBeenCalled();
  });
});

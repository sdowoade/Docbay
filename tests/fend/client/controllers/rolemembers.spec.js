'use strict';
describe('roleMembersCtrl tests', () => {
  var scope,
    Role = {
      _id: 'role'
    },

    controller,
    mdDialog,
    
    Roles = {
      users: function(users, cb) {
        users ? cb(null, users) : cb(true, null);
      }
    };

  beforeEach(() => {
    module('docbay');
  });

  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    mdDialog = $injector.get('$mdDialog');

    controller = $controller('roleMembersCtrl', {
      $scope: scope,
      Roles: Roles,
      Role: Role
    });
  }));

  it('should init the controller and get role users', () => {
    spyOn(Roles, 'users').and.callThrough();
    scope.init();
    expect(Roles.users).toHaveBeenCalled();
    expect(scope.role).toEqual(Role);
    expect(scope.members).toEqual(Role);
  });


  it('scope.close should close dialog', () => {
    spyOn(mdDialog, 'cancel').and.callThrough();
    scope.close();
    expect(mdDialog.cancel).toHaveBeenCalled();
  });
});

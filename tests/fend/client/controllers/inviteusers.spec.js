'use strict';
describe('inviteUsersCtrl tests', () => {
  var scope,
    Role = {
      _id: 'role'
    },
    controller,
    mdDialog,
    mdToast,
    Roles = {
      users: (users, cb) => {
        users ? cb(null, users) : cb(true, null);
      }
    },
    Users = {
      assignRole: (user, role, cb) => {
        cb(null, role);
      },
      query: () => {
        return [{
          name: {
            first: 'first',
            last: 'last'
          },
          email: 'email',
          username: 'username'
        }];
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
    controller = $controller('inviteUserCtrl', {
      $scope: scope,
      Users: Users,
      Role: Role
    });
  }));

  it('should init the controller call Users.query', () => {
    spyOn(Users, 'query').and.callThrough();
    scope.init();
    expect(Users.query).toHaveBeenCalled();
    expect(scope.users).toEqual([{
      name: {
        first: 'first',
        last: 'last',
      },
      email: 'email',
      username: 'username'
    }]);
  });

  it('transformChip should return chip', () => {
    var chip = scope.transformChip({
      chip: 'i am chip'
    });
    expect(chip).toEqual({
      chip: 'i am chip'
    });
  });

  it('transformChip should create chip', () => {
    var chip = scope.transformChip('chip');
    expect(chip).toEqual({
      name: 'chip',
      type: 'new'
    });
  });

  it('querySearch should... query users', () => {
    spyOn(scope, 'loadUsers').and.callThrough();
    spyOn(scope, 'createFilterFor').and.callThrough();
    scope.querySearch('query');
    expect(scope.loadUsers).toHaveBeenCalled();
    expect(scope.createFilterFor).toHaveBeenCalled();
  });


  it('createFilterFor should return filter function', () => {
    spyOn(angular, 'lowercase').and.callThrough();
    var filter = scope.createFilterFor('query');
    expect(filter).toBeDefined();
    expect(typeof filter).toBe('function');
    expect(angular.lowercase).toHaveBeenCalled();
  });

  it('loadUsers should return map function', () => {
    spyOn(Users, 'query').and.callThrough();
    var value = scope.loadUsers();
    expect(value).toBeDefined();
    expect(typeof value).toBe('object');
  });

  it('scope.save should call assignRole', () => {
    scope.selectedUsers = [1, 2, 3];
    spyOn(Users, 'assignRole').and.callThrough();
    spyOn(mdToast, 'show').and.callThrough();
    scope.save();
    expect(Users.assignRole).toHaveBeenCalled();
    expect(mdToast.show).toHaveBeenCalled();
  });

  it('scope.close should close dialog', () => {
    spyOn(mdDialog, 'cancel').and.callThrough();
    scope.close();
    expect(mdDialog.cancel).toHaveBeenCalled();
  });
});

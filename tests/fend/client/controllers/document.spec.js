'use strict';
describe('docCtrl tests', () => {
  var scope,
    stateParams,
    controller,
    mdDialog,
    mdToast,
    state,
    Documents = {
      save: (item, cb) => {
        item ? cb(item) : cb(false);
      },
      update: (item, cb) => {
        item ? cb(item) : cb(false);
      },
      get: (id, cb) => {
        cb({
          title: 'New doc',
        });
      },
      delete: (id, cb) => {
        cb();
      },
      query: () => {
        return [{
          message: 'I am groot',
          Images: [1, 3, 4]
        }];
      }
    },
    Roles = {
      get: (id, cb) => {
        return {
          title: 'New role',
        };
      },
      documents: (role, cb) => {
        role ? cb(null, role) : cb(true, null);
      }
    },
    Users = {
      documents: (user, cb) => {
        user ? cb(null, user) : cb(null, false);
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

    stateParams = {
      id: true
    };
    controller = $controller('docCtrl', {
      $scope: scope,
      $stateParams: stateParams,
      Documents: Documents,
      Roles: Roles,
      Users: Users
    });
  }));

  it('should init the controller and get role documents', () => {
    inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      stateParams = {
        id: true
      };
      controller = $controller('docCtrl', {
        $scope: scope,
        $stateParams: stateParams,
        Documents: Documents,
        Roles: Roles,
        Users: Users
      });
    });

    spyOn(Roles, 'get').and.callThrough();
    spyOn(Roles, 'documents').and.callThrough();
    spyOn(Users, 'documents').and.callThrough();
    scope.init();

    stateParams = {
      id: true
    };

    expect(Roles.get).toHaveBeenCalled();
    expect(scope.role.title).toEqual('New role');
    expect(scope.canCreateNew).toBe(false);
    expect(Roles.documents).toHaveBeenCalled();
    expect(scope.documents).toEqual(stateParams);
  });

  it('should init the controller and get user documents', function() {
    inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      controller = $controller('docCtrl', {
        $scope: scope,
        Documents: Documents,
        Roles: Roles,
        Users: Users
      });
    });

    spyOn(Users, 'documents').and.callThrough();
    scope.currentUser = 'user';
    scope.init();
    expect(Users.documents).toHaveBeenCalled();
    expect(scope.documentsTitle).toEqual('My files');
    expect(scope.canCreateNew).toBe(true);
    expect(scope.documents).toEqual('user');
  });

  it('scope.new should show dialog', () => {
    spyOn(mdDialog, 'show');
    scope.new();
    expect(mdDialog.show).toHaveBeenCalled();
  });

  it('scope.edit should show dialog', () => {
    spyOn(mdDialog, 'show');
    scope.edit();
    expect(mdDialog.show).toHaveBeenCalled();
  });

  it('scope.delete should call Documents.delete', () => {
    spyOn(Documents, 'delete').and.callThrough();
    spyOn(state, 'reload');
    scope.delete();
    expect(Documents.delete).toHaveBeenCalled();
    expect(state.reload).toHaveBeenCalled();
  });
});

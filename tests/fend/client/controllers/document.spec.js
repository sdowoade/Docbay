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

      update: (id, doc, cb) => {
        id ? cb(id) : cb(false);
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
        cb({
          title: 'New role',
        });
      },
      documents: (role, page, cb) => {
        role ? cb(null, role) : cb(true, null);
      }
    },

    Users = {
      documents: (user, page, cb) => {
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

  it('should init documents', () => {
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

    spyOn(scope, 'getPage').and.callThrough();
    scope.init();
    expect(scope.getPage).toHaveBeenCalled();
  });

  it('should get role documents', () => {
    inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');

      stateParams = {
        id: true,
        count: 1,
        docs: 'docs'
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
    scope.getPage(1);

    stateParams = {
      id: true,
      count: 1,
      docs: 'docs'
    };

    expect(scope.currentPage).toBe(1);
    expect(Roles.get).toHaveBeenCalled();
    expect(scope.role.title).toEqual('New role');
    expect(scope.canCreateNew).toBe(false);
    expect(Roles.documents).toHaveBeenCalled();
    expect(scope.documentsTitle).toEqual(scope.role.title);
    expect(scope.documents).toEqual(stateParams);
    expect(scope.nextIsEnabled).toBeDefined();
  });

  it('should get user documents', function() {
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

    scope.currentUser = {
      docs: 'user',
      count: 1
    };

    scope.getPage(1);
    expect(scope.currentPage).toBe(1);
    expect(Users.documents).toHaveBeenCalled();
    expect(scope.documentsTitle).toEqual('My files');
    expect(scope.canCreateNew).toBe(true);
    expect(scope.documents).toEqual(scope.currentUser);
    expect(scope.nextIsEnabled).toBeDefined();
  });

  it('scope.create should show dialog', () => {
    spyOn(mdDialog, 'show');
    scope.create();
    expect(mdDialog.show).toHaveBeenCalled();
  });

  it('scope.edit should show dialog', () => {
    spyOn(mdDialog, 'show');
    scope.edit();
    expect(mdDialog.show).toHaveBeenCalled();
  });

  it('scope.remove should call Documents.delete', () => {
    scope.documents = [1, 2, 3];
    spyOn(Documents, 'delete').and.callThrough();
    scope.remove();
    expect(Documents.delete).toHaveBeenCalled();
  });
});

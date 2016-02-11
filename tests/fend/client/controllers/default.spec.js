'use strict';
describe('defaultController tests', () => {
  var scope,
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
      logout: () => {
        return true;
      }
    },
    controller,
    mdDialog,
    mdToast,
    state,
    Documents = {
      update: (doc, cb) => {
        cb(doc);
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
    controller = $controller('defaultController', {
      $scope: scope,
      Auth: Auth
    });
  }));

  it('should init the controller', () => {
    spyOn(Auth, 'isLoggedIn').and.callThrough();
    spyOn(Auth, 'getUser').and.callThrough();
    scope.init();
    expect(scope.currentUser).toEqual({
      name: {
        first: 'first',
        last: 'last'
      }
    });
    expect(scope.name).toEqual('first last');
  });

  it('scope.logout should logout user', () => {
    scope.currentUser = 'exist';
    spyOn(Auth, 'logout').and.callThrough();
    spyOn(scope, '$broadcast').and.callThrough();
    spyOn(scope, 'init');
    spyOn(state, 'go').and.callThrough();
    scope.logout();
    expect(scope.currentUser).not.toBeDefined();
    expect(Auth.logout).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalled();
    expect(scope.init).toHaveBeenCalled();
  });
});

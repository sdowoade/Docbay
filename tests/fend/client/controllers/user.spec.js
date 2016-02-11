'use strict';
describe('userCtrl tests', () => {
  var scope,
    controller,
    mdDialog,
    mdToast,
    state,
    Users = {
      save: (user, cb) => {
        cb();
      }
    };

  beforeEach(() => {
    module('docbay');
  });

  beforeEach(inject(($injector) => {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    mdDialog = $injector.get('$mdDialog');
    mdToast = $injector.get('$mdToast');
    state = $injector.get('$state');
    controller = $controller('userCtrl', {
      $scope: scope,
      Users: Users
    });
  }));

  it('scope.signup should call Users.save', () => {
    spyOn(Users, 'save').and.callThrough();
    spyOn(state, 'go').and.callThrough();
    scope.signup();
    expect(Users.save).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalled();
  });

  it('scope.login should change state', () => {
    spyOn(state, 'go').and.callThrough();
    scope.login();
    expect(state.go).toHaveBeenCalled();
  });
});

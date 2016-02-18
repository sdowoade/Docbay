'use strict';
describe('newDocCtrl tests', () => {
  var scope,
    stateParams,
    controller,
    mdDialog,
    mdToast,
    state,
    Documents = {
      save: (doc, cb) => {
        cb(doc);
      }
    },
    Users = {
      get: (user, cb) => {
        return {
          role: [1, 2, 3]
        };
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
    controller = $controller('newDocCtrl', {
      $scope: scope,
      Documents: Documents,
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

  it('scope.save should show Documents.save', () => {
    spyOn(Documents, 'save').and.callThrough();
    scope.save();
    expect(Documents.save).toHaveBeenCalled();
  });

  it('scope.delete should show dialog', () => {
    spyOn(mdDialog, 'cancel').and.callThrough();
    spyOn(state, 'reload');
    scope.close();
    expect(mdDialog.cancel).toHaveBeenCalled();
    expect(state.reload).toHaveBeenCalled();
  });
});

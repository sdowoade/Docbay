'use strict';
describe('editDocCtrl tests', () => {
  var scope,
    Document = {
      _id: 'doc'
    },
    controller,
    mdDialog,
    mdToast,
    state,
    Documents = {
      update: (id, doc, cb) => {
        cb(id);
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
    controller = $controller('editDocCtrl', {
      $scope: scope,
      Documents: Documents,
      Document: Document
    });
  }));

  it('should init the controller and get role documents', () => {
    scope.init();
    expect(scope.doc).toEqual(Document);
  });

  it('scope.save should call Documents.update', () => {
    spyOn(Documents, 'update').and.callThrough();
    spyOn(mdToast, 'show').and.callThrough();
    scope.doc = Document;
    scope.save();
    expect(Documents.update).toHaveBeenCalled();
    expect(mdToast.show).toHaveBeenCalled();
  });

  it('scope.close should close dialog', () => {
    spyOn(mdDialog, 'cancel').and.callThrough();
    spyOn(state, 'reload');
    scope.close();
    expect(mdDialog.cancel).toHaveBeenCalled();
    expect(state.reload).toHaveBeenCalled();
  });
});

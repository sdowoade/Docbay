'use strict';
angular.module('docbay.controllers').controller('editDocCtrl', (
  $rootScope, $scope, $state,
  $mdDialog, $mdToast, Users, Document, Documents) => {
  $scope.init = () => {
    $scope.doc = Document;
  };

  /*
   *Update document
   */
  $scope.save = () => {
    Documents.update({
      id: $scope.doc._id
    }, () => {
      Document = $scope.doc;
      $mdToast.show(
        $mdToast.simple()
        .textContent('Document Saved!')
        .hideDelay(3000)
      );
    });
  };

  $scope.close = () => {
    $mdDialog.cancel();
    $state.reload();
  };
});

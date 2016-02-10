'use strict';
angular.module('docbay.controllers').controller('newDocCtrl', (
  $rootScope, $scope,
  $state, $mdDialog, $mdToast, Users, Documents) => {

  $scope.init = () => {
    $scope.user = Users.get({
      id: $rootScope.currentUser._id
    }, () => {
      $scope.roles = $scope.user.role;
    });
  };

  $scope.save = () => {
    Documents.save($scope.doc, () => {
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

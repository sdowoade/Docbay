'use strict';
angular.module('docbay.controllers').controller('newDocCtrl', function(
  $rootScope, $scope,
  $state, $mdDialog, $mdToast, Users, Documents) {

  $scope.init = () => {
    Users.get({
      id: $rootScope.currentUser._id
    }, (user) => {
      $scope.user = user;
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
      $scope.close();
    });
  };

  $scope.close = () => {
    $mdDialog.cancel();
    $state.reload();
  };
});

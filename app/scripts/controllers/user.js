'use strict';
angular.module('docbay.controllers').controller('userCtrl', function(
  $scope, $rootScope, $state, $mdToast, $mdDialog, Users) {

  /**
   *On init make user model the currently signed in user
   */
  $scope.init = () => {
    $scope.user = $rootScope.currentUser;
  };

  $scope.signup = () => {
    Users.save($scope.user, () => {
      $state.go('login');
    });
  };

  $scope.update = () => {
    Users.update({
      id: $scope.user._id
    }, $scope.user, () => {
      $mdToast.show(
        $mdToast.simple()
        .textContent('Profile updated!')
        .hideDelay(3000)
      );
    });
  };

  $scope.login = () => {
    $state.go('login');
  };
});

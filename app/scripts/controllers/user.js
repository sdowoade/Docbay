'use strict';
angular.module('docbay.controllers').controller('userCtrl', function(
  $scope, $rootScope, $state, $mdToast, $mdDialog, Users, Auth) {

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

  /*8 
   *Update user and reset @rootScope.currentUser
   */
  $scope.update = (r) => {
    Users.update({
      id: $scope.user._id
    }, $scope.user, () => {
      $scope.userData = Auth.getUser();
      $scope.userData.data = $scope.user;
      Auth.setUser($scope.userData);
      $rootScope.currentUser = $scope.user;
      $rootScope.$broadcast('updateHeader');
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

'use strict';
angular.module('docbay.controllers').controller('userCtrl', (
  $scope, $rootScope, $state, $mdDialog, Users) => {
  $scope.init = () => {
    $scope.user = new Users();
  };

  $scope.signup = () => {
    Users.save($scope.user, () => {
      $state.go('login');
    });
  };

  $scope.login = (ev) => {
    $state.go('login');
  };
});

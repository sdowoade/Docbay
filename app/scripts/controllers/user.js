'use strict';
angular.module('docbay.controllers').controller('userCtrl', function(
  $scope, $rootScope, $state, $mdDialog, Users) {

  $scope.signup = () => {
    Users.save($scope.user, () => {
      $state.go('login');
    });
  };

  $scope.login = (ev) => {
    $state.go('login');
  };
});

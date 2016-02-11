'use strict';
angular.module('docbay.controllers').controller('roleMembersCtrl', (
  $rootScope, $scope,
  $state, Users, Role, Roles, $mdDialog) => {

  /* 
   *Get users in Role on init
   */
  $scope.init = () => {
    $scope.role = Role;
    Roles.users(Role, (err, res) => {
      if (!err) {
        $scope.members = res;
      }
    });
  };

  $scope.close = () => {
    $mdDialog.cancel();
  };
});

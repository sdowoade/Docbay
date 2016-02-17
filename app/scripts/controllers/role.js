'use strict';
angular.module('docbay.controllers').controller('roleCtrl', function(
  $rootScope, $scope,
  $mdDialog, $mdToast, Users, Documents, Roles) {

  $scope.init = () => {
    $scope.user = Users.get({
      id: $rootScope.currentUser._id
    }, () => {
      $scope.roles = $scope.user.role;
    });
  };

  $scope.members = (role, ev) => {
    $mdDialog.show({
      controller: 'roleMembersCtrl',
      templateUrl: 'views/rolemembers.html',
      locals: {
        Role: role
      },
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false
    });
  };

  $scope.invite = (role, ev) => {
    $mdDialog.show({
      controller: 'inviteUserCtrl',
      templateUrl: 'views/inviteuser.html',
      locals: {
        Role: role
      },
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: true
    });
  };

  $scope.save = () => {
    Roles.save($scope.role, (role) => {
      $scope.roles.push(role);
      $scope.role.title = null;
      $mdToast.show(
        $mdToast.simple()
        .textContent('Role saved')
        .hideDelay(3000)
      );
    }, (err) => {
      $mdToast.show(
        $mdToast.simple()
        .textContent($scope.role.title + ' already exists')
        .hideDelay(3000)
      );
    });
  };
});

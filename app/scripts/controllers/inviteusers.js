'use strict';
angular.module('docbay.controllers').controller('inviteUserCtrl', function(
  $rootScope, $scope,
  $mdDialog, $mdToast, $state, Users, Role, Auth) {

  $scope.selectedItem = null;
  $scope.searchText = null;
  $scope.selectedUsers = [];

  /**
   * Return the proper object when the append is called.
   */
  $scope.transformChip = (chip) => {
    if (angular.isObject(chip)) {
      return chip;
    }
    return {
      name: chip,
      type: 'new'
    };
  };

  /**
   * Search for users.
   */
  $scope.querySearch = (query) => {
    var results = query ?
      $scope.loadUsers().filter($scope.createFilterFor(query)) : [];
    return results;
  };

  /**
   * Create filter function for a query string
   */
  $scope.createFilterFor = (query) => {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(user) {
      return (user.name.first.indexOf(lowercaseQuery) === 0) ||
        (user.name.last.indexOf(lowercaseQuery) === 0) ||
        (user.username.indexOf(lowercaseQuery) === 0) ||
        (user.email.indexOf(lowercaseQuery) === 0);
    };
  };

  /**
   * load all users
   */
  $scope.loadUsers = () => {
    $scope.users = Users.query();
    return $scope.users.map((user) => {
      user.name.first = user.name.first.toLowerCase();
      user.name.last = user.name.last.toLowerCase();
      user.email = user.email.toLowerCase();
      user.username = user.username.toLowerCase();
      return user;
    });
  };

  $scope.init = () => {
    $scope.users = Users.query();
  };

  $scope.save = () => {
    $scope.selectedUsers.forEach((user) => {
      Users.assignRole(user, {
        role: Role._id
      }, (err, res) => {
        if (!err) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Invited ' + res.username)
            .hideDelay(3000)
          );
        }
      });
    });
  };

  $scope.close = () => {
    $mdDialog.cancel();
  };
});

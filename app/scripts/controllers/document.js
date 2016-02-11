'use strict';
angular.module('docbay.controllers').controller('docCtrl', function($rootScope,
  $scope, $stateParams,$state,
  $mdDialog, $mdToast, Users, Roles, Documents) {

  /* on init load role documents if @stateparams exist
   * otherwise loads users docs
   */
  $scope.init = () => {
    if ($stateParams.id) {
      $scope.role = Roles.get({
        id: $stateParams.id
      }, () => {
        $scope.documentsTitle = $scope.role.title;
      });

      $scope.canCreateNew = false;
      Roles.documents($stateParams, (err, docs) => {
        if (docs) {
          $scope.documents = docs;
        }
      });
    } else {
      $scope.canCreateNew = true;
      $scope.documentsTitle = 'My files';

      Users.documents($rootScope.currentUser, (err, docs) => {
        if (docs) {
          $scope.documents = docs;
        }
      });

    }
  };

  $scope.new = (ev) => {
    $mdDialog.show({
      controller: 'newDocCtrl',
      templateUrl: 'views/newdoc.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: true
    });
  };

  $scope.edit = (doc, ev) => {
    $mdDialog.show({
      controller: 'editDocCtrl',
      templateUrl: 'views/editdoc.html',
      locals: {
        Document: doc
      },
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: true
    });
  };

  $scope.delete = (id) => {
    Documents.delete({
      id: id
    }, () => {
      $mdToast.show(
        $mdToast.simple()
        .textContent('Document Deleted!')
        .hideDelay(3000)
      );
      $state.reload();
    });
  };
});

'use strict';
angular.module('docbay.controllers').controller('docCtrl', function($rootScope,
  $scope, $stateParams, $state,
  $mdDialog, $mdToast, Users, Roles, Documents) {

  /* on init load role documents if @stateparams exist
   * otherwise loads users docs
   */
  $scope.init = () => {
    $scope.getPage(1);
  };

  $scope.getPage = (page) => {
    $scope.currentPage = page;
    if ($stateParams.id) {
      Roles.get({
        id: $stateParams.id
      }, (role) => {
        $scope.role = role;
        $scope.documentsTitle = $scope.role.title;
      });

      $scope.canCreateNew = false;
      Roles.documents($stateParams, page, (err, docs) => {
        if (docs) {
          $scope.pages = Math.ceil(docs.count / 50);
          $scope.documents = docs.docs;
        }
      });
    } else {
      $scope.canCreateNew = true;
      $scope.documentsTitle = 'My files';

      Users.documents($rootScope.currentUser, page, (err, docs) => {
        if (docs) {
          $scope.pages = Math.ceil(docs.count / 50);
          $scope.documents = docs.docs;
        }
      });
    }
  };

  $scope.range = (start, end) => {
    var input = [];
    for (var i = start; i <= end; i++) input.push(i);
    return input;
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

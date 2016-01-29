angular.module('docbay', ['ngMaterial','ui.router'])
  .controller('YourController', function($scope) {
    $scope.data = 'Docbay';
  });

angular.module('docbay').config(function($stateProvider) {
  $stateProvider.state('home', { 
    url: '/',
    templateUrl: 'views/landing.html',
    controller: 'YourController'
  }).state('documents', {
    url: '/documents',
    templateUrl: 'views/files.html',
    controller: 'YourController'
  }).state('roles', {
    url: '/roles',
    templateUrl: 'views/roles.html',
    controller: 'YourController'
  });
}).run(function($state) {
  $state.go('home');
});

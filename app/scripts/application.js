'use strict';
angular.module('docbay.services', []);
angular.module('docbay.controllers', []);

require('./services/user');
require('./services/role');
require('./services/document');
require('./services/auth');
require('./services/token-injector');

require('./controllers/rolemembers');
require('./controllers/inviteusers');
require('./controllers/role');
require('./controllers/user');
require('./controllers/login');
require('./controllers/newdocument');
require('./controllers/editdocument');
require('./controllers/document');

angular.module('docbay', ['ngResource', 'ngMaterial',
    'ngRoute', 'ui.router', 'textAngular',
    'docbay.controllers', 'docbay.services'
  ])
  .controller('defaultController', function(
    $rootScope, $scope, $state, $mdSidenav, Auth) {
    $scope.$on('updateHeader', (e) => {
      $scope.init();
    });

    $scope.init = () => {
      if (Auth.isLoggedIn()) {
        $rootScope.currentUser = Auth.getUser().data;
        $scope.name = $rootScope.currentUser.name.first +
          ' ' + $rootScope.currentUser.name.last;
      }
    };

    $scope.showRoles = () => {
      $mdSidenav('roles').toggle();
    };

    $scope.showProfile = () => {
      $mdSidenav('profile').toggle();
    };

    $scope.showPassword = () => {
      $mdSidenav('changepassword').toggle();
    };

    $scope.logout = () => {
      delete $rootScope.currentUser;
      Auth.logout();
      $rootScope.$broadcast('updateHeader');
      $state.go('home', null, {
        reload: true
      });
    };
  });

angular.module('docbay').config((
  $stateProvider, $httpProvider, $urlRouterProvider, $locationProvider) => {
  $httpProvider.interceptors.push('TokenInjector');
  $urlRouterProvider.otherwise('404');

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'views/landing.html',
    controller: 'userCtrl'
  }).state('documents', {
    url: '/documents',
    templateUrl: 'views/files.html',
    controller: 'docCtrl'
  }).state('404', {
    url: '/404',
    templateUrl: 'views/404.html',
    controller: 'defaultController'
  }).state('500', {
    url: '/500',
    templateUrl: 'views/500.html',
    controller: 'defaultController'
  }).state('roleDocuments', {
    url: '/roles/{id}/documents',
    templateUrl: 'views/files.html',
    controller: 'docCtrl',
    params: {
      role: null
    }
  }).state('login', {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'loginCtrl'
  }).state('signup', {
    url: '/signup',
    templateUrl: 'views/signup.html',
    controller: 'userCtrl'
  }).state('roles', {
    url: '/roles',
    templateUrl: 'views/roles.html',
    controller: 'roleCtrl'
  });

  $locationProvider.html5Mode(true);

}).run(($rootScope, $state, Auth, Users) => {
  if (Auth.isLoggedIn()) {
    Users.session((err, user) => {
      if (user) {
        $rootScope.currentUser = Auth.getUser().data;
      } else {
        Auth.logout();
        delete $rootScope.currentUser;
        $state.go('home');
      }
    });
  } else {
    $state.go('home');
  }
});

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
    'ui.router',
    'docbay.controllers', 'docbay.services'
  ])
  .controller('defaultController', (
    $rootScope, $scope, $state, $mdSidenav, Auth) => {
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
  $stateProvider, $httpProvider, $urlRouterProvider) => {
  $httpProvider.interceptors.push('TokenInjector');
  $urlRouterProvider.otherwise('404');

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'views/landing.html',
    controller: 'userCtrl'
  }).state('documents', {
    url: '/documents/',
    templateUrl: 'views/files.html',
    controller: 'docCtrl',
    authRequired: true
  }).state('404', {
    url: '/404/',
    templateUrl: 'views/404.html',
    controller: 'defaultController'
  }).state('roleDocuments', {
    url: '/roles/{id}/documents',
    templateUrl: 'views/files.html',
    controller: 'docCtrl',
    params: {
      role: null
    },
    authRequired: true
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
    controller: 'roleCtrl',
    authRequired: true
  });
}).run(($rootScope, $state, Auth, Users) => {
  $rootScope.$on('$stateChangeSuccess', checkAuth);

  var checkAuth = (evt, toState) => {
    evt.preventDefault();
    if (Auth.isLoggedIn()) {
      $state.go(toState);
    } else if (!toState.authRequired) {
      $state.go(toState);
    } else {
      $state.go('login');
    }
  };

  if (Auth.isLoggedIn()) {
    Users.session((err, user) => {
      if (user) {
        $rootScope.currentUser = Auth.getUser().data;
        $state.go('documents');
      } else {
        Auth.logout();
        $state.go('home');
      }
    });
  } else {
    $state.go('home');
  }
});

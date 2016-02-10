'use strict';
angular.module('docbay.services')
  .factory('Auth', ['$window', ($window) => {
    return {
      isLoggedIn: () => {
        return $window.localStorage.getItem('token') ? true : false;
      },

      setUser: (token) => {
        $window.localStorage.setItem('token', JSON.stringify(token));
      },

      getUser: () => {
        return JSON.parse($window.localStorage.getItem('token'));
      },

      logout: () => {
        $window.localStorage.removeItem('token');
      }
    };
  }]);

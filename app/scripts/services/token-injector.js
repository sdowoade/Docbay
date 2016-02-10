'use strict';
angular.module('docbay.services')
  .factory('TokenInjector', ['Auth', '$q', (Auth, $q) => {
    return {
      request: (config) => {
        var user = Auth.getUser();
        if (user) {
          config.headers['x-access-token'] = user.token;
        }
        return config;
      },

      responseError: (response) => {
        if (response.status == 401) {
          Auth.logout();
          return $q.reject(response);
        }
      }
    };
  }]);

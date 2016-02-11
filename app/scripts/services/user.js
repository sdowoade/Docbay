'use strict';
angular.module('docbay.services')
  .factory('Users', ['$resource', '$http', ($resource, $http) => {
    var resource = $resource('/api/users/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      stripTrailingSlashes: false
    });

    resource.login = (user, cb) => {
      $http.post('/api/users/login', user).success((res) => {
        cb(null, res);
      }).error((err) => {
        cb(err);
      });
    };

    resource.session = (cb) => {
      $http.get('/api/users/session').success((res) => {
        cb(null, res);
      }).error((err) => {
        cb(err);
      });
    };

    resource.documents = (user, cb) => {
      $http.get('/api/users/' + user._id + '/documents').success((res) => {
        cb(null, res);
      }).error((err) => {
        cb(err);
      });
    };

    resource.assignRole = (user, role, cb) => {
      $http.post('/api/users/' + user._id + '/roles', role).success((res) => {
        cb(null, res);
      }).error((err) => {
        cb(err);
      });
    };
    return resource;
  }]);

'use strict';
angular.module('docbay.services')
  .factory('Roles', ['$resource', '$http', ($resource, $http) => {
    var resource = $resource('/api/roles/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      stripTrailingSlashes: false
    });

    resource.documents = (role, cb) => {
      $http.get('/api/roles/' + role.id + '/documents').success((res) => {
        cb(null, res);
      }).error(function(err) {
        cb(err);
      });
    };

    resource.users = (role, cb) => {
      $http.get('/api/roles/' + role._id + '/users').success((res) => {
        cb(null, res);
      }).error((err) => {
        cb(err);
      });
    };
    return resource;
  }]);

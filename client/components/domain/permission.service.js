'use strict';

angular.module('usersManagementApp')
  .factory('Permission', function ($resource) {
    return $resource('/api/permissions/:id/:controller', {
      id: '@_id'
    },
    {
      update: {
        method: 'PUT'
      }
	  });
  });

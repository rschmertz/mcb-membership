'use strict';

angular.module('usersManagementApp')
  .factory('Group', function ($resource) {
    return $resource('/api/groups/:id/:controller', {
      id: '@_id'
    },
    {
      update: {
        method: 'PUT'
      }
	  });
  });

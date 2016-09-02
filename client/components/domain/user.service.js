'use strict';

angular.module('usersManagementApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      resetPassword: {
        method: 'POST',
        params: {
          controller:'password'
        }
      },
      register: {
        method: 'POST',
        params: {
          controller:'register'
        }
      },
      updateProfile: {
        method: 'PUT',
        params: {
          controller:'profile'
        }
      },
      update: {
        method: 'PUT'
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });

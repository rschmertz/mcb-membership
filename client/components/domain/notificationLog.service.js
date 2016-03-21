'use strict';

angular.module('usersManagementApp')
  .factory('NotificationLog', function ($resource) {
    return $resource('/api/notificationLogs');
  });

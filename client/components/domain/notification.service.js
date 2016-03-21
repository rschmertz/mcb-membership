'use strict';

angular.module('usersManagementApp')
  .factory('Notification', function ($resource, $upload) {
    var notification =  $resource('/api/notifications');
    notification.upload = function(model) {
      return $upload.upload({
        url: '/api/notifications',
        method: "POST",
        data: model,
        file: model.file
      });
    };

    return notification;
  });

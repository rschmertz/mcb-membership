'use strict';

angular.module('usersManagementApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('notifications2', {
        url: '/admin/notifications2',
        templateUrl: 'app/admin/notifications2/notifications2.html',
        controller: 'NotificationsCtrl2'
      });
  });

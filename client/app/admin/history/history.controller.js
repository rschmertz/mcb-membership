'use strict';

angular.module('usersManagementApp')
  .controller('HistoryCtrl', function ($scope, NotificationLog) {
    
    $scope.history = NotificationLog.query();
  });

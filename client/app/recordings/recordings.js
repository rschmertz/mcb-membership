'use strict';

angular.module('usersManagementApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('recordings', {
        url: '/recordings',
        templateUrl: 'app/recordings/recordings.html',
        controller: 'RecordingsCtrl'
      });
  });
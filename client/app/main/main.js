'use strict';

angular.module('usersManagementApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/home',
        templateUrl: 'app/main/main.html',
        authenticate: true,
        controller: 'MainCtrl'
      })
      .state('docs', {
        url: '/docs',
        templateUrl: 'app/main/docs/docs.html',
        authenticate: true,
        controller: 'DocListCtrl',
        controllerAs: 'doclist',
      });
  });

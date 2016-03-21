'use strict';

angular.module('usersManagementApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>'
      })

      .state('admin.notifications', {
        url: '/notifications',
        templateUrl: 'app/admin/notifications/notifications.html',
        controller: 'NotificationsCtrl'
      })

      .state('admin.users', {
        abstract: true,
        url: '/users',
        template: '<ui-view/>'
      })
      .state('admin.users.list', {
        url: '',
        templateUrl: 'app/admin/users/users.list.html',
        controller: 'UsersListCtrl'
      })
      .state('admin.users.grid', {
          url: '/quick-view',
          templateUrl: 'app/admin/users/users.grid.html',
          controller: 'UsersGridCtrl'
      })
      .state('admin.users.create', {
        url: '/create',
        templateUrl: 'app/admin/users/users.details.html',
        controller: 'UsersDetailsCtrl'
      })
      .state('admin.users.details', {
        url: '/{userId}',
        templateUrl: 'app/admin/users/users.details.html',
        controller: 'UsersDetailsCtrl'
      })


      .state('admin.groups', {
        abstract: true,
        url: '/groups',
        template: '<ui-view/>'
      })
      .state('admin.groups.list', {
        url: '',
        templateUrl: 'app/admin/groups/groups.list.html',
        controller: 'GroupsListCtrl'
      })
      .state('admin.groups.create', {
        url: '/create',
        templateUrl: 'app/admin/groups/groups.details.html',
        controller: 'GroupsDetailsCtrl'
      })
      .state('admin.groups.details', {
        url: '/{groupId}',
        templateUrl: 'app/admin/groups/groups.details.html',
        controller: 'GroupsDetailsCtrl'
      })


      .state('admin.permissions', {
        abstract: true,
        url: '/permissions',
        template: '<ui-view/>'
      })
      .state('admin.permissions.list', {
        url: '',
        templateUrl: 'app/admin/permissions/permissions.list.html',
        controller: 'PermissionsListCtrl'
      })
      .state('admin.permissions.create', {
        url: '/create',
        templateUrl: 'app/admin/permissions/permissions.details.html',
        controller: 'PermissionsDetailsCtrl'
      })
      .state('admin.permissions.details', {
        url: '/{permissionId}',
        templateUrl: 'app/admin/permissions/permissions.details.html',
        controller: 'PermissionsDetailsCtrl'
      })
      

      .state('admin.history', {
        url: '/history',
        templateUrl: 'app/admin/history/history.html',
        controller: 'HistoryCtrl'
      })
      ;
  });

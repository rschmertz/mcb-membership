'use strict';

angular.module('usersManagementApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.adminMenu = [
    {
      'title': 'Notifications',
      'icon': 'fa-bullhorn',
      subMenu: [
        { title: 'Send Notification', link: '/admin/notifications', 'icon': 'fa-bullhorn' },
        { title: 'History', link: '/admin/history', 'icon': 'fa-history'},
      ]
    },
    {
      'title': 'Users',
      'link': '/admin/users',
      'icon': 'fa-user'
    },
    {
      'title': 'Groups',
      'link': '/admin/groups',
      'icon': 'fa-users'
    },
    {
      'title': 'Advanced',
      'icon': 'fa-gear',
      subMenu: [
        {
          'title': 'Permissions',
          'link': '/admin/permissions',
          'icon': 'fa-lock'
        }
      ]
    },

    // {
    //   'title': 'History',
    //   'link': '/admin/history',
    //   'icon': 'fa-history'
    // },

    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;

    $scope.getCurrentUser = function() {
      var user = Auth.getCurrentUser();
      return (user.firstName || '') + ' ' + (user.lastName || '');
    },

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      if (route === '/') {
        return $location.path() === '/';
      }

      return $location.path().indexOf(route) === 0;
    };
  });
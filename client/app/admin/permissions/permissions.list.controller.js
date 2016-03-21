'use strict';

angular.module('usersManagementApp')
  .controller('PermissionsListCtrl', function ($scope, $http, Permission) {

    // Use the Permission $resource to fetch all users
    $scope.permissions = Permission.query();

    $scope.delete = function(permission) {
      Permission.remove({ id: permission._id });
      $scope.permissions = _.without($scope.permissions, permission);
    };
  });

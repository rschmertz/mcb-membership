'use strict';

angular.module('usersManagementApp')
  .controller('PermissionsDetailsCtrl', function ($scope, $stateParams, $state, Permission) {
    var permissionId = $stateParams.permissionId;

    $scope.isNewPermission = !permissionId;
    if (permissionId) {
      $scope.permission = Permission.get({ id: permissionId });
    } else {
      $scope.permission = new Permission({ active: true });
    }
    
    $scope.save = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        if (!permissionId) {
          $scope.permission.$save();  
        } else {
          Permission.update({ id: permissionId }, $scope.permission);
        }
        
        $state.go('^.list');
      }
    };
  });

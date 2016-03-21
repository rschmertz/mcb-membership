'use strict';

angular.module('usersManagementApp')
  .controller('GroupsDetailsCtrl', function ($scope, $stateParams, $state, Group, Permission, User) {
    var groupId = $stateParams.groupId;

    $scope.isNewGroup = !groupId;
    if (groupId) {
      $scope.group = Group.get({ id: groupId });
    } else {
      $scope.group = new Group({ active: true, users: [], permissions: [] });
    }
    
    $scope.save = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        if (!groupId) {
          $scope.group.$save();  
        } else {
          Group.update({ id: groupId }, $scope.group);
        }
        
        $state.go('^.list');
      }
    };

    $scope.users = User.query();
    $scope.hasUser = function(user) {
      return _.some($scope.group.users, function(u) {
        return u == user._id;
      });
    }

    $scope.checkUser = function(user) {
      if ($scope.hasUser(user)) {
        $scope.group.users.splice($scope.group.users.indexOf(user._id), 1);
      } else {
        $scope.group.users.push(user._id);
      }
    }

    $scope.permissions = Permission.query();
    $scope.hasPermission = function(permission) {
      return _.some($scope.group.permissions, function(p) {
        return p == permission._id;
      });
    }

    $scope.checkPermission = function(permission) {
      if ($scope.hasPermission(permission)) {
        $scope.group.permissions.splice($scope.group.permissions.indexOf(permission._id), 1);
      } else {
        $scope.group.permissions.push(permission._id);
      }
    }
  });

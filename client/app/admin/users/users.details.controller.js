'use strict';

angular.module('usersManagementApp')
  .controller('UsersDetailsCtrl', function ($scope, $stateParams, $state, User, Group) {
    var userId = $stateParams.userId;

    $scope.membershipLevels = ['Active', 'Inactive'];

    $scope.isNewUser = !userId;
    if (userId) {
      $scope.user = User.get({ id: userId });
    } else {
      $scope.user = new User({ groups: [] });
    }
    
    $scope.save = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        if (!userId) {
          $scope.user.$save();  
        } else {
          User.update({ id: userId }, $scope.user);
        }
        
        $state.go('^.list');
      }
    };

    $scope.groups = Group.query();
    $scope.hasGroup = function(group) {
      return _.some($scope.user.groups, function(g) {
        return g == group._id;
      });
    }

    $scope.checkGroup = function(group) {
      if ($scope.hasGroup(group)) {
        $scope.user.groups.splice($scope.user.groups.indexOf(group._id), 1);
      } else {
        $scope.user.groups.push(group._id);
      }
    }
  });

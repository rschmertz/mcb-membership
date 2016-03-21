'use strict';

angular.module('usersManagementApp')
  .controller('GroupsListCtrl', function ($scope, $http, Group) {

    // Use the Group $resource to fetch all users
    $scope.groups = Group.query();

    $scope.delete = function(group) {
      Group.remove({ id: group._id });
      $scope.groups = _.without($scope.groups, group);
    };
  });

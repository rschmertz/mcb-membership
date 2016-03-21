'use strict';

angular.module('usersManagementApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.user = angular.copy(Auth.getCurrentUser());

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
    };

    $scope.updateProfile = function(form) {
      $scope.profileSubmitted = true;
      if(form.$valid) {
        Auth.updateProfile({ firstName: $scope.user.firstName, lastName: $scope.user.lastName })
        .then( function() {
          $scope.profileMessage = 'Profile successfully updated.';
        })
        .catch( function() {
          $scope.profileMessage = 'Profile is not updated';
        });
      }
		};
  });

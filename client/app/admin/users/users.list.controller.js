'use strict';

angular.module('usersManagementApp')
  .controller('UsersListCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();


    $scope.delete = function(user) {
      User.remove({ id: user._id });
      $scope.users = _.without($scope.users, user);
    };
  })
  .controller('UsersGridCtrl', function ($scope, $http, $location, $modal, Auth, User)
{

    var user = angular.copy(Auth.getCurrentUser());
    user.isAdmin = !!_.find(user.groups, {name: "Administrators"});
    $scope.user = user;

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    function getSelectedRow() {
        return $scope.gridApi.selection.getSelectedRows();
    };

    $scope.rowSelected = function rowSelected() {
        var rows = getSelectedRow();
        var selected = rows.length > 0;
        return selected;
    }

    $scope.editMember = function editMember() {
        var row = getSelectedRow();
        if (row.length != 1) {
            alert("error in row selection");
            return;
        }
        var member = row[0];
        $location.url('/admin/users/' + member._id);
    };

      $scope.resetPassword = function resetPassword() {
        var row = getSelectedRow();
        if (row.length != 1) {
            alert("error in row selection");
            return;
        }
        var member = row[0];
        var modal = $modal.open({
            templateUrl: "confirmationDialog",
            controller: "ConfirmDialogCtrl",
            resolve: {
                question: function () {
                    return "Reset password for " + member.firstName +
                        " " + member.lastName + "?"
                },
            },
        });
        modal.result.then(function (value) {
            User.resetPassword({id: member._id});
        });          
      }

    $scope.deleteMember = function deleteMember() {
        var row = getSelectedRow();
        if (row.length != 1) {
            alert("error in row selection");
            return;
        }
        var member = row[0];
        var modal = $modal.open({
            templateUrl: "confirmationDialog",
            controller: "ConfirmDialogCtrl",
            resolve: {
                question: function () {
                    return "Really delete " + member.firstName + 
                        " " + member.lastName + "?"
                },
            },
        });
        modal.result.then(function (value) {
            User.remove({id: member._id});
            $scope.users = _.without($scope.users, member);
            $scope.gridOptions.data = $scope.users; // for refresh
        });
    }

    var columnDefs = [
        {name: "lastName",
         width: 110},
        {name: "firstName",
         width: 100},
        {name: "Membership level",
         width: 108},
        {name: "email",
         width: 190},
        {name: "Instrument 1",
         width: 130},
        {name: "Cell Phone",
         width: 110},
        {name: "Home Phone",
         width: 110},
        {name: "Work Phone",
         width: 110},
        {name: "Work Ext",
         width: 90},
        {name: "Street Address 1",
         width: 220},
        {name: "Street Address 2",
         enableSorting: false,
         width: 130},
        {name: "City",
         width: 110},
        {name: "State",
         width: 70},
        {name: "Zip",
         width: 55},
    ];

    var restrictedColDefs = _.filter(columnDefs, function (o) {
        return _.find(['lastName', 'firstName', 'Instrument 1'], function (key) {
            return key == o.name;
        });
    });

      console.log("restricted column defs:", restrictedColDefs);

    $scope.gridOptions = {
        enableGridMenu: true,
        exporterCsvFilename: "mcb_roster.csv",
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect: false,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
        columnDefs: user.isAdmin ? columnDefs : restrictedColDefs,
        data: $scope.users
    };
  })
    .controller('ConfirmDialogCtrl', function($scope, $modalInstance, question) {
        $scope.question = question;
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

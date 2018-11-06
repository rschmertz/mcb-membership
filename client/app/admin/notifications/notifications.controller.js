'use strict';

angular.module('usersManagementApp')
  .controller('NotificationsCtrl', function ($scope, User, Group, Notification) {
    var vm = { };
    vm.type = 'email';
    vm.mode = 'users';
    vm.groupsSelected = [];
    vm.usersSelected = [];
    vm.emailBody = '';
    vm.needUpload = false;

    vm.setMode = function(m) {
      vm.mode = m;
    };
    vm.isMode = function(m) {
      return vm.mode == m;
    };

    vm.setType = function(t) {
      vm.type = t;
    };
    vm.isType = function(t) {
      return vm.type == t;
    };

    vm.users = User.query();
    vm.groups = Group.query();

    vm.hasUser = function(user) {
      return _.some(vm.usersSelected, function(u) {
        return u == user._id;
      });
    };
    vm.checkUser = function(user) {
      if (vm.hasUser(user)) {
        vm.usersSelected.splice(vm.usersSelected.indexOf(user._id), 1);
      } else {
        vm.usersSelected.push(user._id);
      }
    };

    vm.hasGroup = function(group) {
      return _.some(vm.groupsSelected, function(g) {
        return g == group._id;
      });
    };
    vm.checkGroup = function(group) {
      if (vm.hasGroup(group)) {
        vm.groupsSelected.splice(vm.groupsSelected.indexOf(group._id), 1);
      } else {
        vm.groupsSelected.push(group._id);
      }
    };

    vm.fileSelected = function ($files) {
      if(!$files.length) return;

      vm.needUpload = true;
      vm.attachment = $files[0].name;
    }

    vm.setActiveFilter = function(isActiveOnly) {
      vm.activeOnly = isActiveOnly;
      if(isActiveOnly){
        vm.selectAll();

        vm.groupsSelected = _.chain(vm.groups)
        .filter(function(item){
          return vm.groupsSelected.indexOf(item._id) != -1;
        })
        .map(function(item){ 
          return item._id; 
        })
        .value();
      } else {
          vm.clearAll();
      }
    }

    // Reminder: filter, well, filters the users, i.e., decides which are shown
    vm.activeFilter = function(item){
      if(!vm.activeOnly){
        return true;
      }
      return item['Membership level'] == 'Active'  || item.stillGetEmails;
    }

    // ...and "selectAll", well, selects all users from the displayed list.
    // there's some redundancy here I'd like to address.
    vm.selectAll = function selectAll() {
        vm.usersSelected = _.chain(vm.users)
        .filter(function(item){
          return (!vm.activeOnly || item['Membership level'] == 'Active'
          || item.stillGetEmails);
        })
        .map(function(item){ 
          return item._id; 
        })
        .value();
    }

    vm.clearAll = function clearAll() {
        vm.usersSelected = [];
    }

    vm.send = function() {
      vm.isValidationError = false;
      vm.isSent = false;
      if ((vm.isMode('users') && vm.usersSelected.length == 0) 
        || (vm.isMode('groups') && vm.groupsSelected.length == 0)
        || !vm.subject) {
        vm.isValidationError = true;
      return;
      }

      var model = {
        mode: vm.mode,
        type: vm.type,
        users: vm.usersSelected,
        groups: vm.groupsSelected,
        subject: vm.subject,
        message: vm.message
      };

      vm.isLoading = true;
      var respPromise;
      if (vm.needUpload) {
        vm.needUpload = false; 
        model.file = vm.attachmentFile;
        respPromise = Notification.upload(model);
      } else {
        var n = new Notification(model);
        respPromise = n.$save();
      }

      respPromise.then(function() {
        vm.isSent = true;  
        vm.isLoading = false;        
      },
        function (rot /* resourceObjThingy */) {
	    console.log("so I guess thiw worked");
	    vm.isSent = false;
	    vm.isSentError = true;
	    vm.sendFailedMessage = rot.statusText;
	    vm.isLoading = false;        
	})
	  .catch(function () {
	      console.log("we're in the catch");
	  });
    };

    $scope.vm = vm;
  });

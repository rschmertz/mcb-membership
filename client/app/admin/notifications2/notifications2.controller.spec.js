'use strict';

describe('Controller: Notifications2Ctrl', function () {

  // load the controller's module
  beforeEach(module('usersManagementApp'));

  var Notifications2Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Notifications2Ctrl = $controller('Notifications2Ctrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

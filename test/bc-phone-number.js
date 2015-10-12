'use strict';

describe('Directive: bc-phone-number', function () {

  // load the directive's module
  beforeEach(module('bcPhoneNumber'));

  var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    var element = angular.element('<bc-phone-number></bc-phone-number>');
    element = $compile(element)(scope);

    scope.$digest();

    expect(scope.number).toBe(undefined);
  }));
});

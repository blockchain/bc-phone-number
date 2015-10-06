'use strict';

describe('Directive: phone-number', function () {

  // load the directive's module
  beforeEach(module('phoneNumber'));
  beforeEach(module('templates'));

  var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    var element = angular.element('<phone-number></phone-number>');
    element = $compile(element)(scope);

    scope.$digest();

    expect(scope.number).toBe(undefined);
  }));
});

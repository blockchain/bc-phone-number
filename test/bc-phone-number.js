'use strict';

describe('Directive: bc-phone-number', function() {

  // load the directive's module
  beforeEach(module('bcPhoneNumber'));

  var scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
    scope.$digest();
  }));

  it('should make hidden element visible', inject(function($compile) {
    var element = angular.element('<bc-phone-number ng-model="number"></bc-phone-number>');
    element = $compile(element)(scope);

    expect(scope.number).toBe(undefined);
  }));
});

describe('Service: bcPhoneNumber', function() {

  // load the service's module
  beforeEach(module('bcPhoneNumber'));

  // instantiate service
  var bcPhoneNumber;
  beforeEach(inject(function(_bcPhoneNumber_) {
    bcPhoneNumber = _bcPhoneNumber_;
  }));

  describe('bcPhoneNumber.format(number)', function() {

    it('should work', function() {
      expect(bcPhoneNumber.format('966501234567')).toEqual('+966 50 123 4567');
    });
  });

  describe('bcPhoneNumber.isValid(number)', function() {

    it('should work', function() {
      expect(bcPhoneNumber.isValid('+966 50 123 4567')).toBe(true);
    });
  });
});

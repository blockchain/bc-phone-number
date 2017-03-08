import angular from 'angular';
import 'angular-mocks';
import bcPhoneNumber from '../src/bc-phone-number';

describe('Directive: bc-phone-number', () => {

  // load the directive's module
  beforeEach(angular.mock.module(bcPhoneNumber));

  let scope;

  beforeEach(inject($rootScope => {
    scope = $rootScope.$new();
    scope.$digest();
  }));

  it('should make hidden element visible', inject($compile => {
    let element = angular.element('<bc-phone-number ng-model="number"></bc-phone-number>');
    element = $compile(element)(scope);

    expect(scope.number).toBe(undefined);
  }));
});

describe('Service: bcPhoneNumber', () => {

  // load the service's module
  beforeEach(angular.mock.module('bcPhoneNumber'));

  // instantiate service
  let bcPhoneNumber;
  beforeEach(inject(_bcPhoneNumber_ => {
    bcPhoneNumber = _bcPhoneNumber_;
  }));

  describe('bcPhoneNumber.format(number)', () => {

    it('should work', () => {
      expect(bcPhoneNumber.format('966501234567')).toEqual('+966 50 123 4567');
    });
  });

  describe('bcPhoneNumber.isValid(number)', () => {

    it('should work', () => {
      expect(bcPhoneNumber.isValid('+966 50 123 4567')).toBe(true);
    });
  });
});

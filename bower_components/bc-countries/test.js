'use strict';

function itShouldReturnEmptyString (fn) {
  it('should return an empty string when given a faulsy value', function () {
    expect(fn(null)).toBe('');
    expect(fn('')).toBe('');
  });
}

describe('bcCountries.getIso2CodeByDigits(digits)', function () {

  itShouldReturnEmptyString(bcCountries.getIso2CodeByDigits);

  it('should return country code when given an exact dial code', function () {
    expect(bcCountries.getIso2CodeByDigits('966')).toEqual('sa');
    expect(bcCountries.getIso2CodeByDigits('44')).toEqual('gb');

    expect(bcCountries.getIso2CodeByDigits('1684')).toEqual('as');
    expect(bcCountries.getIso2CodeByDigits('1')).toEqual('us');
  });

  it('should return country code when given digits that start with the dial code', function () {
    expect(bcCountries.getIso2CodeByDigits('9665124478564')).toEqual('sa');
    expect(bcCountries.getIso2CodeByDigits('44452218321')).toEqual('gb');
    expect(bcCountries.getIso2CodeByDigits('16842178')).toEqual('as');
    expect(bcCountries.getIso2CodeByDigits('14455')).toEqual('us');
  });

  it('should return an empty string when given digits that do not start with a dial code', function () {
    expect(bcCountries.getIso2CodeByDigits('99999')).toEqual('');
    expect(bcCountries.getIso2CodeByDigits('044')).toEqual('');
  });
});

describe('bcCountries.getDialCodeByDigits(digits)', function () {

  itShouldReturnEmptyString(bcCountries.getDialCodeByDigits);

  it('should return dial code when given an exact dial code', function () {
    expect(bcCountries.getDialCodeByDigits('966')).toEqual('966');
    expect(bcCountries.getDialCodeByDigits('44')).toEqual('44');

    expect(bcCountries.getDialCodeByDigits('1684')).toEqual('1684');
    expect(bcCountries.getDialCodeByDigits('1')).toEqual('1');
  });

  it('should return dial code when given digits that start with the dial code', function () {
    expect(bcCountries.getDialCodeByDigits('9665124478564')).toEqual('966');
    expect(bcCountries.getDialCodeByDigits('44452218321')).toEqual('44');
    expect(bcCountries.getDialCodeByDigits('16842178')).toEqual('1684');
    expect(bcCountries.getDialCodeByDigits('14455')).toEqual('1');
  });

  it('should return an empty string when given digits that do not start with a dial code', function () {
    expect(bcCountries.getDialCodeByDigits('99999')).toEqual('');
    expect(bcCountries.getDialCodeByDigits('044')).toEqual('');
  });
});

describe('bcCountries.getCountryByIso2Code(iso2Code)', function () {

  it('should return null when the code is unknown or is a faulsy value', function () {
    expect(bcCountries.getCountryByIso2Code('abc')).toBe(null);
    expect(bcCountries.getCountryByIso2Code('def')).toBe(null);

    expect(bcCountries.getCountryByIso2Code(null)).toBe(null);
    expect(bcCountries.getCountryByIso2Code('')).toBe(null);
  });

  it('should return the correct fields', function () {
    expect(bcCountries.getCountryByIso2Code('gb')).toEqual({dialCode: '44', iso2Code: 'gb', name: 'United Kingdom'});
    expect(bcCountries.getCountryByIso2Code('us')).toEqual({dialCode: '1', iso2Code: 'us', name: 'United States'});
  });
});

describe('bcCountries.getAllCountries()', function () {

  it('should have 242 elements', function () {
    expect(bcCountries.getAllCountries().length).toEqual(242);
  });

  it('should returns the correct fields', function () {
    expect(bcCountries.getAllCountries()[3]).toEqual({dialCode: '1684', iso2Code: 'as', name: 'American Samoa'});
    expect(bcCountries.getAllCountries()[4]).toEqual({dialCode: '376', iso2Code: 'ad', name: 'Andorra'});
  });
});

describe('bcCountries.changeDialCode(number, newDialCode)', function () {

  it('should return the dial cial code prefixed when the number has a faulsy value', function () {
    expect(bcCountries.changeDialCode(null, '1648')).toEqual('+1648');
    expect(bcCountries.changeDialCode('', '966')).toEqual('+966');
    expect(bcCountries.changeDialCode('', '1')).toEqual('+1');
  });

  it('should return the same number formatted with the new dial code', function () {
    expect(bcCountries.changeDialCode('+966657-893-4754', '1')).toEqual('+1 657-893-4754');
    expect(bcCountries.changeDialCode('+44501234567', '966')).toEqual('+966 50 123 4567');
  });

  it('should return the number prefixed with the new dial code if it does not start with a dial code', function () {
    expect(bcCountries.changeDialCode('+8874', '1')).toEqual('+1 887-4');
    expect(bcCountries.changeDialCode('99', '966')).toEqual('+966 99');
  });
});

describe('bcCountries.isValidNumber(number)', function () {

  it('should return false when the number has a faulsy value', function () {
    expect(bcCountries.isValidNumber(null)).toBe(false);
    expect(bcCountries.isValidNumber('')).toBe(false);
  });

  it('should return false when the number does not start with a country dial code', function () {
    expect(bcCountries.isValidNumber('+8874')).toBe(false);
    expect(bcCountries.isValidNumber('99')).toBe(false);
  });

  it('should return false when the number does not start with a +', function () {
    expect(bcCountries.isValidNumber('966 50 123 4567')).toBe(false);
    expect(bcCountries.isValidNumber('1 657-893-4754')).toBe(false);
  });

  it('should return true when the number only when the number is an international valid number', function () {
    expect(bcCountries.isValidNumber('+966 50 123 4567')).toBe(true);
    expect(bcCountries.isValidNumber('+1 657-893-4754')).toBe(true);
  });
});

describe('bcCountries.formatNumber(number)', function () {

  itShouldReturnEmptyString(bcCountries.formatNumber);

  it('should return the same number when the number does not start with a dial code', function () {
    expect(bcCountries.formatNumber('999654')).toEqual('999654');
    expect(bcCountries.formatNumber('8844')).toEqual('8844');
  });

  it('should return a formatted number when the given number start with a dial code', function () {
    expect(bcCountries.formatNumber('+966501234567')).toEqual('+966 50 123 4567');
    expect(bcCountries.formatNumber('966501234567')).toEqual('+966 50 123 4567');
    expect(bcCountries.formatNumber('966')).toEqual('+966');
  });
});

describe('bcCountries.getDigits(number)', function () {

  itShouldReturnEmptyString(bcCountries.getDigits);

  it('should return digits', function () {
    expect(bcCountries.getDigits('+966 50 123 4567-abc')).toEqual('966501234567');
  });
});

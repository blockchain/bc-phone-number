'use strict';

var expect = require('chai').expect,
    Random = require('random-js'),
    Trie = require('./src');

var random = new Random(Random.engines.mt19937().autoSeed());

// NOTE: for testing purposes
var MAX_KEY_LENGTH = 20;

function randomValue () {
  var length = random.integer(1, 13);
  return random.string(length);
}

function getRandomKey(length) {
  return random.string(length, '0123456789');
}

function getLongRandomKey () {
  var length = random.integer(MAX_KEY_LENGTH / 2 + 1, MAX_KEY_LENGTH);
  return getRandomKey(length);
}

function getShortRandomKey () {
  var length = random.integer(1, MAX_KEY_LENGTH / 2);
  return getRandomKey(length);
}

function getRandomTrie () {
  var operations = random.integer(0, 100);
  var trie = new Trie();

  for (var i = 0; i < operations; i++) {

    switch (random.integer(1, 3)) {
      case 1: trie.set(getLongRandomKey(), randomValue());    break;
      case 2: trie.get(getLongRandomKey());                   break;
      case 3: trie.longestMatchingPrefix(getLongRandomKey()); break;
    }
  }

  return trie;
}

function forAll (message, fn) {

  it(message, function () {
    for (var i = 0; i < 100; i++) { fn(getRandomTrie()); }
  });
}

describe('Trie#longestMatchingPrefix(key)', function () {

  forAll('should return the longest matching prefix node when the key starts with an existing key', function (trie) {
    var value = randomValue();
    var key = getShortRandomKey();
    var result;

    trie.set(key, value);

    result = trie.longestMatchingPrefix(key + getLongRandomKey());

    expect(result.value).to.equal(value);
    expect(result.key).to.equal(key);
  });

  forAll('should behave like #get when given an existing key', function (trie) {
    var value = randomValue();
    var key = getShortRandomKey();
    var result;

    trie.set(key, value);

    result = trie.longestMatchingPrefix(key);

    expect(result.value).to.equal(value);
    expect(result.key).to.equal(key);
  });

  forAll('should behave like #get when given a non-existing key', function (trie) {
    var result = trie.longestMatchingPrefix(getShortRandomKey());

    expect(result.value).to.equal('');
    expect(result.key).to.equal('');
  });
});

describe('Trie#get(key)', function () {

  forAll('should return a non-empty node when given an existing key', function (trie) {
    var value = randomValue();
    var key = getShortRandomKey();
    var result;

    trie.set(key, value);

    result = trie.get(key);

    expect(result.value).to.equal(value);
    expect(result.key).to.equal(key);
  });

  forAll('should return an empty node when given a non-existing key', function (trie) {
    var result = trie.get(getRandomKey(MAX_KEY_LENGTH + 1));

    expect(result.value).to.equal('');
    expect(result.key).to.equal('');
  });
});

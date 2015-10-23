'use strict';

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define('digits-trie', function() {
      return factory();
    });
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
  else {
    window.DigitsTrie = factory();
  }
})(function () {

  function isValidKey (key) {
    if (typeof (key) !== 'string') { return false; }
    else {
      for (var i = 0; i < key.length; i++) {
        if (isNaN(parseInt(key[i]))) { return false; }
      }

      return true;
    }
  }

  function assertValidKey (key) {
    if (!isValidKey(key)) { throw new Error('digits-trie: invalid key "' + key + '" -_-'); }
  }

  function isEmptyKey (key) {
    return key.length === 0;
  }

  function isEmptyNode (node) {
    return !(node && node.key && node.value);
  }

  function Node() {
    this.children = new Array(9);
  }

  var Nil = new Node();
  Nil.isNil = true;
  Nil.value = '';
  Nil.key = '';

  Node.prototype.getChild = function(i) {
    if      (i < 0 || i > 9)   { throw new Error('-_-');               }
    else if (this.children[i]) { return this.children[i];              }
    else                       { return this.children[i] = new Node(); }
  }

  function Trie () {
    this.root = new Node();
  }

  Trie.prototype.set = function (key, value) {
    assertValidKey(key);

    if (isEmptyKey(key)) { return; }
    else {
      var node = this.root;

      for (var i = 0; i < key.length - 1; i++) {
        var character = key[i];
        var index = parseInt(character);
        node = node.getChild(index);
      }

      var newNode = node.getChild(parseInt(key[key.length-1]));
      newNode.value = value;
      newNode.key = key;
    }
  }

  Trie.prototype.get = function (key) {
    assertValidKey(key);

    if (isEmptyKey(key)) { return Nil; }
    else {
      var node = this.root;

      for (var i = 0; node && i < key.length; i++) {
        var character = key[i];
        var index = parseInt(character);

        node = node.children[index];
      }

      if (!isEmptyNode(node)) { return node; }
      else                    { return Nil;  }
    }
  }

  Trie.prototype.longestMatchingPrefix = function (key) {
    assertValidKey(key);

    if (isEmptyKey(key)) { return Nil; }
    else {
      var prevNode = null;
      var node = this.root;

      for (var i = 0; node && i < key.length; i++) {
        var character = key[i];
        var index = parseInt(character);

        if (node.value) { prevNode = node };
        node = node.children[index];
      }

      if      (!isEmptyNode(node))     { return node;     }
      else if (!isEmptyNode(prevNode)) { return prevNode; }
      else                             { return Nil;      }
    }
  }

  return Trie;
});

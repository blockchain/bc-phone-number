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

Trie.prototype.put = function (key, value) {

  if (!key || key.length < 1) { return; }
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

  if (!key || key.length < 1) { return Nil; }
  else {
    var node = this.root;

    for (var i = 0; node && i < key.length; i++) {
      var character = key[i];
      var index = parseInt(character);

      node = node.children[index];
    }

    if (node && node.value) { return node; }
    else                    { return Nil;  }
  }
}

Trie.prototype.longestPrefix = function (key) {

  if (!key || key.length < 1) { return Nil; }
  else {
    var prevNode = null;
    var node = this.root;

    for (var i = 0; node && i < key.length; i++) {
      var character = key[i];
      var index = parseInt(character);

      if (node.value) { prevNode = node };
      node = node.children[index];
    }

    if      (node && node.value)         { return node;     }
    else if (prevNode && prevNode.value) { return prevNode; }
    else                                 { return Nil;      }
  }
}

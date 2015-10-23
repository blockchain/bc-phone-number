# digits-trie [![Build Status](https://travis-ci.org/Ahimta/digits-trie.svg?branch=master)](https://travis-ci.org/Ahimta/digits-trie)
Fast prefix operations for strings of digits

## Installation

### Bower
```bash
bower install --save digits-trie
```

```js
var Trie = window.DigitsTrie;
```

### NPM
```bash
npm install --save digits-trie
```

```js
var Trie = require('digits-trie');
```

## Usage
The main goal of digits-trie is to provide fast prefix operations for strings of digits.
As of now it has a limited set of features. If you want a feature to be added, open an issue and explain your usecase.

Not that all keys have to be strings of digits, otherwise an exception will be thrown.

### Usage example
```js
var trie = new Trie();

trie.set('966', 'sa');

var node = trie.get('966');
node.value === 'sa';
node.key === '966';

trie.longestMatchingPrefix('966501245687') === node;

var emptyNode = trie.get('1234');
emptyNode.isNil === true;
emptyNode.value === '';
emptyNode.key === '';
```

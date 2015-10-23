# bc-css-flags [![Build Status](https://travis-ci.org/Ahimta/bc-css-flags.svg?branch=master)](https://travis-ci.org/Ahimta/bc-css-flags)

## Installation

### Bower
```bash
bower install --save bc-css-flags
```

### NPM
```bash
npm install --save bc-css-flags
```

### Other (not recommended)
Just download the [dist](https://github.com/Ahimta/bc-css-flags/tree/master/dist) folder.

## Usage
The easiet way to get up and running is to keep the dist/ folder structure as is.

By default the styles expect images to be in `../img` folder relative to `css` files.
And this images folder is expected to contain: 1)`flags@2x.png`. 2)`flags.png`.

You can change this behavior by importing `dist/bc-css-flags.scss` into your own Sass files, and changing some of its
variables before importing.

```sass
$flagsImagePath: "app/images";

@import "bower_components/bc-css-flags/dist/bc-css-flags.scss"
```

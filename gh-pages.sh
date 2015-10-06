#!/bin/env sh
git checkout -B gh-pages HEAD

gulp  build

mkdir -p dist/build/css
mkdir -p dist/build/img
mkdir -p dist/lib/js
mkdir -p dist/src

cp -r bower_components/ dist/bower_components/

cp build/img/flags.png build/img/flags@2x.png dist/build/img/
cp build/css/main.css build/css/sprite.css dist/build/css/

cp lib/js/libphonenumber.min.js dist/lib/js/

cp -r src/html/ dist/src/html/
cp -r src/js/ dist/src/js/

cp index.html dist/

git add --force --all dist

git commit -am "Deploy to gh-pages"
git push --force origin `git subtree split --prefix dist gh-pages`:gh-pages

git checkout master

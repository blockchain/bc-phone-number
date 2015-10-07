#!/bin/env sh
git checkout -B gh-pages HEAD

gulp  build

mkdir -p dist/node_modules
mkdir -p dist/build/css
mkdir -p dist/build/img
mkdir -p dist/build/js
mkdir -p dist/src

cp -r node_modules/bootstrap/ dist/node_modules/bootstrap/

cp build/img/flags.png build/img/flags@2x.png dist/build/img/
cp build/css/main.css build/css/sprite.css dist/build/css/

cp build/js/bundle.js dist/build/js/

cp -r src/html/ dist/src/html/

cp index.html dist/

git add --force --all dist

git commit -am "Deploy to gh-pages"
git push --force origin `git subtree split --prefix dist gh-pages`:gh-pages

git checkout master

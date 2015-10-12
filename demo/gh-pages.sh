#!/bin/env sh
git checkout -B gh-pages HEAD

gulp build

mkdir gh-pages

cp -r bower_components/ gh-pages/bower_components/
cp -r dist/ gh-pages/dist/

cp demo/index.html gh-pages/
cp demo/demo.js gh-pages/

git add --force --all gh-pages

git commit -am "Deploy to gh-pages"
git push --force origin `git subtree split --prefix gh-pages gh-pages`:gh-pages

git checkout master

'use strict';

var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache'),
    changed       = require('gulp-changed'),
    connect       = require('gulp-connect'),
    exec          = require('gulp-exec'),
    scss          = require('gulp-scss');

var wiredep = require('wiredep').stream;

var GLOBS = {
  assets: '{index.html,src/*/*.{html,scss,js}}',
  styles: '{src/css/main.scss,build/css/sprite.scss}'
};

gulp.task('build-flags', function () {
  gulp.src('build')
    .pipe(exec('grunt'))
    .pipe(exec.reporter());
});

gulp.task('test', function () {
  gulp.src('test/karma.conf.js')
    .pipe(exec('karma start <%= file.path %>'))
    .pipe(exec.reporter());
});

gulp.task('deploy', function () {
  gulp.src('gh-pages.sh')
    .pipe(exec('sh <%= file.path %>'))
    .pipe(exec.reporter());
});

gulp.task('inline-templates', function () {
  gulp.src('src/html/*.html')
    .pipe(templateCache({
      standalone: true,
      module: 'templates',
      root: 'src/html'
    }))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('scss', function () {
  gulp.src('src/css/main.scss')
    .pipe(scss())
    .pipe(gulp.dest('./build/css'));

  gulp.src('build/css/sprite.scss')
    .pipe(scss())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('wiredep', function () {
  gulp.src('index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('.'));

  gulp.src('test/karma.conf.js')
    .pipe(wiredep({
      devDependencies: true,
    }))
    .pipe(gulp.dest('test/'));
});

gulp.task('connect', function () {
  connect.server({
    livereload: true,
    fallback: 'index.html',
    host: 'localhost',
    port: 8080,
    root: '.'
  });
});

gulp.task('reload', function () {
  gulp.src(GLOBS.assets)
    .pipe(changed(GLOBS.assets))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['src/html/*.html'], ['inline-templates']);
  gulp.watch([GLOBS.assets], ['reload']);
  gulp.watch([GLOBS.styles], ['scss']);
  gulp.watch(['bower.json'], ['wiredep']);
});

gulp.task('build', ['scss', 'inline-templates', 'wiredep', 'build-flags']);
gulp.task('default', ['scss', 'inline-templates', 'wiredep', 'connect', 'watch']);

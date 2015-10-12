'use strict';

var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache'),
    runSequence   = require('run-sequence'),
    minifyCss     = require('gulp-minify-css'),
    changed       = require('gulp-changed'),
    connect       = require('gulp-connect'),
    concat        = require('gulp-concat'),
    rename        = require('gulp-rename'),
    uglify        = require('gulp-uglify');

var childProcess = require('child_process'),
    wiredep      = require('wiredep').stream,
    merge        = require('merge-stream'),
    del          = require('del');

var GLOBS = {
  assets: '{demo/index.html,src/*.{html,css,js}}'
};

function execute (command, callback) {
  childProcess.exec(command, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
}

function executeTask (command) {
  return function (callback) {
    execute(command, callback);
  };
}

gulp.task('browserify', executeTask('grunt browserify'));

gulp.task('deploy', executeTask('sh demo/gh-pages.sh'));

gulp.task('test', executeTask('grunt karma:unit'));

gulp.task('server:connect', function () {
  connect.server({
    livereload: true,
    fallback: 'demo/index.html',
    host: 'localhost',
    port: 8080,
    root: ['demo/', '.']
  });
});

gulp.task('server:reload', function () {
  return gulp.src(GLOBS.assets)
    .pipe(changed(GLOBS.assets))
    .pipe(connect.reload());
});

gulp.task('refresh', function (callback) {
  runSequence('build', 'server:reload', callback);
});

gulp.task('build:css', function () {
  return gulp.src('src/bc-phone-number.css')
    .pipe(gulp.dest('dist/css/'))
    .pipe(minifyCss())
    .pipe(rename('bc-phone-number.min.css'))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('uglify', function () {
  return gulp.src('dist/js/bc-phone-number.js')
    .pipe(uglify())
    .pipe(rename('bc-phone-number.min.js'))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('wiredep', function () {
  var index = gulp.src('demo/index.html')
    .pipe(wiredep({ignorePath: '../'}))
    .pipe(gulp.dest('demo/'));

  var test = gulp.src('test/karma.conf.js')
    .pipe(wiredep({devDependencies: true}))
    .pipe(gulp.dest('test/'));

  return merge(index, test);
});

gulp.task('inline-templates', function () {
  return gulp.src('src/*.html')
    .pipe(templateCache({
      standalone: true,
      module: 'bcPhoneNumberTemplates',
      root: 'bc-phone-number'
    }))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('watch', function () {
  gulp.watch([GLOBS.assets], ['refresh']);
});

gulp.task('clean', function () {
  return del(['build/']);
});

gulp.task('build', function (callback) {
  runSequence(['inline-templates', 'wiredep', 'build:css'], 'browserify', 'uglify', 'clean', callback);
});

gulp.task('default', function (callback) {
  runSequence('build', 'server:connect', 'watch', callback);
});

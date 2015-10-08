'use strict';

var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache'),
    runSequence   = require('run-sequence'),
    changed       = require('gulp-changed'),
    connect       = require('gulp-connect'),
    concat        = require('gulp-concat'),
    exec          = require('gulp-exec'),
    scss          = require('gulp-scss');

var childProcess = require('child_process'),
    wiredep      = require('wiredep').stream,
    merge        = require('merge-stream'),
    del          = require('del');

var GLOBS = {
  assets: '{index.html,src/*/*.{html,js}}'
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

gulp.task('wiredep', function () {
  var index = gulp.src('index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('.'));

  var test = gulp.src('test/karma.conf.js')
    .pipe(wiredep({
      devDependencies: true,
    }))
    .pipe(gulp.dest('test/'));

  return merge(index, test);
});

gulp.task('concat:css', function () {
  return gulp.src(['build/css/main.css', 'build/css/sprite.css'])
    .pipe(concat('phone-number.css'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('inline-templates', function () {
  return gulp.src('src/html/*.html')
    .pipe(templateCache({
      standalone: true,
      module: 'phoneNumberTemplates',
      root: 'src/html'
    }))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('browserify', executeTask('grunt browserify'));

gulp.task('build:flags', executeTask('grunt build'));

gulp.task('test', executeTask('karma start test/karma.conf.js'));

gulp.task('deploy', executeTask('sh gh-pages'));

gulp.task('scss', function () {
  var main = gulp.src('src/css/main.scss')
    .pipe(scss())
    .pipe(gulp.dest('./build/css'));

  var sprite = gulp.src('build/css/sprite.scss')
    .pipe(scss())
    .pipe(gulp.dest('./build/css'));

  return merge(main, sprite);
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
  return gulp.src(GLOBS.assets)
    .pipe(changed(GLOBS.assets))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch([GLOBS.assets], ['build:js', 'clean', 'reload']);
});

gulp.task('build:css', function (callback) {
  runSequence('build:flags', 'scss', 'concat:css', callback);
});

gulp.task('clean', function () {
  return del(['build']);
});

gulp.task('build:js', function (callback) {
  runSequence('inline-templates', 'browserify', callback);
});

gulp.task('build', function (callback) {
  runSequence(['build:css', 'inline-templates', 'wiredep'], 'browserify', 'clean', callback);
});

gulp.task('default', ['connect', 'watch']);

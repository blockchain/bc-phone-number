'use strict';

var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache');
var runSequence   = require('run-sequence');
var minifyCss     = require('gulp-minify-css');
var changed       = require('gulp-changed');
var connect       = require('gulp-connect');
var concat        = require('gulp-concat');
var rename        = require('gulp-rename');
var uglify        = require('gulp-uglify');
var jscs          = require('gulp-jscs');

var childProcess = require('child_process');
var wiredep      = require('wiredep').stream;
var merge        = require('merge-stream');
var del          = require('del');

var GLOBS = {
  assets: '{demo/index.html,src/*.{html,css,js}}'
};

function execute(command, callback) {
  childProcess.exec(command, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
}

function executeTask(command) {
  return function(callback) {
    execute(command, callback);
  };
}

gulp.task('browserify', executeTask('grunt browserify'));

gulp.task('deploy', executeTask('sh demo/gh-pages.sh'));

gulp.task('test', executeTask('grunt karma:unit'));

gulp.task('server:connect', function() {
  connect.server({
    livereload: true,
    fallback: 'demo/index.html',
    host: 'localhost',
    port: 8080,
    root: ['demo/', '.']
  });
});

gulp.task('server:reload', function() {
  return gulp.src(GLOBS.assets)
    .pipe(changed(GLOBS.assets))
    .pipe(connect.reload());
});

gulp.task('refresh', function(callback) {
  runSequence('build', 'server:reload', callback);
});

gulp.task('lint', function() {
  return gulp.src('{src/*.js,test/*.js,*.js}')
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('build:css', function() {
  return gulp.src('src/bc-phone-number.css')
    .pipe(gulp.dest('dist/css/'))
    .pipe(minifyCss())
    .pipe(rename('bc-phone-number.min.css'))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('uglify', function() {
  return gulp.src('dist/js/bc-phone-number.js')
    .pipe(uglify())
    .pipe(rename('bc-phone-number.min.js'))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('wiredep', function() {
  var index = gulp.src('demo/index.html')
    .pipe(wiredep({ignorePath: '../'}))
    .pipe(gulp.dest('demo/'));

  var test = gulp.src('test/karma.conf.js')
    .pipe(wiredep({devDependencies: true}))
    .pipe(gulp.dest('test/'));

  return merge(index, test);
});

gulp.task('inline-templates', function() {
  return gulp.src('src/*.html')
    .pipe(templateCache({
      standalone: true,
      module: 'bcPhoneNumberTemplates',
      root: 'bc-phone-number'
    }))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('watch', function() {
  gulp.watch([GLOBS.assets], ['refresh']);
});

gulp.task('clean', function() {
  return del(['build/']);
});

gulp.task('build', function(callback) {
  runSequence(['inline-templates', 'wiredep', 'build:css', 'lint'], 'browserify', 'uglify', 'clean', callback);
});

gulp.task('default', function(callback) {
  runSequence('build', 'server:connect', 'watch', callback);
});

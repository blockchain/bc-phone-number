import gulp from 'gulp';
import sequence from 'gulp-sequence';
import changed from 'gulp-changed';
import connect from 'gulp-connect';
import jscs from 'gulp-jscs';
import childProcess from 'child_process';
import webpackStream from 'webpack-stream';
import del from 'del';
import webpackConfig from './webpack.config.js';
import webpack from 'webpack';
import {Server} from 'karma';
import WebpackDevServer from 'webpack-dev-server';
import gutil from 'gutil';

let GLOBS = {
  assets: '{demo/index.html,src/*.{html,css,js}}'
};

function execute(command, callback) {
  childProcess.exec(command, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
}

function executeTask(command) {
  return callback => execute(command, callback);
}

gulp.task('webpack', () =>
  gulp.src('src/bc-phone-number.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('.'))
);

gulp.task('deploy', executeTask('sh demo/gh-pages.sh'));

gulp.task('test', (done) => {
  new Server({configFile: __dirname + '/test/karma.conf.js'}, (exitCode) => {
    done();
    process.exit(exitCode);
  }).start();
});

gulp.task('test:debug', (done) => {
  new Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: false,
    browsers: ['Chrome']
  }, (exitCode) => {
    done();
    process.exit(exitCode);
  }).start();
});

gulp.task('serve:demo', () => {
  connect.server({
    livereload: true,
    fallback: 'demo/index.html',
    host: 'localhost',
    port: 8080,
    root: ['demo/', '.']
  });
});

gulp.task('serve:demo-requirejs', () => {
  connect.server({
    livereload: true,
    fallback: 'demo-requirejs/index.html',
    host: 'localhost',
    port: 8080,
    root: ['demo-requirejs/', '.']
  });
});

gulp.task('serve:demo-webpack', () => {
  let demoConfig = Object.create(webpackConfig);
  demoConfig.entry = {app: ['webpack-dev-server/client?http://localhost:8080/', './demo-webpack/demo.js']};
  demoConfig.output = {filename: 'demo.bundle.js'};
  demoConfig.externals = undefined;

  new WebpackDevServer(webpack(demoConfig), {
    contentBase: 'demo-webpack/',
    stats: {
      colors: true
    }
  }).listen(8080, 'localhost', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/index.html');
  });
});

gulp.task('server:reload', () =>
  gulp.src(GLOBS.assets)
    .pipe(changed(GLOBS.assets))
    .pipe(connect.reload()));

gulp.task('refresh', sequence('build', 'server:reload'));

gulp.task('lint', () =>
  gulp.src('{src/*.js,test/*.js,*.js}')
    .pipe(jscs())
    .pipe(jscs.reporter()));

gulp.task('uglify', () => {
  let webpackConfigMin = Object.create(webpackConfig);
  webpackConfigMin.plugins = [
    new webpack.optimize.UglifyJsPlugin({sourceMap: true})
  ];
  webpackConfigMin.output.filename = 'dist/bc-phone-number.min.js';

  return gulp.src('src.js')
    .pipe(webpackStream(webpackConfigMin, webpack))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', () => {
  gulp.watch([GLOBS.assets], ['refresh']);
});

gulp.task('clean', () => del('dist'));

gulp.task('build', sequence('clean', 'lint', 'webpack', 'uglify'));

gulp.task('default', sequence('build', 'serve:demo', 'watch'));

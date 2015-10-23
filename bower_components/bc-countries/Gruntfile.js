'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['bower.json', 'package.json'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['bower.json', 'package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin'
      }
    },
    browserify: {
      dist: {
        files: {'dist/bc-countries.js': ['src.js']},
        options: {
          browserifyOptions: {bundleExternal: false, standalone: 'bcCountries'}
        }
      }
    },
    uglify: {
      main: {
        files: {'dist/bc-countries.min.js': 'dist/bc-countries.js'}
      }
    },
    karma: {
      options: {configFile: 'karma.conf.js'},
      unit: {
        browsers: ['PhantomJS']
      },
      e2e: {
        browsers: ['Chrome']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('build', ['browserify', 'uglify']);
  grunt.registerTask('test', 'karma:unit');

  grunt.registerTask('default', ['browserify', 'uglify', 'test']);
};

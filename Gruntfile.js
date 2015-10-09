'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {'dist/js/bc-phone-number.js': ['src/js/bc-phone-number.js']},
        options: {
          browserifyOptions: {bundleExternal: false}
        }
      }
    },
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
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-bump');
};

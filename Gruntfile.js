'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {'dist/js/bc-phone-number.js': ['src/bc-phone-number.js']},
        options: {
          browserifyOptions: {bundleExternal: false, standalone: 'bcPhoneNumber'}
        }
      }
    },
    karma: {
      options: {configFile: 'test/karma.conf.js'},
      unit: {
        browsers: ['PhantomJS']
      },
      e2e: {
        browsers: ['Chrome']
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
    },
    git_changelog: {
      default: {
        options: {
          file: 'Changelog.md',
          grep_commits: '^fix|^feat|^docs|^style|^refactor|^chore|^test|BREAKING',
          repo_url: 'https://github.com/blockchain/bc-phone-number',
          branch_name: 'master'
        }
      }
    }



  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('git-changelog');
};

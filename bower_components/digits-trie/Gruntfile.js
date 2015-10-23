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
    mochaTest: {
      options: {reporter: 'landing'},
      test: {
        src: ['test.js']
      }
    },
    copy: {
      main: {
        src: ['src.js'],
        dest: 'dist/digits-trie.js'
      }
    },
    uglify: {
      main: {
        files: {'dist/digits-trie.min.js': 'dist/digits-trie.js'}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('build', ['copy', 'uglify']);
  grunt.registerTask('test', 'mochaTest');

  grunt.registerTask('default', ['build', 'test']);
};

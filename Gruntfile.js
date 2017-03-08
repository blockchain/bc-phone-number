'use strict';

module.exports = grunt => {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'git_changelog': {
      default: {
        options: {
          file: 'Changelog.md',
          'grep_commits': '^fix|^feat|^docs|^style|^refactor|^chore|^test|BREAKING',
          'repo_url': 'https://github.com/blockchain/bc-phone-number',
          'branch_name': 'master'
        }
      }
    }
  });

  grunt.loadNpmTasks('git-changelog');
};

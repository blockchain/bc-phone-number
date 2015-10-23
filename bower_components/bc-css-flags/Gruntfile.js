'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    responsive_images: {
      retina: {
        options: {
          engine: 'im',
          sizes: [{
            width: 40,
            height: 30
          }],
          rename: false
        },
        files: [{
          expand: true,
          cwd: 'lib/region-flags/png/',
          src: ['*.png'],
          dest: 'build/img/flags/@2x/'
        }]
      }
    },
    exec: {
      evenizer: {
        command: 'evenizer --resize -i build/img/flags/@2x/*.png'
      }
    },
    retinafy: {
      options: {
        sizes: {
          '50%': {
            suffix: ''
          },
          '100%': {
            suffix: '@2x'
          }
        }
      },
      files: {
        expand: true,
        cwd: 'build/img/flags/@2x/',
        src: ['*.png'],
        dest: 'build/img/flags/'
      }
    },
    sprite: {
      retina: {
          src: 'build/img/flags/*@2x.png',
          dest: 'dist/img/flags@2x.png',
          destCss: 'build/css/sprite@2x.scss',
          cssTemplate: function() { return ''; },
          padding: 4,
          algorithm: 'left-right',
          algorithmOpts: {
            sort: false
          },
          cssOpts: {
            variableNameTransforms: ['toLowerCase']
          }
      },
      main: {
        src: ['build/img/flags/*.png', '!<%= sprite.retina.src %>'],
        dest: 'dist/img/flags.png',
        cssTemplate: 'src/sprite-retina-mustache.scss',
        destCss: 'build/css/sprite.scss',
        padding: 2, // this is currently just for chrome, otherwise flags seem to leak into each other
        algorithm: 'left-right',
        algorithmOpts: {
          sort: false
        },
        cssOpts: {
          variableNameTransforms: ['toLowerCase']
        }
      }
    },
    concat: {
      sass: {
        src: ['src/main.scss', 'build/css/sprite.scss'],
        dest: 'dist/css/bc-css-flags.scss'
      }
    },
    sass: {
      options: {sourcemap: 'none' },
      compressed: {
        options: {style: 'compressed'},
        files: {'dist/css/bc-css-flags.min.css': 'dist/css/bc-css-flags.scss'}
      },
      dist: {
        options: {style: 'expanded'},
        files: {'dist/css/bc-css-flags.css': 'dist/css/bc-css-flags.scss'}
      }
    },
    clean: ['build/'],
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

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-retinafy');
  grunt.loadNpmTasks('grunt-exec');

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('build', ['responsive_images', 'exec', 'retinafy', 'sprite', 'concat', 'sass', 'clean']);
  grunt.registerTask('default', ['build']);
};

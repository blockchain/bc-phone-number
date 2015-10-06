'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    responsive_images: {
      retina: {
        options: {
          engine: "im",
          sizes: [{
            width: 40,
            height: 30
          }],
          rename: false
        },
        files: [{
          expand: true,
          cwd: "lib/region-flags/png/",
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
          dest: 'build/img/flags@2x.png',
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
        dest: 'build/img/flags.png',
        cssTemplate: 'src/css/sprite-retina-mustache.scss',
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
    }
  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-retinafy');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('build', ['responsive_images', 'exec', 'retinafy', 'sprite']);
  grunt.registerTask('default', ['build']);
};

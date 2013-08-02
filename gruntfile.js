'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.initConfig({
    karma: {
      options: {
        configFile: 'test/karma.conf.js',
        browsers: ['Chrome']
      },
      continuous: {
        singleRun: true
      },
      dev: {
        reporters: 'dots'
      }
    },
    requirejs: {
      main: {
        options: {
          baseUrl: ".",
          include: ['components/almond'],
          mainConfigFile: 'components/require-config.js',
          name: 'backbone-mongo',
          optimize: "uglify2",
          preserveLicenseComments: false,
          out: "build/backbone-mongo.js",
          wrap: {
            startFile: 'build/start.frag',
            endFile: 'build/end.frag'
          }
        }
      }
    }
  });

  grunt.registerTask('test', ['karma:dev']);
  grunt.registerTask('test once', ['karma:continuous']);
  grunt.registerTask('build', ['requirejs:main']);
};

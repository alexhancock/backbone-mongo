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
          include: ['backbone-mongo'],
          mainConfigFile: "components/require-config.js",
          name: "backbone-mongo",
          optimize: "uglify2",
          preserveLicenseComments: false,
          out: "build/backbone-mongo.js"
        }
      },
      solo: {
        options: {
          baseUrl: ".",
          include: ['backbone-mongo-solo'],
          mainConfigFile: "components/require-config.js",
          name: "backbone-mongo-solo",
          optimize: "uglify2",
          preserveLicenseComments: false,
          out: "build/backbone-mongo-solo.js"
        }
      }
    }
  });

  grunt.registerTask('test', ['karma:dev']);
  grunt.registerTask('test once', ['karma:continuous']);
  grunt.registerTask('build', ['requirejs:main', 'requirejs:solo']);
};

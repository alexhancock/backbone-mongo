'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-karma');

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
    }
  });

  grunt.registerTask('test', ['karma:dev']);
  grunt.registerTask('test once', ['karma:continuous']);
};
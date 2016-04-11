// Generated on 2014-10-22 using generator-angular 0.9.5
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  grunt.loadNpmTasks('grunt-webtranslateit');


  // Define the configuration for all the tasks
  grunt.initConfig({
    webtranslateit: {
      options: {
        projectToken: 'webtranslateit_public_key',
        langs: ['es']
      },
      local: {
        dest: 'www/json/lang'
      }
    }
  });


  grunt.registerTask('locales', 'webtranslateit task alias', ['webtranslateit']);

};

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      dustjs: {
        compile: {
          files: {
            "libs/js/templates.js": ["templates/**/*.dust"]
          },
        }
      },

      watch: {
        scripts: {
          files: ['templates/**/*.dust'],
          tasks: ['dustjs']
        }
      }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-dustjs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['dustjs', 'watch']);

};
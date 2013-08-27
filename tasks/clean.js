
module.exports = function(grunt) {

  /*
   *
   * Task: clean
   * Description: Clear files and folders.
   * Dependencies: rimraf
   * Contributor(s): @tbranyen / @tkellen
   *
   * https://github.com/gruntjs/grunt-contrib/blob/master/tasks/clean.js
   */
  grunt.registerTask("clean",
    "Clear files and folders", function() {

    var files = grunt.config("clean");

    files.forEach(function(file) {
      grunt.helper("clean", file);
    });

    return grunt.errors ? false : true;
  });

  grunt.registerHelper("clean", function(path) {
    grunt.log.writeln("Removing: " + path);
    require("rimraf").sync(path);
  });

};


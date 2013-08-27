/*
  This may be only useful for dynamically loaded javascript. It adds
  a comment to the end of each file containing an @sourceURL annotation.
  This allows dynamically loaded (and `eval`ed) code to be given a name
  for debugging purposes. This also allows breakpoints to be set.

  Note that the current minification task strips these comments away.
  TODO: Leave @sourceURL during minification

  See :
  http://pmuellr.blogspot.com/2009/06/debugger-friendly.html
  http://blog.getfirebug.com/2009/08/11/give-your-eval-a-name-with-sourceurl/
  http://code.google.com/chrome/devtools/docs/scripts-breakpoints.html#js_dynamic
  
  Browserify uses sourceURL:
  https://github.com/substack/node-browserify

*/

module.exports = function(grunt) {
  // Grunt utilities.
  var task = grunt.task;
  var file = grunt.file;
  var utils = grunt.utils;
  var log = grunt.log;
  var verbose = grunt.verbose;
  var fail = grunt.fail;
  var option = grunt.option;
  var config = grunt.config;
  var template = grunt.template;

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('concatSourceURL', 'Concatenate files with sourceURL.', function() {
  // grunt.registerMultiTask('concat', 'Concatenate files.', function() {
    var files = file.expandFiles(this.file.src);
    // Concat specified files.
    var src = grunt.helper('concatSourceURL', files);
    // var src = grunt.helper('concat', files, {separator: this.data.separator});
    file.write(this.file.dest, src);

    // Fail task if errors were logged.
    if (this.errorCount) { return false; }

    // Otherwise, print a success message.
    log.writeln('File "' + this.file.dest + '" created.');
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  // Concat source files and/or directives.
  grunt.registerHelper('concatSourceURL', function(files, options) {
    options = utils._.defaults(options || {}, {
      separator: utils.linefeed
    });
    return files ? files.map(function(filepath) {
      var out = task.directive(filepath, file.read);
      var parts = task.getDirectiveParts(filepath);
      if (parts && parts[0] !== 'banner') {
        out += '//@ sourceURL='+task.getDirectiveParts(filepath)[1];
      }
      return out;
    }).join(utils.normalizelf(options.separator)) : '';
  });

};


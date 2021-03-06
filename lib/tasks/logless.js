/**
 * Grunt Task File
 * ---------------
 *
 * Task: logless
 * Description: Parses JavaScript files and removes logging statements
 *
 * Usage:
 *  
 *  logless: {
 *    task: {
 *      src: ['file1.js', 'file2.js', 'other/stuff/\*.js'],
 *      dest: 'path/to/destination',
 *      names: ['console', 'alert'],
 *      strip: 'path/to/remove',
 *      options: {beautify: true}
 *    }
 *  }
 *
 * Note that the example above has escaped the * in the file path. This 
 * was necessary to pass the jshint lint checker, as it was complaining of
 * nested comments. And issue has been raised:
 * https://github.com/jshint/jshint/issues/540
 *
 */

var path = require('path');
var logless = require('logless');

module.exports = function(grunt) {
  grunt.registerMultiTask('logless',
    'Parses JavaScript files and removes logging statements', function() {
      var data = this.data;
      var files = grunt.file.expandFiles( data.src );
      var strip = this.data.strip;

      if ( typeof strip === "string" ) {
        strip = new RegExp( "^" + grunt.template.process( strip, grunt.config() ).replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ) );
      }

      files.forEach(function(src) {
        try {
          var parsed = logless.parse(grunt.file.read(src), data.names, data.options);
          var target = path.join(data.dest,strip ? src.replace( strip, "" ) : src);
          grunt.file.write(target, parsed);
          grunt.log.writeln('File "' + src + '" parsed -> "' + target + '"');
        } catch (err) {
          grunt.log.error(src + '\n' + err.stack);
        }
      });
      grunt.log.writeln( "Processed " + files.length + " files." );

      if (this.errorCount) {return false;}
    }
  );
};

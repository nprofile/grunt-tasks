var fs = require('fs'),
    path = require('path');

module.exports = function(grunt) {

  /*
   *
   * Task: md5
   * Description: Create list of md5 hashes for CDN uploads.
   * Dependencies: crypto
   *
   * From jquery-ui grunt.js:
   * https://github.com/jquery/jquery-ui/blob/master/grunt.js  
   */
  grunt.registerMultiTask( "md5", "Create list of md5 hashes for CDN uploads", function() {
    // remove dest file before creating it, to make sure itself is not included
    if ( path.existsSync( this.file.dest ) ) {
      fs.unlinkSync( this.file.dest );
    }
    var crypto = require( "crypto" ),
      dir = this.file.src + "/",
      hashes = [];
    grunt.file.expandFiles( dir + "**/*" ).forEach(function( fileName ) {
      var hash = crypto.createHash( "md5" );
      hash.update( grunt.file.read( fileName, "ascii" ) );
      hashes.push( fileName.replace( dir, "" ) + " " + hash.digest( "hex" ) );
    });
    grunt.file.write( this.file.dest, hashes.join( "\n" ) + "\n" );
    grunt.log.writeln( "Wrote " + this.file.dest + " with " + hashes.length + " hashes" );
  });

};


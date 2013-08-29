module.exports = function(grunt) {

  /*
   *
   * Task: zip
   * Description: Create a zip file for release.
   * Dependencies: adm-zip
   *
   * From jquery-ui grunt.js:
   * https://github.com/jquery/jquery-ui/blob/master/grunt.js  
   */
  grunt.registerMultiTask( "zip", "Create a zip file for release", function() {
    // TODO switch back to adm-zip for better cross-platform compability once it actually works
    // 0.1.3 works, but result can't be unzipped
    // its also a lot slower then zip program, probably due to how its used...
    // var files = grunt.file.expandFiles( "dist/" + this.file.src + "/**/*" );
    // grunt.log.writeln( "Creating zip file " + this.file.dest );

    //var AdmZip = require( "adm-zip" );
    //var zip = new AdmZip();
    //files.forEach(function( file ) {
    //  grunt.verbose.writeln( "Zipping " + file );
    //  // rewrite file names from dist folder (created by build), drop the /dist part
    //  zip.addFile(file.replace(/^dist/, "" ), fs.readFileSync( file ) );
    //});
    //zip.writeZip( "dist/" + this.file.dest );
    //grunt.log.writeln( "Wrote " + files.length + " files to " + this.file.dest );

    var done = this.async(),
      dest = this.file.dest,
      src = grunt.template.process( this.file.src, grunt.config() );
    grunt.utils.spawn({
      cmd: "zip",
      args: [ "-r", dest, src ],
      opts: {
        cwd: 'dist'
      }
    }, function( err, result ) {
      if ( err ) {
        grunt.log.error( err );
        done();
        return;
      }
      grunt.log.writeln( "Zipped " + dest );
      done();
    });
  });
};


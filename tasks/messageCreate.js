/**
 * Custom module
 */
module.exports = function (grunt) {
  "use strict";
  var _     = require("underscore");
  var fs    = require('fs');
  var path  = require('path');
  var task  = grunt.task;
  var process   = grunt.template.process;

  // Utils
  var asyncUtil = grunt.utils.async;
  var fileUtil  = grunt.file;

  // Custom Utils
  var LogUtil   = require(__dirname+'/utils/log');

  // Extractions from Utils
  var log = LogUtil.log;

  /**
   * Currently there is logic "baked" into the Parser 'createErrorMessages' task that involves writing a concatenated
   *    version of all the files generated.
   * Additionally, this method takes the locales and ensures that each has the fallback locale content where appropriate.
   *
   * @param list
   * @param namespace
   */
  var writeConcatLocaleMessages = function ( list, namespace, directory, done ) {
    var head = "!function( exports ){ \n";
    var foot = "}(nike.ns('"+namespace+"'));";

    // Blended List to include default values from en_US
    var blendedList = {};
    _.each(list, function(item, key) {
      if(key !== 'en_US'){
        blendedList[key] = _.extend({},list['en_US'],list['en_GB'],item); //US trumped by GB trumped by locale specific
      }else{
        blendedList[key] = _.extend({},list['en_US']);
      }
    });

    // The content between the head and foot
    var src = "exports.errors="+JSON.stringify(blendedList,null,2)+"\n";

    //
    fileUtil.write(directory+'messages.js',head+src+foot);

    // Thanks we're all done
    done();
  };

  /**
   * Will generate JSON-ified versions of a the Error Message files that are key-value files.
   * Additionally, this will now generate a single Javascript file specific to CPC purposes.
   * Usage:
   *    grunt createErrorMessages:/Users/JBAI11/Development/profile-web/git/profile-web/src/main/resources/messages
   */
  grunt.registerTask('createErrorMessages', 'Generate Error Messages for usage with Behavior Tests', function ( srcFolder ) {
    // Configuration Related variables
    var DEST_DIR  = process('<%= pkg.directories.test %>')+'/test/jasmine/messages/errors/';
    var NAMESPACE = 'nike.profile.test.integration.messages';

    // Simply a way to say "we're done with everything, thank you"
    var done  = this.async();

    // Expand files from folder
    var files = fileUtil.expandFiles(srcFolder+'/*.*');

    // Need a variable outside of iteration to set the bundled JSON-ified locales into
    var localizedList = {};

    // Asynchronously run unbundle on each file.
    asyncUtil.forEachSeries(

      // List of files to process.
      files,

      // Iterate on each file.
      function(filepath, oneFileDone) {
        // Setup a variable that will become the basically the JSONified version of the key-value file originally provided
        var json  = {};

        // Obtain the filename
        var fileparts = filepath.split('/');
        var filename  = fileparts[fileparts.length-1];

        // Obtain locale
        var localeExp     = /messages_(.*)\.properties/i;
        var localeMatches = filename.match(localeExp);
        var locale = _.isArray(localeMatches) && localeMatches.length > 1 ? localeMatches[1] : null;

        // Obtain file data as string
        var fileData = task.directive(filepath, fileUtil.read);
        var fileString = fileData.toString();
        // Since the file is a key value pair list separated by newlines for each entry, let's split it out
        var array = fileString.split('\n');

        // Iterate key-values and add to the JSONified version
        _.each(array,function ( item ) {
          // We need to find the key and the value
          var sides   = item.split('=');
          var key     = sides.shift().trim();

          // If the key is blank then there is no need to add
          if(key.length){
            // Add to JSON and ensure the key is lower case
            json[key.toLowerCase().trim()] = sides.join('=').trim();
          }
        });

        // Baked logic used for concatenating the locales into one file
        // Only store the result if the locale is obtained.
        //    For some reason, there is a file that does not have an associated locale to it. This file is NOT the default.
        if( locale ){
          // Push in the locale and generated JSON
          localizedList[locale] = json;
        }

        // Write to a New File
        fileUtil.write(DEST_DIR+filename+'.json',JSON.stringify(json,null,2));

        // Yep, this ones done
        oneFileDone();
      },
      // All source files processed.
      function() {
        // This will handle the done after writing the concatenated file
        writeConcatLocaleMessages(localizedList, NAMESPACE, DEST_DIR, done);
      }
    );
  });
};

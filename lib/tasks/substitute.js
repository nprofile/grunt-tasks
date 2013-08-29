/*
 * Grunt Task File
 * ---------------
 *
 * Task: substitute
 * Description: Replace strings (ex. environmental) in files
 * Example config:
 * {
 *    ...,
 *
 *    substitute: {
 *      // REQUIRED: Substitution map.
 *      map: {
 *        hostPrefix: 'ecn23',
 *        mode: 'int'
 *      },
 *  
 *      // REQUIRED: Files modified in-place.
 *      files: [
 *        'target/html/oauth/login.html',
 *        'target/html/oauth/debug.html',
 *        ...
 *      ]
 *    },
 *
 *    ...
 * }
 */

/**
 * @description Performs task-specific registration. Called by grunt.js.
 * @param {object} grunt Grunt instance from grunt.js.
 * @function
 */
module.exports.register = function(grunt) {
  // Use the latest installed to node_modules (separate from grunt-contrib's)
  // in order to use the _.template(str, data, settings) signature,
  // avoiding overwriting _.templateSettings.
  var _ = require('underscore');

  // Built-in modules.
  var fs    = require('fs');
  var path  = require('path');

  // Grunt utilities.
  var task  = grunt.task;

  // Utils
  var asyncUtil = grunt.utils.async;
  var fileUtil  = grunt.file;

  grunt.registerMultiTask( 'substitute','Replace strings (ex. environmental) in files',
    function() {
      var done      = this.async();
      var settings  = this.data;

      // The following is lifted from https://github.com/outaTiME/grunt-replace/blob/master/tasks/replace.js
      // 'strings' is a fallback property for any legacy code out there
      var map = settings.map || settings.strings || settings.substitutions;
      // An object to store the iterated processed key-values
      var mapProcessed = {};
      // Process mapping. This allows us to use grunt variables in the config for substitute
      Object.keys(map).forEach(function (variable) {
        var value = map[variable];
        if (typeof value === 'string') {
          mapProcessed[variable] = grunt.template.process(value);
        }
      });

      var files = fileUtil.expandFiles(settings.files);
      // Make sure everything is processed
      files = _.map(files, function ( filepath ){
        return grunt.template.process(filepath);
      });

      // Asynchronously run unbundle on each file.
      asyncUtil.forEachSeries(

        // List of files to process.
        files,

        // Iterate on each file.
        function(filepath, oneFileDone) {
          // Obtain file data as string
          var fileData = task.directive(filepath, fileUtil.read);

          // TODO: Optimize with _.template in the future
          var content = fileData.toString();
          _.each(mapProcessed,function (local,key) {
            content = content.replace(new RegExp(key,"g"),local);
          });

          fileUtil.write(filepath, content);
          oneFileDone();
        },
        // All source files processed.
        function() {
          // Thanks we're all done
          done();
        }
      );
    }
  );

};

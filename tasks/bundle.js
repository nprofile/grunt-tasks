module.exports = function (grunt) {

  "use strict";
  var log = function ( obj ){
    if(_.isObject(obj) || _.isArray(obj)){
      obj = JSON.stringify(obj);
    }
    grunt.log.writeln(obj);
  };

  var _     = require("underscore");
  var fs    = require('fs');
  var path  = require('path');
  var file  = grunt.file;
  var utils = grunt.utils;
  var task  = grunt.task;
  var xml2js  = require('xml2js');
  var process = grunt.template.process;

  var WroUtils = require(__dirname+'/utils/wro4j');

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

  /**
   * Runner Task
   * This is perhaps a misleading task name
   * @usage grunt run:<task>:<arguments> Example: grunt run:demo:nolint:noless
   */
  grunt.registerMultiTask('bundle', '', function( ) {
    var config  = grunt.config.get('bundle');
    var WROFile = process(config._wro);
    var done = this.async();
    var parser = new xml2js.Parser();
    parser.addListener('end', function(result) {
      var keys = WroUtils.getAssetKeys(result);
      _.each(keys,function(key){
        var tokens      = WroUtils.getAssetsByName(result,key);
        var filePaths   = _.map(tokens,function(value){
          return process('<%= pkg.directories.src %>'+value);
        });
        if(tokens.length){
          var dest  = process('<%= pkg.directories.temp %>')+'/bundled/'+key;

          var files = file.expandFiles(filePaths);

          // Concat specified files.
          var src = grunt.helper('concatSourceURL', files);


          file.write(dest+'.min.js', src);
          file.write(dest+'.js', src);

          // Otherwise, print a success message.
          log('File "' + dest + '" created.');
        }
      });
      done();
    });

    fs.readFile(WROFile, function ( err, data ){
      parser.parseString(data);
    });
  });
};

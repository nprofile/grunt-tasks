module.exports = function (grunt) {

  "use strict";
  // Load Modules
  var _     = require("underscore");
  var fs    = require('fs');
  var path  = require('path');
  var xml2js  = require('xml2js');

  // Custom Utils
  var WroUtils  = require(__dirname+'/utils/wro4j');
  var LogUtil   = require(__dirname+'/utils/log');

  // Extractions from Utils
  var log = LogUtil.log;

  // Grunt Util Shortcuts
  var task      = grunt.task;
  var fileUtil  = grunt.file;
  var process   = grunt.template.process;
  var gconfig   = grunt.config;
  var asyncUtil = grunt.utils.async;

  /**
   * Cached regular expressions
   * @type {{}}
   */
  var CachedRegExps = {
    scriptTag: new RegExp('<script src="[\\S]+"><\/script>','g'),
    widgetDependencies: new RegExp('data-deps="[\\S]+"','g')
  };

  /**
   *
   */
  grunt.registerMultiTask('unbundle', '', function( ) {
    // Get the Configurations for WRO4J unbundling in general
    var config  = gconfig.get('unbundle');
    // From the configuration attirbutes, grab the wro4j file location
    var WROFile = process(config._wro);

    //
    var settings = this.data;
    var done = this.async();
    var parser = new xml2js.Parser();

    // Ensure that target is an array
    if(_.isString(settings.target)){
      settings.target = [settings.target]
    }
    settings.target = _.map(settings.target,function(value){
      return process(value);
    });

    parser.addListener('end', function(result) {
      //
      var wroAsJSON = result;

      //
      var combineSettings = {};

      // Asynchronously run unbundle on each file.
      asyncUtil.forEachSeries(

        // List of files to process.
        settings.target,

        // Iterate on each file.
        function(filepath, oneFileDone) {

          var data = task.directive(filepath, fileUtil.read);

          var toUnbundle = [];

          var dataAsString = data.toString();

          //
          var scripts = dataAsString.match(CachedRegExps.scriptTag);
          WroUtils.addKeysToUnbundle(scripts, toUnbundle, WroUtils.getAssetsAsTags );

          //
          var deps = dataAsString.match(CachedRegExps.widgetDependencies);
          WroUtils.addKeysToUnbundle(deps, toUnbundle, WroUtils.getAssetsAsWidgetDeps );

          var tokens = [];
          _.each(toUnbundle,function ( bundle ) {
            var array   = WroUtils.getAssetsByName(wroAsJSON,bundle.key);
            if(array && array.length){
              tokens.push({token:bundle.original,string:bundle.transformer(array,config)});
            }
          });

          var _settings = {
            "input": filepath,
            "output": filepath,
            "tokens": tokens
          };

          if(_settings.tokens.length){
            combineSettings["unbundle"+filepath] = _settings;
          }

          oneFileDone();
        },
        // All source files processed.
        function() {
          if(_.keys(combineSettings).length){
            gconfig.set('combine',combineSettings);
            task.run('combine');
          }
          done();
        }
      );
    });

    // Load WRO4J and Parse
    fs.readFile(WROFile, function(err, data) {
      parser.parseString(data);
    });

  });
};

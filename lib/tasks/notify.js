/*
 * Grunt Task File
 * ---------------
 *
 * Task: watchWithArguments
 * Description:
 */

var path = require('path');

/**
 * @description
 * @param {object} grunt  Grunt instance from register().
 * @param {object} data   Current task target configuration from register().
 * @param {object} utils  Utils to use that are not built-in or under the grunt namespace
 * @function
 */
module.exports.getTask = function(grunt, data, utils) {
  // Built-in modules.
  var _ = grunt.utils._;

  // Registering a single Task (i.e. grunt.registerTask) expects a function.
  /**
   * The first argument is the task name to run and to modify
   */
  return function(title,message,type) {
    var options = {
      title: title || '',
      sticky: false,
      priority: 2
    };
    var image = null;
    switch(type){
      case 'exclamation':
      case 'error':
        image = data.images.error;
        break;

      default:
        image = data.images.success;
        break;
    }
    _.extend(options,{image:image});
    utils.growl(message || '', options);
  };
};

/**
 * @description Performs task-specific registration. Called by grunt.js.
 *     Delegate actual task work to getTask() which contains the task algorithm to execute.
 * @param {object} grunt  Grunt instance from grunt.js.
 * @param {object} data   The data to use for the task. Note this expects a property of taskList which contains the target tasks
 * @param {object} utils  Utils to use that are not built-in or under the grunt namespace
 * @function
 */
module.exports.register = function(grunt,data,utils) {
  data = require('underscore').extend({
    images:{
      error:    path.resolve(__dirname, '../../img/exclamation.png'),
      success:  path.resolve(__dirname, '../../img/checkmark.png')
    }
  },data);

console.log(data);

  // Built-in modules.
  var _ = grunt.utils._;

  /**
   * Listen for Grunt Events
   *
   * Requires installation of growl-node (https://npmjs.org/package/growl | https://github.com/visionmedia/node-growl)
   *
   * @source: based on https://gist.github.com/2880843
   */

  var growl = null;
  try{
    growl = require('growl');
  }catch(e){
    // Ok to move on
  }
  if(growl){
    // Load grunt-growl node module
    grunt.loadNpmTasks('grunt-growl');


    // Set a higher scoped variable for the below closures to encapsulate and reference
    var filepath = '';

    // Growl on Line error messages
    grunt.utils.hooker.hook(grunt.log, 'writeln', function(msg){
      if( msg && grunt.log.uncolor(msg).match(/\[L\w/) ) {
        growl(grunt.log.uncolor(msg), {
          title: filepath,
          image: data.images.error,
          sticky: true,
          priority: 2
        });
      }
    });

    // Listen for when fail is invoked with level 'warn' or 'fatal'
    ['warn', 'fatal'].forEach(function(level) {
      grunt.utils.hooker.hook(grunt.fail, level, function(opt) {
        growl(opt.message, {
          title: opt.name + ' ['+level+']',
          image: data.images.error,
          sticky: true,
          priority: 2
        });
      });
    });

    // Listen for when the watch task completes
    grunt.utils.hooker.hook(grunt.log, 'write', function(msg){
      if( grunt.log.uncolor(msg).match(/Waiting.../) ) {
        grunt.task.run('growl:watching');
      }
    });

    // We will use a file matching pattern to set the 'filepath' variable which is used
    //    when saying in what file the line error occurred
    grunt.utils.hooker.hook(grunt.verbose, 'write', function(msg){
      var match = grunt.log.uncolor(msg).match(/(\w+\/)+\w+.\w+/g);
      if( match && match.length ){
        filepath = match[0];
      }
    });
  }

  // Ensure that the utils object contains the growl package
  utils = _.extend({
   growl: growl
  },utils);

  // Get the task algorithm we want to register
  var taskFunction = module.exports.getTask(grunt, data, utils);

  /**
   * Runner Task
   * This is perhaps a misleading task name
   * @usage grunt notify:<title>:<message> Example: grunt notify:hello:world
   */
  grunt.registerTask('notify', 'Growl a message', taskFunction);
};


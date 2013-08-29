/*
 * Grunt Task File
 * ---------------
 *
 * Task: watchWithArguments
 * Description:
 */

/**
 * @description  Wrapper for 'watch' that provides the ability to modify tasks for an existing task list string
 * @param {object} grunt  Grunt instance from register().
 * @param {object} data   Current task target configuration from register().
 * @param {object} utils  Utils to use that are not built-in or under the grunt namespace
 * @function
 */
module.exports.getTask = function(grunt, data, utils) {
  // Registering a single Task (i.e. grunt.registerTask) expects a function.
  return function ( ) {
    // Grunt utilities.
    var task = grunt.task;
    var log  = grunt.log;

    // Built-in modules.
    var _ = grunt.utils._;

    // Other Utilities
    var getModifyTasks = utils.getModifyTasks;

    // Grab the watch name desired to execute
    var watchname = _.first(arguments);

    // Default is to have no arguments
    var watchArguments = "";

    // Per request, the initial execution of watch will run the 'run' task if there is a specific task to watch
    if(_.isString(watchname)) {
      watchArguments = ":"+watchname;
      task.run('run:'+watchname);
    }

    // If there were no arguments supplied, just go ahead and run watch without parsing arguments
    if( arguments.length === 1 ){
      task.run('watch1'+watchArguments);
    }
    // Parse arguments
    var watchConfig = grunt.config.get('watch');
    var watchConfigOriginal = _.clone(watchConfig);
    grunt.config.set('watch',watchConfig);
    // Get the modified
    var tasks = getModifyTasks(data.taskList[watchname], _.rest(arguments));
    // Append complete message to task list
    tasks = tasks+' notify:Task-Completed:'+watchname;
    // Override the tasks for the watch name with the modified tasks
    watchConfig[watchname] = _.extend(watchConfig[watchname],{
      'tasks': tasks
    });
    // Set the modified config
    grunt.config.set('watch',watchConfig);
    // Run the watch with the modified config
    task.run('watch1'+watchArguments);
    // Set the original config back. I'm not sure this is necessary
    grunt.config.set('watch',watchConfigOriginal);
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
  // We must rename 'watch' task in order to achieve transparent wrapping of the built-in 'watch'
  grunt.task.renameTask('watch', 'watch1');

  // Get the task algorithm we want to register
  var taskFunction = module.exports.getTask(grunt,data,utils);

  // Register a new 'watch' task
  grunt.registerTask('watch', 'Watch with arguments', taskFunction);
};


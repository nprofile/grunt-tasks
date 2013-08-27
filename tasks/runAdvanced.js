/*
 * Grunt Task File
 * ---------------
 *
 * Task: watchWithArguments
 * Description:
 */

/**
 * @description  Wrapper for 'run' that provides the ability to modify tasks for an existing task list string
 * @param {object} grunt  Grunt instance from register().
 * @param {object} data   Current task target configuration from register().
 * @param {object} utils  Utils to use that are not built-in or under the grunt namespace
 * @function
 */
module.exports.getTask = function(grunt, data, utils) {
  // Registering a single Task (i.e. grunt.registerTask) expects a function.
  /**
   * The first argument is the task name to run and to modify
   */
  return function ( taskname ) {
    // Grunt utilities.
    var task = grunt.task;
    var log  = grunt.log;

    // Built-in modules.
    var _ = grunt.utils._;

    // Other Utilities
    var getModifyTasks = utils.getModifyTasks;

    var tasks = getModifyTasks(data.taskList[taskname], _.rest(arguments));
    // Append complete message to task list
    tasks = tasks+' notify:Task-Completed:'+taskname;
    // Run modified tasks
    grunt.task.run(tasks);
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
  // Get the task algorithm we want to register
  var taskFunction = module.exports.getTask(grunt,data,utils);

  /**
   * Runner Task
   * This is perhaps a misleading task name
   * @usage grunt run:<task>:<arguments> Example: grunt run:demo:nolint:noless
   */
  grunt.registerTask('run', 'Run a task group and remove a portion of the task string', taskFunction);
};


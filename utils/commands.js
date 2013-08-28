var _ = require('underscore');
var grunt = require('grunt');

/**
 * Get a modified tasks string by using commands to modify the tasks
 * Commands:
 *    no<string>  Will use the string after no to remove that string from the tasks
 *
 * @param tasks     string
 * @param commands  array
 * @return {*}
 */
module.exports = function ( tasks, commands ){
  if(_.isString(tasks)){
    // Find if we should bundle or unbundle (unbundling is currently the default)
    var hasBundleCommand = _.filter(commands, function( command ) {
      return command === 'bundle';
    }).length;
    if(hasBundleCommand){
      commands.push('no'+'unbundle');
      commands.push('bundleJS');
    }
    _.each(commands,function(command){
      var reg = new RegExp(command.replace('no','')+'(?:\\w+(\\s+|))?(:\\w+(\\s+|))?','g');
      tasks = (command.indexOf('no') === 0) ? tasks.replace(reg,'') : tasks;
    });
  } else if(_.isArray(tasks)){
    grunt.warn('Currently, only strings are supported for modifying the Task list. We need support for Arrays because future releases of Grunt will require an Array');
  }

  return tasks;
};

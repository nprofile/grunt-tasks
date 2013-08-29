var _ = require('underscore');
var path = require('path');

var tasksDir = path.resolve(__dirname,'lib/tasks');
var tasksModules = require('fs').readdirSync(tasksDir);

module.exports.tasks = {};

// Merge in all tasks
_.each(tasksModules, function(name) {
  if ('.js' !== path.extname(name)) {
    return;
  }

  var taskName = path.basename(name, '.js');
  module.exports.tasks[taskName] = require(path.resolve(tasksDir,taskName));

});

module.exports.utils = require('./lib/utils');

module.exports.config = require('./lib/config');

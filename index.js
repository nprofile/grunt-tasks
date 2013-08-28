var _ = require('underscore');
var path = require('path');

var tasksDir = __dirname + '/tasks';
var tasksModules = require('fs').readdirSync(tasksDir);

module.exports.tasks = {};

// Merge in all tasks
_.each(tasksModules, function(name) {
  if ('.js' !== path.extname(name)) {
    return;
  }

  var taskName = path.basename(name, '.js');
  module.exports.tasks[taskName] = require(tasksDir + '/' + taskName);

});

module.exports.utils = require('./utils');

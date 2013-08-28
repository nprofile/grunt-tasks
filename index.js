var _ = require('underscore');
var path = require('path');

var tasksDir = __dirname + '/tasks'
var tasksModules = require('fs').readdirSync(tasksDir);

module.exports.tasks = {};

// Merge in all tasks
_.each(tasksModules, function(name) {
  if ('.js' !== path.extname(name)) {
    return;
  }

  // Ex. build/config/copy/less.js
  module.exports.tasks = _.extend(
    module.exports.tasks,
    require(tasksDir + '/' + name)
  );
});

module.exports.utils = require('./utils');

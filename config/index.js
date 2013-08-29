var path = require('path');
var _ = require('underscore');
var fs = require('fs');

module.exports = function(configDir) {

  // Placehholder for project config object
  var projectConfig = {};

  // Load the project config modules
  var configModules = fs.readdirSync(configDir);

  // Merge in all project config modules.
  _.each(configModules, function(name) {
    // Make sure file is a javascript file
    if ('.js' !== path.extname(name)) {
      return;
    }

    // Don't include src since it is manually added first
    if ('src.js' === path.basename(name)) {
      return;
    }

    // Merge this config module into projectConfig
    projectConfig = _.extend(
      projectConfig,
      require(path.resolve(configDir, path.basename(name,'.js')))
    );
  });

  return _.extend(
    {},
    // Include the source paths config first so other configs can reference it
    require(path.resolve(configDir,'src')),
    // ... import shared config
    require('./shared'),
    // ... import project config
    projectConfig
  );

};


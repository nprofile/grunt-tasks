var path = require('path');
var _ = require('underscore');
var fs = require('fs');

module.exports = function(configDir) {

  // var localDir = __dirname;

  // var shared = _.extend(
  //   {},
  //   require('./shared'),
  //   require('./exec'),
  //   require('./shell'),
  //   require('./growl'),
  //   require('./jshint')
  // });

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


    // // Include the source paths config first so other configs can reference it
    // require(path.resolve(configDir,'src'),

    // // ... import shared config
    // require(path.resolve(__dirname,'exec'),
    // require(path.resolve(__dirname,'shell'),
    // require(path.resolve(__dirname,'growl'),
    // require(path.resolve(__dirname,'jshint'),

    // // ... import project config
    // require(path.resolve(configDir,'templatize'),
    // require(path.resolve(configDir,'concat'),
    // require(path.resolve(configDir,'concatSourceURL'),
    // require(path.resolve(configDir,'min'),
    // require(path.resolve(configDir,'logless'),
    // require(path.resolve(configDir,'qunit'),
    // require(path.resolve(configDir,'lint'),
    // require(path.resolve(configDir,'copy'),
    // require(path.resolve(configDir,'watch'),
    // require(path.resolve(configDir,'less'),
    // require(path.resolve(configDir,'substitute'),
    // require(path.resolve(configDir,'recess'),
    // require(path.resolve(configDir,'unbundle'),
    // require(path.resolve(configDir,'bundle')

};


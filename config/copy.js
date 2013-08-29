var _ = require('underscore');
var path = require('path');

var copyDir = __dirname + '/copy';
var copyModules = require('fs').readdirSync(copyDir);

module.exports.copy = {};

  // Merge in all copy target configs stored as modules.
  _.each(copyModules, function(name) {
  if ('.js' !== path.extname(name)) {
    return;
  }

  // Ex. build/config/copy/less.js
  module.exports.copy = _.extend(
    module.exports.copy,
    require(copyDir + '/' + name)
  );
});

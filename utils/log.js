var _ = require('underscore');
var grunt = require('grunt');

/**
 * Log
 * @param obj
 */
module.exports = function ( obj ){
  if(_.isObject(obj) || _.isArray(obj)){
    obj = JSON.stringify(obj);
  }
  grunt.log.writeln(obj);
};

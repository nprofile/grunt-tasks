var _     = require("underscore");
var grunt = require("grunt");

/**
 * Utils related to logging content
 */
_.extend(module.exports,
  {
    log: function ( obj ){
      if(_.isObject(obj) || _.isArray(obj)){
        obj = JSON.stringify(obj, null, 2);
      }
      grunt.log.writeln(obj);
    }
  }
);
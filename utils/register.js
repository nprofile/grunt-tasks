var _ = require('underscore');
var grunt = require('grunt');

module.exports = function ( taskMap ){
  // Register TaskMap
  _.each(taskMap,function(value,key){
    grunt.registerTask(key,value);
  });
};

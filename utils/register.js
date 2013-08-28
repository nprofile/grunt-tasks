var _ = require('underscore');

module.exports = function (grunt, taskMap ){
  // Register TaskMap
  _.each(taskMap,function(value,key){
    grunt.registerTask(key,value);
  });
};

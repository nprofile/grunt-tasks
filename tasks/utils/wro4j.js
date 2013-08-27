var _     = require("underscore");

/**
 * Utils related to parsing and extracting elements from the WRO4J file
 */
_.extend(module.exports,
  {
    getGroupByName: function ( list, name ) {
      var group = _.find(list.groups.group,function ( obj ) {
        return obj.$.name === name;
      });
      return group;
    },
    /**
    * Currently, this only gets JS assets
    * @param list
    * @param name
    * @return {Array}
    */
    getAssetsByName: function ( list, name ) {
     var obj = this.getGroupByName(list, name);
     var assets = [];
     if(obj){
       var references = obj['group-ref'];
       if( references ){
         _.each(references,function( groupName ) {
           var o = this.getGroupByName(list,groupName);
           if(o['group-ref']){
             _.each(o['group-ref'],function(gn){
               assets = assets.concat(this.getAssetsByName(list,gn));
             },this);
           }
           assets = assets.concat(o.js);
         },this);
         assets = _.flatten(assets);
         assets = _.reject(assets,function( value ){
           return _.isEmpty(value);
         });
       }

       if(obj.js){
         assets = assets.concat(obj.js);
       }
     }
     return assets;
    },

    /**
    * Transform list of assets
    * @param list
    * @param config
    * @return {String}
    */
    getAssetsAsTags: function ( list, config ) {
     return _.map(list,function(item){
       return '<script src="'+config._domain+'/profile/assets'+item+'"></script>';
     },this).join('\n');
    },

    getAssetsAsWidgetDeps: function( list, config ) {
     var array =  _.map(list,function(item){
       return config._domain+'/profile/assets'+item;
     });
     return 'data-deps="'+array.join(',')+'"';
    },

    /**
    * Get a Wro4J key from a string
    * @param string    The file path
    * @return If a match for the key is found, then it will return the key as a String otherwise the return is null
    */
    getKeyFromFilePath: function ( string ){
     var str = null;
     var ss = new RegExp('\/[\\S]+.min');
     var matches = string.match(ss);
     if(matches && matches.length){
       str = matches[0];
       var arr = str.split('/');
       str = arr[arr.length-1];
       str = str.replace('.min','');
     }
     return str;
    },

    addKeysToUnbundle: function( keys, unbundleInstance, transformer ){
     _.each(keys,function(string){
       var key = this.getKeyFromFilePath(string);
       if(key){
         unbundleInstance.push({key:key, original:string, transformer:transformer});
       }
     },this);
    },

    getAssetKeys: function ( result ) {
      return _.map(result.groups.group,function ( obj ) {
        return obj.$.name;
      });
    }
  }
);
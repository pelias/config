
var extend = require('extend');

var Config = function( val ){
  if( 'string' == typeof val ){
    this.replaceFromPath( val );
  }
  else if( 'object' == typeof val ){
    this.replace( val );
  }
}

// deep merge config
Config.prototype.deepMerge = function( data ){
  extend( true, this, data );
}

// deep merge config from path
Config.prototype.deepMergeFromPath = function( path ){
  var config = this._requirePath( path );
  this.deepMerge( config );
}

// shallow merge config
Config.prototype.shallowMerge = function( data ){
  for( var attr in data ){
    if( data.hasOwnProperty( attr ) ){
      this[ attr ] = data[ attr ];
    }
  }
}

// shallow merge config
Config.prototype.shallowMergeFromPath = function( path ){
  var config = this._requirePath( path );
  this.shallowMerge( config );
}

// clear and replace config
Config.prototype.replace = function( data ){
  this.clear();
  this.shallowMerge( data );
}

// replace config from path
Config.prototype.replaceFromPath = function( path ){
  var config = this._requirePath( path );
  this.replace( config );
}

// clear all settings from this instance
Config.prototype.clear = function(){
  for( var attr in this ){
    if( this.hasOwnProperty( attr ) ){
      delete this[ attr ];
    }
  }
}

// open a js/json file using require()
Config.prototype._requirePath = function( path ){
  try {
    var config = require( path );
    if( 'object' !== typeof config ){
      throw new Error( 'invalid config file at:' + path );
    }
    return config;
  }
  catch( e ){
    throw new Error( 'failed to merge config from path:' + path );
  }
}

// strip out all functions etc and produce a copy
Config.prototype.export = function(){
  try {
    return JSON.parse( JSON.stringify( this ) );
  }
  catch( e ){
    throw new Error( 'failed to export config: ' + e.message );
  }
}

// return pretty formatting for easy reading
Config.prototype.pretty = function(){
  return JSON.stringify( this.export(), null, 2 );
}

module.exports = Config;
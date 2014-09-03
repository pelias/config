
var fs = require('fs'),
    Mergeable = require('mergeable'),
    defaults = new Mergeable( __dirname + '/config/defaults.json' ),
    localpath;

// allow the ops guys to override settings on the server
var generate = function( deep ){

  // load config from ENV
  if( process.env.hasOwnProperty('PELIAS_CONFIG') ){
    var production = new Mergeable( defaults.export() );
    var path = process.env['PELIAS_CONFIG'];
    if( true === deep ){ production.deepMergeFromPath( path ); }
    else { production.shallowMergeFromPath( path ); }
    return production;
  }

  // load config from local file
  else if( fs.existsSync( localpath ) ){
    var local = new Mergeable( defaults.export() );
    if( true === deep ){ local.deepMergeFromPath( localpath ); }
    else { local.shallowMergeFromPath( localpath ); }
    return local;
  }
  return defaults;
};

var config = {
  defaults: defaults,
  generate: generate.bind( null, true ),
  setLocalPath: function( path ){
    localpath = path.replace( '~', process.env.HOME );
    return localpath;
  }
};

config.setLocalPath( '~/pelias.json' );
module.exports = config;

var Mergeable = require('mergeable');
var defaults = new Mergeable( __dirname + '/config/defaults.json' );

// allow the ops guys to override settings on the server
var generate = function( deep ){
  if( process.env.hasOwnProperty('PELIAS_CONFIG') ){
    var production = new Mergeable( defaults.export() );
    var path = process.env['PELIAS_CONFIG'];
    if( true === deep ){ production.deepMergeFromPath( path ); }
    else { production.shallowMergeFromPath( path ); }
    return production;
  }
  return defaults;
};

var config = {
  defaults: defaults,
  generate: generate.bind( null, true )
};

module.exports = config;
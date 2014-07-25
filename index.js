
var Config = require('./lib/Config');
var defaults = new Config( __dirname + '/defaults.json' );

// allow the ops guys to override settings on the server
var generate = function(){
  if( process.env['PELIAS_CONFIG'] ){
    var production = new Config( defaults.export() );
    production.shallowMergeFromPath( process.env['PELIAS_CONFIG'] );
    return production;
  }
  return defaults;
}

var config = {
  Config: Config,
  defaults: defaults,
  generate: generate
}

module.exports = config;
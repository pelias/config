
var fs = require('fs'),
    path = require('path'),
    Mergeable = require('mergeable'),
    defaults = new Mergeable( __dirname + '/config/defaults.json' ),
    localpath;
const _ = require('lodash');
const Joi = require('joi');

// allow the ops guys to override settings on the server
var generate = function( schema, deep ){
  // if first parameter is a boolean, then it's deep, not a schema
  if (_.isBoolean(schema)) {
    deep = schema;
    schema = undefined;
  }

  // deep defaults to true
  if (deep === undefined) {
    deep = true;
  }

  const config = getConfig(deep);

  if (_.isObject(schema)) {
    Joi.validate(config, schema, (err) => {
      if (err) {
        throw new Error(err.details[0].message);
      }
    });
  }

  return config;

};

function getConfig(deep) {
  // load config from ENV
  if( process.env.hasOwnProperty('PELIAS_CONFIG') ){
    var production = new Mergeable( defaults.export() );
    var p = path.resolve(process.env.PELIAS_CONFIG);
    if( true === deep ){ production.deepMergeFromPath( p ); }
    else { production.shallowMergeFromPath( p ); }
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

}

var config = {
  defaults: defaults,
  generate: generate,
  setLocalPath: function( p ){
    localpath = p.replace( '~', process.env.HOME );
    return localpath;
  }
};

config.setLocalPath( '~/pelias.json' );
module.exports = config;

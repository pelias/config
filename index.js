const fs = require('fs');
const path = require('path');
const Mergeable = require('mergeable');
const defaults = new Mergeable( __dirname + '/config/defaults.json' );
let localpath;

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
    const result = Joi.validate(config, schema);

    if (result.error) {
      throw new Error(result.error.details[0].message);
    }

    return result.value;

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

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
let localpath;

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

const default_config = require( __dirname + '/config/defaults.json' );

function getConfig(deep) {
  // load config from ENV
  let custom_config;
  if( process.env.hasOwnProperty('PELIAS_CONFIG') ){
    custom_config = require( process.env.PELIAS_CONFIG );
  } else if ( fs.existsSync (localpath) ) {
    custom_config = require( localpath );
  }

  if (deep === true) {
    return _.merge({}, default_config, custom_config);
  } else {
    return _.assign({}, default_config, custom_config);
  }
}

var config = {
  defaults: default_config,
  generate: generate,
  setLocalPath: function( p ){
    localpath = p.replace( '~', process.env.HOME );
    return localpath;
  }
};

config.setLocalPath( '~/pelias.json' );
module.exports = config;

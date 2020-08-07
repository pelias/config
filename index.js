const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const Joi = require('@hapi/joi');

const default_config = require( __dirname + '/config/defaults.json' );
let localpath = process.env.HOME + '/pelias.json'; // default location of pelias.json

// generate the final configuration, taking into account user overrides
// as well as preferences for deep or shallow merges
function generate( schema, deep ){
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
    return getValidatedSchema(config, schema);
  }

  return config;
}

function getValidatedSchema(config, schema) {
  const validationResult = schema.validate(config);

  if (validationResult.error) {
    throw new Error(validationResult.error.details[0].message);
  }

  return addGetFunction(validationResult.value);
}

function generateDefaults() {
  const default_copy = _.merge({}, default_config);

  return addGetFunction(default_copy);
}

function generateCustom(custom_config, deep) {
  let new_config;

  // default to deep if unset
  if (deep === true || deep === undefined) {
    new_config = _.merge({}, generateDefaults(), custom_config);
  } else {
    new_config = _.assign({}, generateDefaults(), custom_config);
  }

  return addGetFunction(new_config);
}

function getConfig(deep) {
  // load config from ENV
  let custom_config;
  if( process.env.hasOwnProperty('PELIAS_CONFIG') ){
    custom_config = require( path.resolve(process.env.PELIAS_CONFIG) );
  } else if ( fs.existsSync (localpath) ) {
    custom_config = require( localpath );
  }

  return generateCustom(custom_config, deep);
}

/*
 * Because it's not enumberable, the get function has to be added every time after
 * cloning an object with _.merge or _.assign
 *
 * see: https://lodash.com/docs/4.17.15#get
 */
function addGetFunction(object) {

  // set 'get' convenience function on returned object
  Object.defineProperty(object, 'get', {
    value: _.get.bind(null, object),
    enumerable: false // allows comparison to `expected.json` in tests
  });

  return object;
}

module.exports = {
  defaults: default_config,
  generate: generate,
  generateCustom: generateCustom,
  generateDefaults: generateDefaults,
  setLocalPath: function( p ){
    localpath = p.replace( '~', process.env.HOME );
    return localpath;
  }
};

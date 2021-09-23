>This repository is part of the [Pelias](https://github.com/pelias/pelias)
>project. Pelias is an open-source, open-data geocoder originally sponsored by
>[Mapzen](https://www.mapzen.com/). Our official user documentation is
>[here](https://github.com/pelias/documentation).

# Pelias Configuration

This repository defines standard configuration for all parts of the Pelias geocoder. It contains tools for Pelias packages to read from configuration in a standardized way, and for Pelias users to set up their own configuration.

[![Greenkeeper badge](https://badges.greenkeeper.io/pelias/config.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/pelias-config.png?downloads=true&stars=true)](https://nodei.co/npm/pelias-config)

## Installation

```bash
$ npm install pelias-config
```

## Usage

Create a new Pelias config:

```javascript
var config = require('pelias-config');

// use the default settings
var settings = config.defaults;
```

#### development settings

```javascript
var config = require('pelias-config');

// generate development specific settings
var settings = config.generate();
```

#### local config

the easiest way to get a custom config is to create a file named `~/pelias.json`.

you can copy the example file from here: https://github.com/pelias/config/blob/master/config/local.json

this file will be checked for settings whenever you run imports and will override the defaults; it is particularly useful for specifying datasource paths during development.

#### production settings

sysadmin and ops engineers can override the default settings on the server by launching any code which requires this module by supplying an ENV var with the path to their custom json config.

```bash
$ PELIAS_CONFIG=/path/to/settings/file.json node app.js
```

Note: by default the merge is deep (it replaces the defaults with any properties that are present in the env config).
The developer can disable deep merging to use only local configuration settings.

```javascript
var config = require('pelias-config');

// shallow merge config settings from a path supplied in the env var
var settings = config.generate( false );

// deep merge config settings from a path supplied in the env var
var settings = config.generate( true );
var settings = config.generate();
```

You can test the result of merging your env config with the following bash oneliner:
```bash
npm install pelias-config; \
PELIAS_CONFIG=/path/config.json \
node -e "console.log( JSON.stringify(require('pelias-config').generate(), null, 2) );";
```

### Validation

Aside from `deep`, the `generate` function takes an additional parameter named `schema` that uses [Joi](https://www.npmjs.com/package/joi) to validate that the configuration is useable.  An error is thrown if the generated configuration does not validate against the schema.

### Exporting & Debugging

The generated config will be a standard Javascript object:

```javascript
var config = require('pelias-config'),
    settings = config.generate();

console.log(JSON.stringify(settings, null, 2));
// {
//    "api": {
//       ...
//    },
//    "imports": {
//      ...
//    }
//  }
```

You can pretty print the generated config with any package you like or with `JSON.stringify`.
Using the third parameter to `JSON.stringify` for indentation may be helpful:

```javascript
var config = require('pelias-config'),
    settings = config.generate();

console.log( JSON.stringify(settings, null, 2) );
```

## NPM Module

The `pelias-config` npm module can be found here:

[https://npmjs.org/package/pelias-config](https://npmjs.org/package/pelias-config)

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` directory.

### Running Unit Tests

```bash
$ npm test
```

### Continuous Integration

CI tests every release against all supported Node.js versions.

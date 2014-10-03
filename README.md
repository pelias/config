## Installation

```bash
$ npm install pelias-config
```

[![NPM](https://nodei.co/npm/pelias-config.png?downloads=true&stars=true)](https://nodei.co/npm/pelias-config)

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

Note: by default the merge is shallow (it simply replaces the defaults with any top-level properties which are present in the env config, leaving the rest unchanged).
The developer can enable deep merging; however that isn't recommended as the env config will have to be modified every time the app config changes.

```javascript
var config = require('pelias-config');

// shallow merge config settings from a path supplied in the env var
var settings = config.generate();

// deep merge config settings from a path supplied in the env var
var settings = config.generate( true );
```

You can test the result of merging your env config with the following bash oneliner:
```bash
npm install pelias-config; \
PELIAS_CONFIG=/path/config.json \
node -e "console.log( require('pelias-config').generate().stringify() );";
```

### Exporting & Debugging

The generated config will be a [mergeable](https://github.com/pelias/mergeable) object:

```javascript
var config = require('pelias-config'),
    settings = config.generate();

// strip out all functions etc and produce a plain js object copy
var copy = settings.export();
```

You can pretty print the generated config:

```javascript
var config = require('pelias-config'),
    settings = config.generate();

console.log( settings.stringify() );
```

see https://github.com/pelias/mergeable for a full list of methods

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

Travis tests every release against node version `0.10`

[![Build Status](https://travis-ci.org/pelias/config.png?branch=master)](https://travis-ci.org/pelias/config)
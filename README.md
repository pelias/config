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

#### production settings

sysadmin and ops engineers can override the default settings on the server by launching any code which requires this module by supplying an ENV var with the path to their custom json config.

```bash
$ PELIAS_CONFIG=/path/to/settings/file.json node app.js
```

Note: by default the merge is shallow (it simply replaces all the top-level properties).
The developer can enable deep merging; however that isn't recommended as env config will have to be modified every time the app config changes.

```javascript
var config = require('pelias-config');

// shallow merge config settings from a path supplied in the env var
var settings = config.generate();

// deep merge config settings from a path supplied in the env var
var settings = config.generate( true );
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

Travis tests every release against node version `0.10`

[![Build Status](https://travis-ci.org/pelias/config.png?branch=master)](https://travis-ci.org/pelias/config)
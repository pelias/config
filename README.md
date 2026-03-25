<p align="center">
  <img height="100" src="https://raw.githubusercontent.com/pelias/design/master/logo/pelias_github/Github_markdown_hero.png">
</p>
<h3 align="center">A modular, open-source search engine for our world.</h3>
<p align="center">Pelias is a geocoder powered completely by open data, available freely to everyone.</p>
<p align="center">
<a href="https://github.com/pelias/config/actions"><img src="https://github.com/pelias/config/workflows/Continuous%20Integration/badge.svg" /></a>
<a href="https://en.wikipedia.org/wiki/MIT_License"><img src="https://img.shields.io/github/license/pelias/config?style=flat&color=orange" /></a>
<a href="https://gitter.im/pelias/pelias"><img src="https://img.shields.io/gitter/room/pelias/pelias?style=flat&color=yellow" /></a>
</p>
<p align="center">
	<a href="https://github.com/pelias/docker">Local Installation</a> ·
        <a href="https://geocode.earth">Cloud Webservice</a> ·
	<a href="https://github.com/pelias/documentation">Documentation</a> ·
	<a href="https://gitter.im/pelias/pelias">Community Chat</a>
</p>
<details open>
<summary>What is Pelias?</summary>
<br />
Pelias is a search engine for places worldwide, powered by open data. It turns addresses and place names into geographic coordinates, and turns geographic coordinates into places and addresses. With Pelias, you're able to turn your users' place searches into actionable geodata and transform your geodata into real places.
<br /><br />
We think open data, open source, and open strategy win over proprietary solutions at any part of the stack and we want to ensure the services we offer are in line with that vision. We believe that an open geocoder improves over the long-term only if the community can incorporate truly representative local knowledge.
</details>

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

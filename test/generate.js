
var path = require('path'),
    config = require('../'),
    defaults = require('../config/defaults');
const Joi = require('joi');

module.exports.generate = {};

module.exports.generate.development = function(test) {
  test('development', function(t) {

    // set the localpath
    config.setLocalPath( '' );

    var c = config.generate();
    t.equal(typeof config, 'object', 'valid function');
    t.deepEqual(c, defaults, 'defaults');
    t.equal(typeof c.esclient, 'object', 'valid property');
    t.equal(Object.keys(c.esclient).length, 5, 'copied all default properties');
    t.equal(c.esclient.hosts.length, 1, 'defaults');
    t.end();

    // reset localpath
    config.setLocalPath( '~/pelias.json' );
  });
};

module.exports.generate.production = function(test) {

  // shallow merging disabled as deep merging should be the default
  test('production shallow merge', function(t) {

    // set the PELIAS_CONFIG env var
    process.env.PELIAS_CONFIG = path.resolve( __dirname + '/../config/env.json' );

    var c = config.generate(false);
    t.equal(typeof config, 'object', 'valid function');
    t.notDeepEqual(c, defaults, 'valid function');
    t.equal(typeof c.esclient, 'object', 'valid property');
    t.equal(Object.keys(c.esclient).length, 1, 'deleted all default properties');
    t.equal(c.esclient.hosts.length, 2, 'shallow merge');
    t.end();

    // unset the PELIAS_CONFIG env var
    delete process.env.PELIAS_CONFIG;
  });

  test('production deep merge', function(t) {

    // set the PELIAS_CONFIG env var
    process.env.PELIAS_CONFIG = path.resolve( __dirname + '/../config/env.json' );

    var c = config.generate( true );
    t.equal(typeof config, 'object', 'valid function');
    t.notDeepEqual(c, defaults, 'valid function');
    t.equal(typeof c.esclient, 'object', 'valid property');
    t.equal(Object.keys(c.esclient).length, 5, 'keep all default properties');
    t.equal(c.esclient.hosts.length, 2, 'deep merge should set two hosts');
    t.end();

    // unset the PELIAS_CONFIG env var
    delete process.env.PELIAS_CONFIG;
  });

  test('production deep merge as expected', function(t) {

    var expected = require('../config/expected-deep.json');

    // set the PELIAS_CONFIG env var
    process.env.PELIAS_CONFIG = path.resolve( __dirname + '/../config/env.json' );

    var c = config.generate( true );
    t.deepEqual(c, expected, 'merged as expected');
    t.end();

    // unset the PELIAS_CONFIG env var
    delete process.env.PELIAS_CONFIG;
  });
};

module.exports.generate.local = function(test) {

  test('local deep merge', function(t) {

    // set the localpath
    config.setLocalPath( path.resolve( __dirname + '/../config/local.json' ) );

    var c = config.generate( true );
    t.equal(typeof config, 'object', 'valid function');
    t.notDeepEqual(c, defaults, 'valid function');
    t.equal(typeof c.esclient, 'object', 'valid property');
    t.equal(Object.keys(c.esclient).length, 5, 'keep all default properties');
    t.equal(c.interpolation.client.adapter, 'http', 'interpolation client');
    t.equal(c.interpolation.client.host, 'http://localhost:9999', 'interpolation client');
    t.equal(c.imports.geonames.datapath, '/media/hdd', 'local paths');
    t.equal(c.imports.openstreetmap.datapath, '/media/hdd/osm/mapzen-metro', 'local paths');
    t.equal(c.imports.openstreetmap.import[0].filename, 'london.osm.pbf', 'local paths');
    t.equal(c.imports.whosonfirst.datapath, '/media/hdd/whosonfirst', 'local paths');
    t.end();

    // reset localpath
    config.setLocalPath( '~/pelias.json' );
  });

  test('local deep merge as expected', function(t) {

    var expected = require('../config/expected-deep.json');

    // set the localpath
    config.setLocalPath( path.resolve( __dirname + '/../config/env.json' ) );

    var c = config.generate( true );
    t.deepEqual(c, expected, 'merged as expected');
    t.end();

    // reset localpath
    config.setLocalPath( '~/pelias.json' );
  });

  // if both local and ENV are set, only ENV should be merged
  test('local does not override ENV', function(t) {

    var expected = require('../config/expected-deep.json');

    // set the PELIAS_CONFIG env var
    process.env.PELIAS_CONFIG = path.resolve( __dirname + '/../config/env.json' );

    // set the localpath
    config.setLocalPath( path.resolve( __dirname + '/../config/local.json' ) );

    var c = config.generate( true );
    t.deepEqual(c, expected, 'merged as expected');
    t.equal(c.imports.geonames.datapath, '~/geonames', 'env paths still set');
    t.end();

    // reset localpath
    config.setLocalPath( '~/pelias.json' );

    // unset the PELIAS_CONFIG env var
    delete process.env.PELIAS_CONFIG;
  });
};

module.exports.generate.paths = function(test) {

  var expected = require('../config/expected-deep.json');

  test('absolute paths supported for ENV var', function (t) {

    // set the absolute PELIAS_CONFIG env var
    process.env.PELIAS_CONFIG = path.resolve(__dirname + '/../config/env.json');

    var c = config.generate();
    t.deepEqual(c, expected, 'loaded absolute file path');
    t.end();

    // unset the PELIAS_CONFIG env var
    delete process.env.PELIAS_CONFIG;
  });

  test('relative paths supported for ENV var', function (t) {

    // set the relative PELIAS_CONFIG env var
    process.env.PELIAS_CONFIG = './config/env.json';

    var c = config.generate();
    t.deepEqual(c, expected, 'loaded relative file path');
    t.end();

    // unset the PELIAS_CONFIG env var
    delete process.env.PELIAS_CONFIG;
  });

  test('invalid paths in ENV var throws exception', function (t) {

    // set the relative PELIAS_CONFIG env var
    process.env.PELIAS_CONFIG = './config/doesnotexist.json';

    t.throws(config.generate, 'exception thrown for invalid ENV var path');
    t.end();

    // unset the PELIAS_CONFIG env var
    delete process.env.PELIAS_CONFIG;
  });
};

module.exports.generate.validate = (test) => {
  test('non-validating schema should throw an error', (t) => {
    t.throws(() => {
      config.generate(Joi.boolean());
    }, /"value" must be a boolean/);
    t.end();

  });

  test('validating schema should not throw an error', (t) => {
    t.doesNotThrow(() => {
      config.generate(Joi.object().unknown(true));
    });
    t.end();

  });

  test('returned config should have defaults applied and types converted', (t) => {
    const localConfig = require('../');
    localConfig.defaults.test = {
      key_with_type_conversion: 'yes'
    };

    const schema = Joi.object().keys({
      test: Joi.object().keys({
        key_with_default: Joi.string().default('default value'),
        key_with_type_conversion: Joi.boolean().default(true).truthy('yes').falsy('no'),
        key_without_default: Joi.string()
      })
    }).unknown(true);

    const validatedConfig = localConfig.generate(schema);

    t.equals(validatedConfig.test.key_with_default, 'default value', 'default value should be used');
    t.ok(typeof validatedConfig.test.key_with_type_conversion, 'boolean', 'should be boolean');
    t.ok(validatedConfig.test.key_with_type_conversion, 'should be true');
    t.equals(validatedConfig.test.key_without_default, undefined, 'no default');
    t.end();

  });

};

module.exports.all = function (tape) {

  function test(name, testFunction) {
    return tape('generate() ' + name, testFunction);
  }

  for( var testCase in module.exports.generate ){
    module.exports.generate[testCase](test);
  }
};

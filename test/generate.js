
var path = require('path'),
    config = require('../'),
    defaults = require('../config/defaults')

module.exports.generate = {};

module.exports.generate.development = function(test, common) {
  test('development', function(t) {
    var c = config.generate();
    t.equal(typeof config, 'object', 'valid function');
    t.deepEqual(c, defaults, 'valid function');
    t.equal(typeof c.esclient, 'object', 'valid property');
    t.equal(Object.keys(c.esclient).length, 5, 'copied all default properties');
    t.equal(c.esclient.hosts.length, 1, 'defaults');
    t.end();
  });
}

module.exports.generate.production = function(test, common) {
  
  test('production shallow merge', function(t) {

    // set the PELIAS_CONFIG env var
    process.env['PELIAS_CONFIG'] = path.resolve( __dirname + '/../config/env.json' );

    var c = config.generate();
    t.equal(typeof config, 'object', 'valid function');
    t.notDeepEqual(c, defaults, 'valid function');
    t.equal(typeof c.esclient, 'object', 'valid property');
    t.equal(Object.keys(c.esclient).length, 1, 'deleted all default properties');
    t.equal(c.esclient.hosts.length, 2, 'shallow merge');
    t.end();

    // unset the PELIAS_CONFIG env var
    delete process.env['PELIAS_CONFIG'];
  });

  test('production deep merge', function(t) {

    // set the PELIAS_CONFIG env var
    process.env['PELIAS_CONFIG'] = path.resolve( __dirname + '/../config/env.json' );

    var c = config.generate( true );
    t.equal(typeof config, 'object', 'valid function');
    t.notDeepEqual(c, defaults, 'valid function');
    t.equal(typeof c.esclient, 'object', 'valid property');
    t.equal(Object.keys(c.esclient).length, 5, 'keep all default properties');
    t.equal(c.esclient.hosts.length, 2, 'deep merge');
    t.end();

    // unset the PELIAS_CONFIG env var
    delete process.env['PELIAS_CONFIG'];
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('generate() ' + name, testFunction)
  }

  for( var testCase in module.exports.generate ){
    module.exports.generate[testCase](test, common);
  }
}
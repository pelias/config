
var Config = require('../').Config;

module.exports.config = {};

module.exports.config.constructor = function(test, common) {
  test('constructor', function(t) {
    var config = new Config();
    t.equal(typeof config, 'object', 'valid function');
    t.equal(Object.keys(config).length, 0, 'config empty');
    t.end();
  });
}

module.exports.config.interface = function(test, common) {
  test('interface', function(t) {
    var config = new Config();

    t.equal(typeof config.deepMerge, 'function', 'valid function');
    t.equal(config.deepMerge.length, 1, 'consistent arguments length');
    t.equal(typeof config.deepMergeFromPath, 'function', 'valid function');
    t.equal(config.deepMergeFromPath.length, 1, 'consistent arguments length');
    
    t.equal(typeof config.shallowMerge, 'function', 'valid function');
    t.equal(config.shallowMerge.length, 1, 'consistent arguments length');
    t.equal(typeof config.shallowMergeFromPath, 'function', 'valid function');
    t.equal(config.shallowMergeFromPath.length, 1, 'consistent arguments length');

    t.equal(typeof config.replace, 'function', 'valid function');
    t.equal(config.replace.length, 1, 'consistent arguments length');
    t.equal(typeof config.replaceFromPath, 'function', 'valid function');
    t.equal(config.replaceFromPath.length, 1, 'consistent arguments length');

    t.equal(typeof config.clear, 'function', 'valid function');
    t.equal(config.clear.length, 0, 'consistent arguments length');

    t.equal(typeof config.export, 'function', 'valid function');
    t.equal(config.export.length, 0, 'consistent arguments length');

    t.equal(typeof config.pretty, 'function', 'valid function');
    t.equal(config.pretty.length, 0, 'consistent arguments length');

    t.end();
  });
}

module.exports.config.deepMerge = function(test, common) {
  test('deepMerge()', function(t) {
    var config = new Config();
    config.deepMerge({ foo: { bar: 'baz', ring: 'rang' }, bing: 'bong' });
    t.equal(config.foo.bar, 'baz', 'correct value');
    t.equal(config.foo.ring, 'rang', 'correct value');
    t.equal(config.bing, 'bong', 'correct value');
    config.deepMerge({ foo: { bar: 'bip' } });
    t.equal(config.foo.bar, 'bip', 'replaced with new value');
    t.equal(config.foo.ring, 'rang', 'unmodified');
    t.equal(config.bing, 'bong', 'unmodified');
    t.end();
  });
}

module.exports.config.shallowMerge = function(test, common) {
  test('shallowMerge()', function(t) {
    var config = new Config();
    config.shallowMerge({ foo: { bar: 'baz', ring: 'rang' }, bing: 'bong' });
    t.equal(config.foo.bar, 'baz', 'correct value');
    t.equal(config.foo.ring, 'rang', 'removed');
    t.equal(config.bing, 'bong', 'correct value');
    config.shallowMerge({ foo: { bar: 'bip' } });
    t.equal(config.foo.bar, 'bip', 'replaced with new value');
    t.equal(config.foo.ring, undefined, 'removed during replace');
    t.equal(config.bing, 'bong', 'unmodified');
    t.end();
  });
}

module.exports.config.replace = function(test, common) {
  test('replace()', function(t) {
    var config = new Config();
    config.replace({ foo: 'bar', bing: 'bong' });
    t.equal(config.foo, 'bar', 'correct value');
    t.equal(config.bing, 'bong', 'correct value');
    t.end();
  });
}

module.exports.config.clear = function(test, common) {
  test('clear()', function(t) {
    var config = new Config();
    config.replace({ foo: 'bar', bing: 'bong' });
    t.equal(Object.keys(config).length, 2, 'config set');
    config.clear();
    t.equal(Object.keys(config).length, 0, 'config empty');
    t.end();
  });
}

module.exports.config.export = function(test, common) {
  test('export()', function(t) {
    var config = new Config();
    config.replace({ foo: 'bar' });
    t.equal(JSON.stringify(config.export()), '{"foo":"bar"}', 'exported');
    t.end();
  });
  test('produces a copy', function(t) {
    var config = new Config();
    var pointer = { an: 'obj' };
    config.replace({ foo: pointer });
    t.equal(config.foo, pointer, 'i screwed up the test');
    var exported = config.export();
    pointer.an = 'apple'; // change pointer value
    t.equal(config.foo.an, 'apple', 'i screwed up the test');
    t.equal(JSON.stringify(exported), '{"foo":{"an":"obj"}}', 'copy created');
    t.end();
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('Config Class ' + name, testFunction)
  }

  for( var testCase in module.exports.config ){
    module.exports.config[testCase](test, common);
  }
}
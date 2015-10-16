
var config = require('../'),
    defaults = require('../config/defaults');

module.exports.interface = {};

module.exports.interface.defaults = function(test) {
  test('defaults', function(t) {
    t.equal(typeof config.defaults, 'object', 'valid function');
    t.deepEqual(config.defaults, defaults, 'valid function');
    t.end();
  });
};

module.exports.interface.generate = function(test) {
  test('generate()', function(t) {
    t.equal(typeof config.generate, 'function', 'valid function');
    t.end();
  });
};

module.exports.interface.setLocalPath = function(test) {
  test('setLocalPath()', function(t) {
    t.equal(typeof config.setLocalPath, 'function', 'valid function');
    t.end();
  });

  test('setLocalPath resolves tilde', function(t) {
    var actual = config.setLocalPath('~/foo.json');
    var expected = process.env.HOME + '/foo.json';
    t.equal(actual, expected, 'resolves tilde');
    t.end();
  });
};

module.exports.all = function (tape) {

  function test(name, testFunction) {
    return tape('external interface: ' + name, testFunction);
  }

  for( var testCase in module.exports.interface ){
    module.exports.interface[testCase](test);
  }
};

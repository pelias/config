
var tape = require('tape');
var common = {};

var tests = [
  require('./interface.js'),
  require('./generate.js')
];

tests.map(function(t) {
  t.all(tape, common);
});

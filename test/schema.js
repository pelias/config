const schema = require('../schema');

module.exports.tests = {};

module.exports.tests.addendum_namespaces_validation = (test) => {
  test( 'addendum_namespaces should be of object type', (t) => {
    const config = {
      addendum_namespaces: {
        tariff_zone_ids: '123'
      }
    };

    const result = schema.validate(config);

    t.equals(result.error.details.length, 1);
    t.equals(result.error.details[0].message, '"addendum_namespaces.tariff_zone_ids" must be of type object');
    t.end();

  });

  test( 'addendum_namespaces of type other than array, string , boolean and number, should not be acceptable', (t) => {
    const config = {
      addendum_namespaces: {
        tariff_zone_ids: {
          type: 'object'
        }
      }
    };

    const result = schema.validate(config);

    t.equals(result.error.details.length, 1);
    t.equals(result.error.details[0].message, '"addendum_namespaces.tariff_zone_ids.type" must be one of [array, number, string, boolean]');
    t.end();

  });

  test( 'addendum_namespaces name should be at least 2 characters', (t) => {
    const config = {
      addendum_namespaces: {
        t: {
          type: 'object'
        }
      }
    };

    const result = schema.validate(config);

    t.equals(result.error.details.length, 1);
    t.equals(result.error.details[0].message, '"addendum_namespaces.t" is not allowed');
    t.end();
  });

  test( 'addendum_namespaces of type array should be acceptable', (t) => {
    const config = {
      addendum_namespaces: {
        tariff_zone_ids: {
          type: 'array'
        }
      }
    };

    const result = schema.validate(config);

    t.notOk(result.error);
    t.end();

  });

  test( 'addendum_namespaces of type string should be acceptable', (t) => {
    const config = {
      addendum_namespaces: {
        tariff_zone_ids: {
          type: 'string'
        }
      }
    };

    const result = schema.validate(config);

    t.notOk(result.error);
    t.end();
  });

  test( 'addendum_namespaces of type number should be acceptable', function(t) {
    const config = {
      addendum_namespaces: {
        tariff_zone_ids: {
          type: 'number'
        }
      }
    };

    const result = schema.validate(config);

    t.notOk(result.error);
    t.end();
  });

  test( 'addendum_namespaces of type boolean should be acceptable', function(t) {
    const config = {
      addendum_namespaces: {
        tariff_zone_ids: {
          type: 'boolean'
        }
      }
    };

    const result = schema.validate(config);

    t.notOk(result.error);
    t.end();
  });

};

module.exports.all = (tape, common) => {

  function test(name, testFunction) {
    return tape('configValidation: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};

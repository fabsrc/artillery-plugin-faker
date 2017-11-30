const test = require('ava');

let faker, FakerPlugin, script;

test.beforeEach(t => {
  faker = require('require-no-cache')('faker');
  FakerPlugin = require('require-no-cache')('./index').Plugin;
  script = {
    config: {
      plugins: {
        faker: {}
      },
      variables: {}
    },
    scenarios: []
  };
});

test('sets locale', t => {
  script.config.plugins.faker.locale = 'de';
  FakerPlugin(script);
  t.is(faker.locale, 'de');
});

test('creates a single random fake value', t => {
  script.config.variables.test = '$faker.name.firstName';
  FakerPlugin(script);
  t.true(typeof script.config.variables.test === 'string');
  t.not(script.config.variables.test, '$faker.name.firstName');
});

test('creates an array of random fake values', t => {
  script.config.variables.test = [ '$faker.name.firstName' ];
  FakerPlugin(script);
  t.true(Array.isArray(script.config.variables.test));
  t.notDeepEqual(script.config.variables.test, [ '$faker.name.firstName' ]);
  t.true(script.config.variables.test.every(a => typeof a === 'string'));
});

test('creates an array of a defined default number of random fake values', t => {
  script.config.variables.test = [ '$faker.random.number' ];
  script.config.variables.testTwo = [ '$faker.random.locale' ];
  script.config.plugins.faker.defaultSize = 1337;
  FakerPlugin(script);
  t.true(script.config.variables.test.length === 1337);
  t.true(script.config.variables.test.every(a => typeof a === 'number'));
  t.true(script.config.variables.testTwo.length === 1337);
  t.true(script.config.variables.testTwo.every(a => typeof a === 'string'));
});

test('creates an array of a defined number of random fake values', t => {
  script.config.variables.test = [ '$faker.random.number', 10 ];
  script.config.variables.testTwo = [ '$faker.random.number', '20' ];
  FakerPlugin(script);
  t.true(script.config.variables.test.length === 10);
  t.true(script.config.variables.test.every(a => typeof a === 'number'));
  t.true(script.config.variables.testTwo.length === 20);
  t.true(script.config.variables.testTwo.every(a => typeof a === 'number'));
});

test('uses default size for invalid array size', t => {
  script.config.variables.test = [ '$faker.random.number', 'invalid' ];
  script.config.plugins.faker.defaultSize = 1337;
  FakerPlugin(script);
  t.is(script.config.variables.test.length, 1337);
});

test('returns original variable for invalid faker function', t => {
  script.config.variables.test = '$faker.invalid';
  script.config.variables.testTwo = [ '$faker.invalid' ];
  FakerPlugin(script);
  t.is(script.config.variables.test, '$faker.invalid');
  t.deepEqual(script.config.variables.testTwo, [ '$faker.invalid' ]);
});

test('attaches fakerPluginAttachFunctions function to beforeScenario', t => {
  script.scenarios = [ { flow: { get: { url: 'http://test.local' } } } ];
  FakerPlugin(script);
  t.deepEqual(script.scenarios[0].beforeScenario, [ 'fakerPluginAttachFunctions' ]);
});

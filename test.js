const test = require('ava')

let faker, FakerPlugin, script

test.beforeEach(t => {
  faker = (require('require-no-cache')('@faker-js/faker')).faker
  FakerPlugin = require('require-no-cache')('./index').Plugin
  script = {
    config: {
      plugins: {
        faker: {}
      },
      variables: {}
    },
    scenarios: []
  }
})

test('sets faker locale', t => {
  script.config.plugins.faker.locale = 'de'
  FakerPlugin(script)
  t.is(faker.locale, 'de')
})

test('creates a random fake value', t => {
  const context = { vars: { test: '$faker.name.firstName' } }
  const plugin = FakerPlugin(script)
  plugin.script.config.processor.fakerPluginCreateVariables(context, undefined, () => undefined)
  t.true(typeof context.vars.test === 'string')
  t.not(context.vars.test, '$faker.name.firstName')
})

test('uses original variable for invalid faker function', t => {
  const context = {
    vars: {
      test: '$faker.invalid'
    }
  }
  const plugin = FakerPlugin(script)
  plugin.script.config.processor.fakerPluginCreateVariables(context, undefined, () => undefined)
  t.is(context.vars.test, '$faker.invalid')
})

test('attaches fakerPluginCreateVariables function to beforeScenario hook', t => {
  script.scenarios = [{ flow: { get: { url: 'http://test.local' } } }]
  FakerPlugin(script)
  t.deepEqual(script.scenarios[0].beforeScenario, ['fakerPluginCreateVariables'])
})

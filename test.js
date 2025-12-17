const assert = require('node:assert')
const { test, beforeEach } = require('node:test')
const FakerPlugin = require('./index').Plugin

let script

beforeEach(() => {
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
  const plugin = new FakerPlugin(script)
  assert.equal(plugin.faker.getMetadata().code, 'de')
})

test('creates a random fake value', t => {
  const context = { vars: { test: '$faker.person.firstName' } }
  const plugin = new FakerPlugin(script)
  plugin.script.config.processor.fakerPluginCreateVariables(context, undefined, () => undefined)
  assert.equal(typeof context.vars.test, 'string')
  assert.notEqual(context.vars.test, '$faker.person.firstName')
})

test('uses original variable for invalid faker function', t => {
  const context = {
    vars: {
      test: '$faker.invalid'
    }
  }
  const plugin = new FakerPlugin(script)
  plugin.script.config.processor.fakerPluginCreateVariables(context, undefined, () => undefined)
  assert.equal(context.vars.test, '$faker.invalid')
})

test('attaches fakerPluginCreateVariables function to beforeScenario hook', t => {
  script.scenarios = [{ flow: { get: { url: 'http://test.local' } } }]
  const plugin = new FakerPlugin(script)
  assert.ok(plugin)
  assert.ok(script.scenarios[0].beforeScenario?.includes('fakerPluginCreateVariables'))
})

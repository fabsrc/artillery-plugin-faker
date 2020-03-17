const debug = require('debug')('plugin:faker')
const faker = require('faker')
const get = require('lodash.get')

module.exports.Plugin = FakerPlugin
module.exports.pluginInterfaceVersion = 2

function FakerPlugin (script, events) {
  this.script = script
  this.events = events
  this.locale = this.script.config.plugins.faker.locale

  if (this.locale) {
    faker.locale = this.locale
    debug('Locale set to', this.locale)
  }

  script.config.processor = script.config.processor || {}
  script.config.processor.fakerPluginCreateVariables = fakerPluginCreateVariables

  script.scenarios.forEach(scenario => {
    scenario.beforeScenario = scenario.beforeScenario || []
    scenario.beforeScenario.push('fakerPluginCreateVariables')
  })

  debug('Plugin initialized')
  return this
}

function fakerPluginCreateVariables (req, userContext, events, done) {
  let ctx = userContext
  let cb = done

  if (arguments.length === 3) {
    // called as a "function"
    ctx = req
    cb = events
  }

  const variables = ctx.vars

  if (!variables || variables.length === 0) {
    return cb()
  }

  Object.keys(variables).forEach(key => {
    const val = variables[key]

    if (/\$faker\.[A-Za-z.]+$/.test(val)) {
      const path = val.replace('$faker.', '')
      const func = get(faker, path)

      if (func && typeof func === 'function') {
        const fakedValue = func()
        variables[key] = fakedValue
        debug(`fakerPluginCreateVariables: ${path} -> ${fakedValue}`)
      }
    }
  })

  return cb()
}

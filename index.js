const debug = require('debug')('plugin:faker')
const { Faker, en } = require('@faker-js/faker')
const delve = require('dlv')

class FakerPlugin {
  constructor (script, events) {
    this.script = script
    this.events = events
    this.faker = new Faker({ locale: [en] })

    if (this.script.config.plugins.faker.locale) {
      const { allLocales } = require('@faker-js/faker')
      const locale = allLocales[this.script.config.plugins.faker.locale]

      if (!locale) {
        throw new Error(`Locale '${locale}' does not exist. Please configure a valid locale.`)
      }

      this.faker = new Faker({ locale })
      debug('Locales set to', this.locale)
    }

    script.config.processor = script.config.processor || {}
    script.config.processor.fakerPluginCreateVariables = this.fakerPluginCreateVariables.bind(this)

    script.scenarios.forEach(scenario => {
      scenario.beforeScenario = scenario.beforeScenario || []
      scenario.beforeScenario.push('fakerPluginCreateVariables')
    })

    debug('Plugin initialized')
  }

  fakerPluginCreateVariables (req, userContext, events, done) {
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
        const func = delve(this.faker, path)

        if (func && typeof func === 'function') {
          const fakedValue = func()
          variables[key] = fakedValue
          debug(`fakerPluginCreateVariables: ${path} -> ${fakedValue}`)
        }
      }
    })

    return cb()
  }
}

module.exports.Plugin = FakerPlugin

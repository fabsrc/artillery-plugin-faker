const debug = require('debug')('plugin:faker');
const faker = require('faker');
const _ = { get: require('lodash.get') };

module.exports.Plugin = FakerPlugin;
module.exports.pluginInterfaceVersion = 2;

function FakerPlugin (script, ee) {
  this.script = script;
  this.ee = ee;
  this.locale = this.script.config.plugins.faker.locale;
  this.defaultSize = this.script.config.plugins.faker.defaultSize || 250;

  if (this.locale) {
    faker.locale = this.locale;
    debug('Locale set to', this.locale);
  }

  const variables = script.config.variables || {};
  replaceVariablesWithFakeValues(variables, this.defaultSize);

  script.config.processor = script.config.processor || {};
  script.config.processor.fakerPluginAttachFunctions = fakerPluginAttachFunctions;

  script.scenarios.forEach(scenario => {
    scenario.beforeScenario = scenario.beforeScenario || [];
    scenario.beforeScenario.push('fakerPluginAttachFunctions');
  });

  debug('Plugin initialized');
  return this;
}

function replaceVariablesWithFakeValues (variables, defaultSize) {
  Object.keys(variables).forEach(key => {
    let isArray = false;
    let val = variables[key];
    let size = defaultSize;

    if (Array.isArray(val)) {
      size = +val[1] || +defaultSize;
      isArray = true;
      val = val[0];
    }

    if (/\$faker\.[A-Za-z.]+$/.test(val)) {
      const path = val.replace('$faker.', '');
      const func = _.get(faker, path);

      if (func) {
        if (isArray) {
          variables[key] = Array(size).fill(0).map(a => func());
        } else {
          variables[key] = func();
        }
      }
    }
  });
}

function fakerFunc (path) {
  const func = _.get(faker, path);
  return func ? func() : path;
}

function fakerPluginAttachFunctions (userContext, ee, next) {
  userContext.funcs.$faker = fakerFunc;
  userContext.funcs.$fake = faker.fake;

  return next();
}

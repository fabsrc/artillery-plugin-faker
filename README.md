# Artillery Faker

[![Build Status](https://img.shields.io/travis/fabsrc/artillery-plugin-faker.svg?style=flat-square)](https://travis-ci.org/fabsrc/artillery-plugin-faker)
[![npm](https://img.shields.io/npm/v/artillery-plugin-faker.svg?style=flat-square)](https://www.npmjs.com/package/artillery-plugin-faker)
[![Dependencies](https://img.shields.io/david/fabsrc/artillery-plugin-faker.svg?style=flat-square)](https://david-dm.org/fabsrc/artillery-plugin-faker)
[![Development Dependencies](https://img.shields.io/david/dev/fabsrc/artillery-plugin-faker.svg?style=flat-square)](https://david-dm.org/fabsrc/artillery-plugin-faker?type=dev)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

Makes [faker.js](https://github.com/Marak/faker.js) available for [Artillery](https://artillery.io/) loadtest configurations.

## Install

```sh
$ npm install -g artillery-plugin-faker
```

## Usage

Add the plugin to your loadtest configuration:

```yaml
config:
  plugins:
    faker:
      locale: 'en'
```

### Options

* `locale` (default: `en`) sets the locale of *faker.js*.

### Example

Using a string prefixed with `$faker.` as variable value will result in a random variable value returned by the indicated *faker.js* function.

```yaml
config:
  plugins:
    faker: {}
  variables:
    title: '$faker.name.title'
    firstName: '$faker.name.firstName'
    lastName: '$faker.name.lastName'
  scenarios:
    - flow:
      - get:
          url: "/search?q={{ firstName }} {{ lastName }}"
```

For a complete list of available *faker.js* functions, have a look at the [faker.js documentation](https://github.com/Marak/faker.js#api-methods). Please note that no parameters can be passed to the *faker.js* functions at this time.

*Have a look at the `example.yml` file for a fully working example.*

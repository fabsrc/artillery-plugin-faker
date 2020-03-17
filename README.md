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
      locale: en
```

### Options

- `locale` (default: `en`) sets the locale of _faker.js_.

### Example

Using a string prefixed with `$faker.` as variable value will result in a random variable value returned by the indicated _faker.js_ function.

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 10
      arrivalRate: 1
  plugins:
    faker:
      locale: en
  variables:
    firstName: "$faker.name.firstName"

scenarios:
  - flow:
      - log: "Making request with query: {{ firstName }}"
      - get:
          url: "/search?q={{ firstName }}"
```

For a complete list of available _faker.js_ functions, have a look at the [faker.js documentation](https://github.com/Marak/faker.js#api-methods). Please note that no parameters can be passed to the _faker.js_ functions at this time.

_Have a look at the `example.yml` file for a fully working example._

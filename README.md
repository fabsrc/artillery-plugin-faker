# Artillery Plugin Faker

[![Build Status](https://img.shields.io/github/actions/workflow/status/fabsrc/artillery-plugin-faker/ci.yml?style=flat-square)](https://github.com/fabsrc/artillery-plugin-faker/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/artillery-plugin-faker.svg?style=flat-square)](https://www.npmjs.com/package/artillery-plugin-faker)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

Makes [faker.js](https://fakerjs.dev) available for [Artillery](https://artillery.io/) load test configurations.

> [!TIP]
> Artillery also provides a [fake-data plugin](https://www.artillery.io/docs/reference/extensions/fake-data) (powered by [falso](https://ngneat.github.io/falso/docs/getting-started/)).
> Use that for simple, integrated fake values — use this plugin when you need faker.js' full API, locale support, or specific faker functions.

## Install

```sh
npm install -g artillery-plugin-faker
```

## Usage

Add the plugin to your load test configuration:

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
    firstName: "$faker.person.firstName"

scenarios:
  - flow:
      - log: "Making request with query: {{ firstName }}"
      - get:
          url: "/search?q={{ firstName }}"
```

For a complete list of available _faker.js_ functions, have a look at the [faker.js documentation](https://fakerjs.dev/api/). Please note that no parameters can be passed to the _faker.js_ functions at this time.

_Have a look at the `example.yml` file for a fully working example:_

```sh
artillery run example.yml
```

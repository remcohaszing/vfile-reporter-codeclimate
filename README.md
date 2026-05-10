# vfile-reporter-codeclimate

[![github actions](https://github.com/remcohaszing/vfile-reporter-codeclimate/actions/workflows/ci.yaml/badge.svg)](https://github.com/remcohaszing/vfile-reporter-codeclimate/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/remcohaszing/vfile-reporter-codeclimate/branch/main/graph/badge.svg)](https://codecov.io/gh/remcohaszing/vfile-reporter-codeclimate)
[![npm version](https://img.shields.io/npm/v/vfile-reporter-codeclimate)](https://www.npmjs.com/package/vfile-reporter-codeclimate)
[![npm downloads](https://img.shields.io/npm/dm/vfile-reporter-codeclimate)](https://www.npmjs.com/package/vfile-reporter-codeclimate)

Format [VFile](https://github.com/vfile/vfile) messages as a
[Code Climate](https://github.com/codeclimate/platform/blob/master/spec/analyzers/SPEC.md) report.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
  - [GitLab](#gitlab)
  - [Programmatic](#programmatic)
- [API](#api)
  - [`toCodeClimate(files)`](#tocodeclimatefiles)
  - [`default`](#default)
- [Compatibility](#compatibility)
- [License](#license)

## Installation

```sh
npm install vfile-reporter-codeclimate
```

## Usage

This [VFile](https://github.com/vfile/vfile) [reporter](https://github.com/vfile/vfile#reporter)
formats [VFile messages](https://github.com/vfile/vfile#filemessages) to
[Code Climate](https://github.com/codeclimate/platform/blob/master/spec/analyzers/SPEC.md) issues.

### CLI

You can use this with a [`unified-engine`](https://github.com/unifiedjs/unified-engine) based CLI.
For example, with [`remark-cli`](https://github.com/remarkjs/remark/tree/main/packages/remark-cli).

```sh
remark --report codeclimate .
```

You may also pass options:

```sh
remark --report 'codeclimate=pretty:2' .
```

### GitLab

You can use the report in GitLab.

```yaml
eslint:
  image: node:26-alpine
  script:
    - npm ci
    - npx remark --report codeclimate . 2> codequality.json
  artifacts:
    reports:
      codequality: codequality.json
```

### Programmatic

You can use this package programmatically in Node.js.

```js
import { VFile } from 'vfile'
import { toCodeClimate } from 'vfile-reporter-codeclimate'

const file = new VFile()

file.message('This is a VFile message')

const issues = toCodeClimate([file])
```

## API

### `toCodeClimate(files)`

Convert VFile messages to a Code Climate issues.

#### Parameters

- `files` (`Iterable<VFile>`): The files whose messages to convert to Code Climate issues.

#### Returns

An array of Code Climate issues to represent the VFile messages.

### `default`

Convert VFile messages to a Code Climate report.

This API exists for compatibility with
[`unified-engine`](https://github.com/unifiedjs/unified-engine). For programmatic use, you want to
use [`toCodeClimate`](#tocodeclimatefiles) instead.

#### Parameters

- `files` (`Iterable<VFile>`): The files whose messages to convert to Code Climate issues.
- `options` (`Options`, optional): Additional reporter options.

#### Returns

The Code Climate report as a string.

## Compatibility

This project is compatible with Node.js 22 or greater.

## License

[MIT](LICENSE.md) © [Remco Haszing](https://github.com/remcohaszing)

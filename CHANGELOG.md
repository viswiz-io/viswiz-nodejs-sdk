# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.0](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v2.0.1...v2.1.0) (2019-09-09)


### Bug Fixes

* CLI wait for result uses the project threshold for comparison ([169a2d5](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/169a2d5))


### Features

* New SDK method: getProject ([19d0709](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/19d0709))

### [2.0.1](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v2.0.0...v2.0.1) (2019-09-08)


### Bug Fixes

* Move babel-jest to devDependencies :bug: ([29b9e46](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/29b9e46))

## [2.0.0](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.5.1...v2.0.0) (2019-09-06)


### ⚠ BREAKING CHANGES

* Image names might be different compared to previous
versions, which were not correctly removing the folder prefix.

### Bug Fixes

* Build operation removes folder prefix from image names :bug: ([fbebda8](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/fbebda8))
* Progress bar displays correctly :bug: ([b01cb5a](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/b01cb5a))


### Features

* CLI build with wait for results flag ([b2434c8](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/b2434c8))

### [1.5.1](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.5.0...v1.5.1) (2019-09-02)


### Bug Fixes

* Upgrade dependencies :arrow_up: ([54f0674](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/54f0674))
* Use all CLI options :bug: ([1d2a9ad](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/1d2a9ad))

<a name="1.5.0"></a>
# [1.5.0](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.4.0...v1.5.0) (2018-10-07)


### Bug Fixes

* Catch and output errors in CLI commands ([8de7c23](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/8de7c23))
* ES version uses real ES sources ([7864576](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/7864576))
* Upgrade dependencies :arrow_up: ([c4b957d](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/c4b957d))


### Features

* Progress indicator for build CLI command :tada: ([7868350](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/7868350)), closes [#1](https://github.com/viswiz-io/viswiz-nodejs-sdk/issues/1)



<a name="1.4.0"></a>
# [1.4.0](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.3.3...v1.4.0) (2018-10-06)


### Features

* Image directory is scanned recursively for images :sparkles: ([23a3399](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/23a3399))



<a name="1.3.3"></a>
## [1.3.3](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.3.2...v1.3.3) (2018-03-15)



<a name="1.3.2"></a>
## [1.3.2](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.3.1...v1.3.2) (2018-03-02)


### Bug Fixes

* CLI build outputs the correct report URL when finished :bug: ([25d66cd](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/25d66cd))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.3.0...v1.3.1) (2018-03-01)


### Bug Fixes

* Setup bin link on install ([386c076](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/386c076))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.2.0...v1.3.0) (2018-03-01)


### Features

* New CLI tool :rocket: ([9b0ff0f](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/9b0ff0f))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.1.2...v1.2.0) (2018-02-22)


### Features

* Fallback to use API key from environment variable ([4cbba7e](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/4cbba7e))
* New method for simpler usage: buildWithImages ([f742055](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/f742055))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.1.1...v1.1.2) (2018-02-08)


### Bug Fixes

* Package main and module exports :bug: ([da5bd85](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/da5bd85))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.1.0...v1.1.1) (2018-01-22)


### Bug Fixes

* Export both CommonJS and ES module :bug: ([0a6b1ef](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/0a6b1ef))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.0.4...v1.1.0) (2018-01-16)


### Bug Fixes

* Add finishBuild to usage examples docs :memo: ([304a435](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/304a435))


### Features

* Project notifications :tada: ([caad9b6](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/caad9b6))



<a name="1.0.4"></a>
## [1.0.4](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.0.3...v1.0.4) (2017-12-12)


### Bug Fixes

* Docs using ESDoc ([b4d2e88](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/b4d2e88))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.0.2...v1.0.3) (2017-12-08)


### Bug Fixes

* Update readme links and format ([c1fa8cf](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/c1fa8cf))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.0.1...v1.0.2) (2017-12-07)


### Bug Fixes

* Correct github URL :bug: ([e97ea83](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/e97ea83))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/viswiz-io/viswiz-nodejs-sdk/compare/v1.0.0...v1.0.1) (2017-12-07)


### Bug Fixes

* Updated docs with string IDs :twisted_rightwards_arrows: ([453eec0](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/453eec0))



<a name="1.0.0"></a>
## 1.0.0 (2017-12-04)


### Features

* Initial commit ([88c1af7](https://github.com/viswiz-io/viswiz-nodejs-sdk/commit/88c1af7))

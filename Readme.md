# VisWiz.io Node.js SDK

> The official Node.js VisWiz.io SDK.

[![Travis branch](https://img.shields.io/travis/viswiz-io/viswiz-nodejs-sdk/master.svg?style=flat-square)](https://travis-ci.org/viswiz-io/viswiz-nodejs-sdk)
[![NPM version](https://img.shields.io/npm/v/viswiz-sdk.svg?style=flat-square)](https://www.npmjs.com/package/viswiz-sdk)
[![Dependencies](https://img.shields.io/david/viswiz-io/viswiz-nodejs-sdk.svg?style=flat-square)](https://david-dm.org/viswiz-io/viswiz-nodejs-sdk)

Welcome to the [VisWiz.io](https://www.viswiz.io/) Node.js SDK documentation.

The SDK allows you to query and create new projects, builds or images within the
VisWiz service.

## Installation

Install the SDK module using `yarn`:

```
$ yarn add -D viswiz-sdk
```

Or using `npm`:

```
$ npm install -D viswiz-sdk
```

## Usage

Using `Promise`:

```js
const VisWiz = require('viswiz-sdk');

const client = new VisWiz('your-unique-api-key-here');

client
	.getProjects()
	.then(projects => projects.find(project => project.name === 'Foo'))
	.then(project =>
		client.createBuild({
			projectID: project.id,
			name: 'Foo Bar',
			revision: 'abcdef1234567890',
		})
	)
	.then(build =>
		client.createImage(build.id, 'image-name', '/path/to/image.png')
	);
```

Using `async`/`await`:

```js
const VisWiz = require('viswiz-sdk');

async function run() {
	const client = new VisWiz('your-unique-api-key-here');

	const projects = await client.getProjects();
	const project = projects.find(project => project.name === 'Foo');

	const build = await client.createBuild({
		projectID: project.id,
		name: 'Foo Bar',
		revision: 'abcdef1234567890',
	});

	await client.createImage(build.id, 'image-name', '/path/to/image.png');
}

run();
```

## Documentation

See the JSDoc markdown documentation in
[Documentation.md](https://github.com/viswiz-io/viswiz-nodejs-sdk/blob/master/Documentation.md#readme).

## Change log

The change log can be found here:
[CHANGELOG.md](https://github.com/viswiz-io/viswiz-nodejs-sdk/blob/master/CHANGELOG.md#readme).

## Authors and license

Author: [VisWiz.io](https://www.viswiz.io/).

MIT License, see the included
[License.md](https://github.com/viswiz-io/viswiz-nodejs-sdk/blob/master/License.md)
file.

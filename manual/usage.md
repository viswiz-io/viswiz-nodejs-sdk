# Using the SDK

## Installation

Install the SDK module using `yarn`:

```
$ yarn add -D viswiz-sdk
```

Or using `npm`:

```
$ npm install -D viswiz-sdk
```

## Configuration

The SDK can use an API key from the environment variable `VISWIZ_API_KEY`, so it
does not need to be exposed in the code base.

## Usage

Using `async`/`await` (node 8+):

```js
const VisWiz = require('viswiz-sdk');

async function run() {
	const client = new VisWiz('your-unique-api-key-here');

	const projects = await client.getProjects();
	const project = projects.find(project => project.name === 'Foo');

	await client.buildWithImages({
		branch: 'master',
		name: 'Foo Bar',
		projectID: project.id,
		revision: 'abcdef1234567890',
	}, '/path/to/images');
}

run();
```

Using `Promise`:

```js
const VisWiz = require('viswiz-sdk');

// Assuming environment variable VISWIZ_API_KEY is set
const client = new VisWiz();

client.getProjects()
	.then(projects => projects.find(project => project.name === 'Foo'))
	.then(project => client.buildWithImages({
		branch: 'master',
		name: 'Foo Bar',
		projectID: project.id,
		revision: 'abcdef1234567890',
	}, '/path/to/images'));
```

### ES module

```js
import VisWiz from 'viswiz-sdk/es';
```

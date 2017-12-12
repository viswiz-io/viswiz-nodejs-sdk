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

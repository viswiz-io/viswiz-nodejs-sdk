# Using the CLI

## Installation

Install the module using `yarn`:

```
$ yarn add -D viswiz-sdk
```

Or using `npm`:

```
$ npm install -D viswiz-sdk
```

## Configuration

The following environment keys are used when their corresponding flags are missing:

- `VISWIZ_API_KEY` - for the `api-key` flag
- `VISWIZ_PROJECT_ID` - for the `project` flag

CI environment variables for popular [CI services](https://www.npmjs.com/package/env-ci#supported-ci)
are also used for the `branch`, `message` and `revision` flags.

## Options

```
$ viswiz --help

  Usage: viswiz [options] [command]


  Options:

    -V, --version              output the version number
    -k, --api-key [apiKey]     The API key of a VisWiz account to use. Defaults to VISWIZ_API_KEY env.
    -p, --project [projectID]  The ID of a VisWiz project to use. Defaults to VISWIZ_PROJECT_ID env.
    -h, --help                 output usage information


  Commands:

    build [options]  Creates a new build on VisWiz.io and sends images for regression testing.
```

### `build` options

```
$ viswiz build --help

  Usage: build [options]

  Creates a new build on VisWiz.io and sends images for regression testing.


  Options:

    -i, --image-dir <path>          The path to a directory (scanned recursively) with images used for the build.
    -b, --branch [branch name]      The branch name for the build. Auto-detected on popular CIs.
    -m, --message [commit message]  The commit message for the build. Auto-detected on popular CIs.
    -r, --revision [rev]            The revision for the build. Auto-detected on popular CIs.
    -h, --help                      output usage information
```

## Usage

On popular [CI services](https://www.npmjs.com/package/env-ci#supported-ci), assuming
`VISWIZ_API_KEY` and `VISWIZ_PROJECT_ID` values are configured in the CI environment:

```
$ viswiz build --image-dir ./path/to/images/directory
```

/* eslint no-console: 0 */

import envCI from 'env-ci';

export function error(msg, cmd) {
	console.error(msg);
	if (cmd) {
		cmd.outputHelp();
	}
	process.exit(1);
}

export function getCI() {
	const ci = envCI();

	const messageMap = {
		appveyor: 'APPVEYOR_REPO_COMMIT_MESSAGE',
		bitrise: 'BITRISE_GIT_MESSAGE',
		buildkite: 'BUILDKITE_MESSAGE',
		codeship: 'CI_MESSAGE',
		drone: 'DRONE_COMMIT_MESSAGE',
		shippable: 'COMMIT_MESSAGE',
		travis: 'TRAVIS_COMMIT_MESSAGE',
	};
	ci.message = process.env[messageMap[ci.service]];

	if (!ci.isCi) {
		ci.branch = null;
		ci.commit = null;
	}

	return ci;
}

export function log(msg) {
	if (process.env.NODE_ENV === 'test') {
		global.LOGS = global.LOGS || [];
		global.LOGS.push(msg);

		return msg;
	}
	console.log(msg);
}

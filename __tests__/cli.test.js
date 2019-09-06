jest.mock('../src/Progress');

import { spawnSync } from 'child_process';
import path from 'path';
import { commands } from '../src/cli';
import nock from '../utils/nock';
import { instances } from '../src/Progress';

const FIXTURES = path.resolve(__dirname, '..', '__fixtures__');

describe('cli', () => {
	const API_KEY = 'foobar';
	const buildID = 'abcdef';
	const projectID = 'qwerty';

	const buildPayload = {
		branch: 'master',
		name: 'Foo Bar',
		revision: 'abcdef1234567890',
	};
	const buildResponse = Object.assign(
		{
			projectID,
		},
		buildPayload
	);
	const image = {
		name: 'Foo Bar',
		originalURL: 'http://foo.com/bar.png',
		thumbURL: 'http://foo.com/bar-thumb.png',
	};

	let program;
	let cmd;

	const { build } = commands;

	function nockSetup() {
		return nock()
			.post(`/projects/${projectID}/builds`, buildPayload)
			.matchHeader('Authorization', `Bearer ${API_KEY}`)
			.reply(200, Object.assign({ id: buildID }, buildResponse))
			.post(`/builds/${buildID}/images`)
			.matchHeader('Authorization', `Bearer ${API_KEY}`)
			.reply(200, image)
			.post(`/builds/${buildID}/images`)
			.matchHeader('Authorization', `Bearer ${API_KEY}`)
			.reply(200, image)
			.post(`/builds/${buildID}/images`)
			.matchHeader('Authorization', `Bearer ${API_KEY}`)
			.reply(200, image)
			.post(`/builds/${buildID}/finish`)
			.matchHeader('Authorization', `Bearer ${API_KEY}`)
			.reply(200);
	}

	beforeEach(() => {
		program = {
			apiKey: API_KEY,
			project: projectID,
		};
		cmd = {
			branch: buildPayload.branch,
			imageDir: FIXTURES,
			message: buildPayload.name,
			revision: buildPayload.revision,
		};

		delete process.env.CI;
		process.env.TRAVIS = true;
		process.env.TRAVIS_BRANCH = buildPayload.branch;
		process.env.TRAVIS_COMMIT = buildPayload.revision;
		process.env.TRAVIS_COMMIT_MESSAGE = buildPayload.name;
		process.env.VISWIZ_API_KEY = API_KEY;
		process.env.VISWIZ_PROJECT_ID = projectID;
		process.env.VISWIZ_SERVER = nock.SERVER;

		if (global.LOGS) {
			global.LOGS = [];
		}
	});

	describe('build', () => {
		it('creates a build successfully, based on arguments', async () => {
			const scope = nockSetup();

			const result = await build(program, cmd);

			expect(global.LOGS).toEqual([
				'Creating build on VisWiz.io...',
				'Done!',
				'Build report will be available at: https://app.viswiz.io/projects/qwerty/build/abcdef/results',
			]);
			expect(result).toContain('OK');
			expect(instances[instances.length - 1].current).toBe(3);
			expect(instances[instances.length - 1].total).toBe(3);
			expect(scope.isDone()).toBeTruthy();
		});

		it('creates a build successfully, based on CI environment variables', async () => {
			delete cmd.branch;
			delete cmd.message;
			delete cmd.revision;
			process.env.CI = true;
			process.env.TRAVIS = true;
			process.env.TRAVIS_BRANCH = buildPayload.branch;
			process.env.TRAVIS_COMMIT = buildPayload.revision;
			process.env.TRAVIS_COMMIT_MESSAGE = buildPayload.name;

			const scope = nockSetup();

			const result = await build(program, cmd);

			expect(global.LOGS).toEqual([
				'Creating build on VisWiz.io...',
				'Done!',
				'Build report will be available at: https://app.viswiz.io/projects/qwerty/build/abcdef/results',
			]);
			expect(result).toContain('OK');
			expect(instances[instances.length - 1].current).toBe(3);
			expect(instances[instances.length - 1].total).toBe(3);
			expect(scope.isDone()).toBeTruthy();
		});

		it('errors on missing API key', async () => {
			delete process.env.VISWIZ_API_KEY;

			const result = spawnSync('./bin/viswiz', ['build', '--image-dir', '.'], {
				env: process.env,
			});

			expect(result.status).toBe(1);
			expect(result.stderr.toString()).toContain('Error: Missing API key');
		});

		it('errors on missing project ID', async () => {
			delete process.env.VISWIZ_PROJECT_ID;

			const result = spawnSync('./bin/viswiz', ['build', '--image-dir', '.'], {
				env: process.env,
			});

			expect(result.status).toBe(1);
			expect(result.stderr.toString()).toContain('Error: Missing project ID');
		});

		it('errors on missing branch name', async () => {
			delete process.env.TRAVIS_BRANCH;

			const result = spawnSync('./bin/viswiz', ['build', '--image-dir', '.'], {
				env: process.env,
			});

			expect(result.status).toBe(1);
			expect(result.stderr.toString()).toContain('Error: Missing branch name');
		});

		it('errors on missing image directory', async () => {
			const result = spawnSync('./bin/viswiz', ['build'], {
				env: process.env,
			});

			expect(result.status).toBe(1);
			expect(result.stderr.toString()).toContain(
				'Error: Missing image directory'
			);
		});

		it('errors on missing commit message', async () => {
			delete process.env.TRAVIS_COMMIT_MESSAGE;

			const result = spawnSync('./bin/viswiz', ['build', '--image-dir', '.'], {
				env: process.env,
			});

			expect(result.status).toBe(1);
			expect(result.stderr.toString()).toContain(
				'Error: Missing commit message'
			);
		});

		it('errors on missing commit revision', async () => {
			delete process.env.TRAVIS_COMMIT;

			const result = spawnSync('./bin/viswiz', ['build', '--image-dir', '.'], {
				env: process.env,
			});

			expect(result.status).toBe(1);
			expect(result.stderr.toString()).toContain(
				'Error: Missing commit revision'
			);
		});

		it('errors when no files are available', () => {
			const result = spawnSync(
				'./bin/viswiz',
				['build', '--image-dir', __dirname],
				{
					env: process.env,
				}
			);

			expect(result.status).toBe(1);
			expect(result.stderr.toString()).toContain(
				'Error: No image files found in image directory!'
			);
		});
	});
});

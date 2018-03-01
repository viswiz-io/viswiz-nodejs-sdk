import path from 'path';
import { commands } from '../src/cli';
import nock from '../utils/nock';

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
		process.env.VISWIZ_SERVER = nock.SERVER;
	});

	describe('build', () => {
		it('creates a build successfully, based on arguments', async () => {
			const scope = nockSetup();

			const result = await build(program, cmd);

			expect(result).toContain('OK');
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

			expect(result).toContain('OK');
			expect(scope.isDone()).toBeTruthy();
		});

		it('errors on missing API key', async () => {
			delete program.apiKey;

			const result = await build(program, cmd);

			expect(result).toContain('Missing API key');
		});

		it('errors on missing project ID', async () => {
			delete program.project;

			const result = await build(program, cmd);

			expect(result).toContain('Missing project ID');
		});

		it('errors on missing branch name', async () => {
			delete process.env.TRAVIS_BRANCH;
			delete cmd.branch;

			const result = await build(program, cmd);

			expect(result).toContain('Missing branch name');
		});

		it('errors on missing image directory', async () => {
			delete cmd.imageDir;

			const result = await build(program, cmd);

			expect(result).toContain('Missing image directory');
		});

		it('errors on missing commit message', async () => {
			delete process.env.TRAVIS_COMMIT_MESSAGE;
			delete cmd.message;

			const result = await build(program, cmd);

			expect(result).toContain('Missing commit message');
		});

		it('errors on missing commit revision', async () => {
			delete process.env.TRAVIS_COMMIT;
			delete cmd.revision;

			const result = await build(program, cmd);

			expect(result).toContain('Missing commit revision');
		});
	});
});

const VisWiz = require('../sdk');
const nock = require('../utils/nock');

let instance;

beforeEach(() => {
	instance = new VisWiz('foobar', {
		server: nock.SERVER,
	});
});

describe('builds methods', () => {
	const buildID = 1234;
	const projectID = 123;
	const build = {
		id: 1234,
		name: 'Foo Bar',
		revision: 'abcdef123456',
	};

	describe('getBuilds', () => {
		it('resolves on successfull request', () => {
			const body = {
				builds: [build, build],
			};

			const scope = nock()
				.get('/projects/123/builds')
				.reply(200, body);

			return instance.getBuilds(projectID).then(response => {
				expect(response).toEqual(body.builds);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.get('/projects/123/builds')
				.reply(401);

			return instance.getBuilds(projectID).catch(response => {
				expect(response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on bad input', () => {
			return instance.getBuilds().catch(err => {
				expect(err).toBeTruthy();
			});
		});
	});

	describe('createBuild', () => {
		it('resolves on successfull request', () => {
			const body = build;
			const payload = {
				projectID,
				name: 'Foo Bar',
				url: 'http://github.com/foo/bar',
			};

			const scope = nock()
				.post('/projects/123/builds', payload)
				.reply(200, body);

			return instance.createBuild(payload).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const payload = {
				projectID,
				name: 'Foo Bar',
				url: 'http://github.com/foo/bar',
			};

			const scope = nock()
				.post('/projects/123/builds', payload)
				.reply(400);

			return instance.createBuild(payload).catch(response => {
				expect(response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on bad input', () => {
			return instance.createBuild().catch(err => {
				expect(err).toBeTruthy();
			});
		});
	});

	describe('finishBuild', () => {
		it('resolves on successfull request', () => {
			const scope = nock()
				.post('/builds/1234/finish')
				.reply(200);

			return instance.finishBuild(buildID).then(response => {
				expect(response).toBeFalsy();
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post('/builds/1234/finish')
				.reply(400);

			return instance.finishBuild(buildID).catch(response => {
				expect(response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on bad input', () => {
			return instance.finishBuild().catch(err => {
				expect(err).toBeTruthy();
			});
		});
	});

	describe('getBuildResults', () => {
		it('resolves on successfull request', () => {
			const body = {
				build: build,
				images: [],
			};

			const scope = nock()
				.get('/builds/1234/results')
				.reply(200, body);

			return instance.getBuildResults(buildID).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.get('/builds/1234/results')
				.reply(401);

			return instance.getBuildResults(buildID).catch(response => {
				expect(response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on bad input', () => {
			return instance.getBuildResults().catch(err => {
				expect(err).toBeTruthy();
			});
		});
	});
});

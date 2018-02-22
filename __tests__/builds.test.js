import VisWiz from '../es';
import nock from '../utils/nock';

let instance;

beforeEach(() => {
	instance = new VisWiz('foobar', {
		server: nock.SERVER,
	});
});

describe('builds methods', () => {
	const buildID = 'abcdef';
	const projectID = 'foobar';
	const build = {
		branch: 'master',
		id: buildID,
		name: 'Foo Bar',
		revision: 'abcdef123456',
	};

	describe('getBuilds', () => {
		it('resolves on successfull request', () => {
			const body = {
				builds: [build, build],
			};

			const scope = nock()
				.get(`/projects/${projectID}/builds`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, body);

			return instance.getBuilds(projectID).then(response => {
				expect(response).toEqual(body.builds);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.get(`/projects/${projectID}/builds`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(401);

			return instance.getBuilds(projectID).catch(response => {
				expect(response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on bad input', () => {
			return instance.getBuilds().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('projectID');
			});
		});
	});

	describe('createBuild', () => {
		it('resolves on successfull request', () => {
			const body = build;
			const payload = {
				branch: 'master',
				name: 'Foo Bar',
				url: 'http://github.com/foo/bar',
			};
			const params = Object.assign({ projectID }, payload);

			const scope = nock()
				.post(`/projects/${projectID}/builds`, payload)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, body);

			return instance.createBuild(params).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const payload = {
				branch: 'master',
				name: 'Foo Bar',
				url: 'http://github.com/foo/bar',
			};
			const params = Object.assign({ projectID }, payload);

			const scope = nock()
				.post(`/projects/${projectID}/builds`, payload)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(400);

			return instance.createBuild(params).catch(response => {
				expect(response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on bad input', () => {
			return instance.createBuild().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('projectID');
			});
		});
	});

	describe('finishBuild', () => {
		it('resolves on successfull request', () => {
			const scope = nock()
				.post(`/builds/${buildID}/finish`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200);

			return instance.finishBuild(buildID).then(response => {
				expect(response).toBeFalsy();
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post(`/builds/${buildID}/finish`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(400);

			return instance.finishBuild(buildID).catch(response => {
				expect(response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on bad input', () => {
			return instance.finishBuild().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('buildID');
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
				.get(`/builds/${buildID}/results`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, body);

			return instance.getBuildResults(buildID).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.get(`/builds/${buildID}/results`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(401);

			return instance.getBuildResults(buildID).catch(response => {
				expect(response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on bad input', () => {
			return instance.getBuildResults().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('buildID');
			});
		});
	});
});

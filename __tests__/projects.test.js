import VisWiz from '../src/sdk';
import nock from '../utils/nock';

let instance;

beforeEach(() => {
	instance = new VisWiz('foobar', {
		server: nock.SERVER,
	});
});

describe('projects methods', () => {
	const projectID = 'acbdef';
	const project = {
		id: 'abcdef',
		name: 'Foo Bar',
		url: 'http://github.com/foo/bar',
	};

	describe('getProjects', () => {
		it('resolves on successfull request', () => {
			const body = {
				projects: [project, project],
			};

			const scope = nock()
				.get('/projects')
				.reply(200, body);

			return instance.getProjects().then(response => {
				expect(response).toEqual(body.projects);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.get('/projects')
				.reply(401);

			return instance.getProjects().catch(response => {
				expect(response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('createProject', () => {
		const payload = {
			name: 'Foo Bar',
			url: 'http://github.com/foo/bar',
		};

		it('resolves on successfull request', () => {
			const body = project;

			const scope = nock()
				.post('/projects', payload)
				.reply(200, body);

			return instance.createProject(payload).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post('/projects', payload)
				.reply(400);

			return instance.createProject(payload).catch(response => {
				expect(response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on missing data', () => {
			return instance.createProject().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('params');
			});
		});
	});

	describe('getProjectNotifications', () => {
		it('resolves on successfull request', () => {
			const body = {
				emailEnabled: true,
				slackEnabled: false,
				slackURL: '',
			};

			const scope = nock()
				.get(`/projects/${projectID}/notifications`)
				.reply(200, body);

			return instance.getProjectNotifications(projectID).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.get(`/projects/${projectID}/notifications`)
				.reply(401);

			return instance.getProjectNotifications(projectID).catch(response => {
				expect(response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on missing data', () => {
			return instance.getProjectNotifications().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('projectID');
			});
		});
	});

	describe('updateProjectNotifications', () => {
		const notifications = {
			emailEnabled: false,
			slackEnabled: true,
			slackURL: 'http://foo.com/',
		};

		it('resolves on successfull request', () => {
			const scope = nock()
				.put(`/projects/${projectID}/notifications`)
				.reply(200, notifications);

			return instance
				.updateProjectNotifications(projectID, notifications)
				.then(response => {
					expect(response).toEqual(notifications);
					expect(scope.isDone()).toBeTruthy();
				});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.put(`/projects/${projectID}/notifications`)
				.reply(401);

			return instance
				.updateProjectNotifications(projectID, notifications)
				.catch(response => {
					expect(response.statusCode).toBe(401);
					expect(scope.isDone()).toBeTruthy();
				});
		});

		it('rejects on missing data', () => {
			return instance.updateProjectNotifications().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('projectID');
			});
		});
	});
});

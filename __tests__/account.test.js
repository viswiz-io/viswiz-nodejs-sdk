import VisWiz from '../es';
import nock from '../utils/nock';

let instance;

beforeEach(() => {
	instance = new VisWiz('foobar', {
		server: nock.SERVER,
	});
});

describe('account methods', () => {
	describe('getAccount', () => {
		test('resolves on successfull request', () => {
			const body = {
				id: 'abcdef',
				email: 'foo@bar.com',
			};

			const scope = nock()
				.get('/account')
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, body);

			return instance.getAccount().then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		test('rejects on error request', () => {
			const scope = nock()
				.get('/account')
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(401);

			return instance.getAccount().catch(err => {
				expect(err.response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('getWebhooks', () => {
		test('resolves on successfull request', () => {
			const body = {
				webhooks: [
					{
						createdAt: 'now',
						url: 'http://foo.com/bar',
					},
				],
			};

			const scope = nock()
				.get('/webhooks')
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, body);

			return instance.getWebhooks().then(response => {
				expect(response).toEqual(body.webhooks);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		test('rejects on error request', () => {
			const scope = nock()
				.get('/webhooks')
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(401);

			return instance.getWebhooks().catch(err => {
				expect(err.response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('createWebhook', () => {
		const payload = {
			url: 'http://foo.com/bar',
		};

		test('resolves on successfull request', () => {
			const body = {
				createdAt: 'now',
				url: 'http://foo.com/bar',
			};

			const scope = nock()
				.post('/webhooks', payload)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, body);

			return instance.createWebhook(payload).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		test('rejects on error request', () => {
			const scope = nock()
				.post('/webhooks', payload)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(400);

			return instance.createWebhook(payload).catch(err => {
				expect(err.response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		test('rejects on missing data', () => {
			return instance.createWebhook().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('params');
			});
		});
	});
});

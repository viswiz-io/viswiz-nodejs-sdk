import VisWiz from '../src/sdk';
import nock from '../utils/nock';

let instance;

beforeEach(() => {
	instance = new VisWiz('foobar', {
		server: nock.SERVER,
	});
});

describe('account methods', () => {
	describe('getAccount', () => {
		it('resolves on successfull request', () => {
			const body = {
				id: 123,
				email: 'foo@bar.com',
			};

			const scope = nock()
				.get('/account')
				.reply(200, body);

			return instance.getAccount().then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.get('/account')
				.reply(401);

			return instance.getAccount().catch(response => {
				expect(response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('getWebhooks', () => {
		it('resolves on successfull request', () => {
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
				.reply(200, body);

			return instance.getWebhooks().then(response => {
				expect(response).toEqual(body.webhooks);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.get('/webhooks')
				.reply(401);

			return instance.getWebhooks().catch(response => {
				expect(response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});
	});

	describe('createWebhook', () => {
		const payload = {
			url: 'http://foo.com/bar',
		};

		it('resolves on successfull request', () => {
			const body = {
				createdAt: 'now',
				url: 'http://foo.com/bar',
			};

			const scope = nock()
				.post('/webhooks', payload)
				.reply(200, body);

			return instance.createWebhook(payload).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post('/webhooks', payload)
				.reply(400);

			return instance.createWebhook(payload).catch(response => {
				expect(response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on missing data', () => {
			return instance.createWebhook().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('params');
			});
		});
	});
});

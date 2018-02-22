import VisWiz from '../es';
import nock from '../utils/nock';

let instance;

describe('options', () => {
	const body = {
		id: 'abcdef',
		email: 'foo@bar.com',
	};

	describe('api key', () => {
		it('uses parameter', async () => {
			const scope = nock()
				.get('/account')
				.matchHeader('Authorization', 'Bearer foo')
				.reply(200, body);

			instance = new VisWiz('foo', {
				server: nock.SERVER,
			});

			const response = await instance.getAccount();

			expect(response).toEqual(body);
			expect(scope.isDone()).toBeTruthy();
		});

		it('uses env', async () => {
			process.env.VISWIZ_API_KEY = 'bar';

			const scope = nock()
				.get('/account')
				.matchHeader('Authorization', 'Bearer bar')
				.reply(200, body);

			instance = new VisWiz(null, {
				server: nock.SERVER,
			});

			const response = await instance.getAccount();

			expect(response).toEqual(body);
			expect(scope.isDone()).toBeTruthy();
		});

		it('throws error on missing value', async () => {
			delete process.env.VISWIZ_API_KEY;

			expect(() => {
				instance = new VisWiz(null, {
					server: nock.SERVER,
				});
			}).toThrow();
		});
	});
});

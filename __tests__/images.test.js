import path from 'path';
import VisWiz from '../es';
import nock from '../utils/nock';

let instance;

beforeEach(() => {
	instance = new VisWiz('foobar', {
		server: nock.SERVER,
	});
});

describe('images methods', () => {
	const buildID = 'abcdef';
	const image = {
		name: 'Foo Bar',
		originalURL: 'http://foo.com/bar.png',
		thumbURL: 'http://foo.com/bar-thumb.png',
	};

	describe('getImages', () => {
		test('resolves on successfull request', () => {
			const body = {
				images: [image, image],
			};

			const scope = nock()
				.get(`/builds/${buildID}/images`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, body);

			return instance.getImages(buildID).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		test('rejects on error request', () => {
			const scope = nock()
				.get(`/builds/${buildID}/images`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(401);

			return instance.getImages(buildID).catch(err => {
				expect(err.response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		test('rejects on bad input', () => {
			return instance.getImages().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('buildID');
			});
		});
	});

	describe('createImage', () => {
		const filePath = path.resolve(__dirname, '../package.json');

		test('resolves on successfull request', () => {
			const scope = nock()
				.post(`/builds/${buildID}/images`, reqBody => {
					return (
						reqBody.match(/Content-Disposition: form-data; name="name"/) &&
						reqBody.match(/test-file-name/) &&
						reqBody.match(
							/Content-Disposition: form-data; name="image"; filename="package.json"/
						) &&
						reqBody.match(/Content-Type: application\/json/)
					);
				})
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, image);

			return instance.createImage(buildID, 'test-file-name', filePath).then(response => {
				expect(response).toEqual(image);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		test('retries and resolves after two 502 error and a 200 request', () => {
			const scope = nock()
				.post(`/builds/${buildID}/images`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(502)
				.post(`/builds/${buildID}/images`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(502)
				.post(`/builds/${buildID}/images`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, image);

			return instance.createImage(buildID, 'foo', filePath).then(response => {
				expect(response).toEqual(image);
				expect(scope.isDone()).toBeTruthy();
			});
		}, 10000);

		test('rejects on 400 error request', () => {
			const scope = nock()
				.post(`/builds/${buildID}/images`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(400);

			return instance.createImage(buildID, 'foo', filePath).catch(err => {
				expect(err.response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		test('retries and rejects on 502 error requests', () => {
			const scope = nock()
				.post(`/builds/${buildID}/images`)
				.matchHeader('Authorization', 'Bearer foobar')
				.times(3)
				.reply(502);

			return instance.createImage(buildID, 'foo', filePath).catch(err => {
				expect(err.response.statusCode).toBe(502);
				expect(scope.isDone()).toBeTruthy();
			});
		}, 10000);

		test('rejects on missing buildID', () => {
			return instance.createImage(null, 'foo', filePath).catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('buildID');
			});
		});

		test('rejects on missing name', () => {
			return instance.createImage(buildID, null, filePath).catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('name');
			});
		});

		test('rejects on missing filePath', () => {
			return instance.createImage(buildID, 'foo', null).catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('filePath');
			});
		});

		test('rejects on non-existent file', () => {
			return instance.createImage(buildID, 'foo', '/tmp/bogus.123456').catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('File not found');
			});
		});
	});
});

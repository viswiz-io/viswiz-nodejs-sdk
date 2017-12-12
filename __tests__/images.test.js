import path from 'path';
import VisWiz from '../sdk';
import nock from '../utils/nock';

let instance;

beforeEach(() => {
	instance = new VisWiz('foobar', {
		server: nock.SERVER,
	});
});

describe('images methods', () => {
	const buildID = 1234;
	const image = {
		name: 'Foo Bar',
		originalURL: 'http://foo.com/bar.png',
		thumbURL: 'http://foo.com/bar-thumb.png',
	};

	describe('getImages', () => {
		it('resolves on successfull request', () => {
			const body = {
				images: [image, image],
			};

			const scope = nock()
				.get('/builds/1234/images')
				.reply(200, body);

			return instance.getImages(buildID).then(response => {
				expect(response).toEqual(body);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.get('/builds/1234/images')
				.reply(401);

			return instance.getImages(buildID).catch(response => {
				expect(response.statusCode).toBe(401);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on bad input', () => {
			return instance.getImages().catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('buildID');
			});
		});
	});

	describe('createImage', () => {
		const filePath = path.resolve(__dirname, '../package.json');

		it('resolves on successfull request', () => {
			const body = image;

			const scope = nock()
				.post('/builds/1234/images', reqBody => {
					return (
						reqBody.match(/Content-Disposition: form-data; name="name"/) &&
						reqBody.match(/test-file-name/) &&
						reqBody.match(
							/Content-Disposition: form-data; name="image"; filename="package.json"/
						) &&
						reqBody.match(/Content-Type: application\/json/)
					);
				})
				.reply(200, body);

			return instance
				.createImage(buildID, 'test-file-name', filePath)
				.then(response => {
					expect(response).toEqual(body);
					expect(scope.isDone()).toBeTruthy();
				});
		});

		it('rejects on error request', () => {
			const scope = nock()
				.post('/builds/1234/images')
				.reply(400);

			return instance.createImage(buildID, 'foo', filePath).catch(response => {
				expect(response.statusCode).toBe(400);
				expect(scope.isDone()).toBeTruthy();
			});
		});

		it('rejects on missing buildID', () => {
			return instance.createImage(null, 'foo', filePath).catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('buildID');
			});
		});

		it('rejects on missing name', () => {
			return instance.createImage(buildID, null, filePath).catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('name');
			});
		});

		it('rejects on missing filePath', () => {
			return instance.createImage(buildID, 'foo', null).catch(err => {
				expect(err).toBeTruthy();
				expect(err.message).toMatch('filePath');
			});
		});

		it('rejects on non-existent file', () => {
			return instance
				.createImage(buildID, 'foo', '/tmp/bogus.123456')
				.catch(err => {
					expect(err).toBeTruthy();
					expect(err.message).toMatch('File not found');
				});
		});
	});
});

import path from 'path';
import VisWiz from '../es';
import nock from '../utils/nock';

const FIXTURES = path.resolve(__dirname, '..', '__fixtures__');

let instance;

function validateRequestBody(body, imageName, fileName) {
	const raw = Buffer.from(body, 'hex').toString();
	return (
		raw.includes('Content-Disposition: form-data; name="name"') &&
		raw.includes(imageName) &&
		raw.includes(
			`Content-Disposition: form-data; name="image"; filename="${fileName}"`
		)
	);
}

beforeEach(() => {
	instance = new VisWiz('foobar', {
		server: nock.SERVER,
	});
});

describe('buildWithImages', () => {
	const buildID = 'abcdef';
	const projectID = 'qwerty';

	const buildPayload = {
		branch: 'master',
		name: 'Foo Bar',
		revision: 'abcdef1234567890',
	};
	const build = Object.assign(
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

	describe('buildWithImages', () => {
		it('resolves on success', async () => {
			const scope = nock()
				.post(`/projects/${projectID}/builds`, buildPayload)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, Object.assign({ id: buildID }, build))
				.post(`/builds/${buildID}/images`, reqBody =>
					validateRequestBody(
						reqBody,
						'viswiz-100x100-white',
						'viswiz-100x100-white.png'
					)
				)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, image)
				.post(`/builds/${buildID}/images`, reqBody =>
					validateRequestBody(
						reqBody,
						'viswiz-favicon-32',
						'viswiz-favicon-32.png'
					)
				)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, image)
				.post(`/builds/${buildID}/images`, reqBody =>
					validateRequestBody(
						reqBody,
						'subfolder__viswiz-favicon-48',
						'viswiz-favicon-48.png'
					)
				)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200, image)
				.post(`/builds/${buildID}/finish`)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(200);

			await instance.buildWithImages(build, FIXTURES);

			expect(scope.isDone()).toBeTruthy();
		});

		it('throws when no files', async () => {
			await expect(instance.buildWithImages(build, __dirname)).rejects.toThrow(
				'images'
			);
		});

		it('rejects on error request', async () => {
			nock()
				.post(`/projects/${projectID}/builds`, buildPayload)
				.matchHeader('Authorization', 'Bearer foobar')
				.reply(400);

			await expect(instance.buildWithImages(build, FIXTURES)).rejects.toThrow(
				'400'
			);
		});
	});
});

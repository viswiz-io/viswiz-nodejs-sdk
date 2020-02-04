import VisWiz from '../es';
import nock from '../utils/nock';

const FIXTURES = './__fixtures__/';

let instance;

function validateRequestBody(body, fileName, imageName) {
	const raw = Buffer.from(body, 'hex').toString();
	return (
		raw.includes('Content-Disposition: form-data; name="name"') &&
		raw.includes(fileName) &&
		raw.includes(
			`Content-Disposition: form-data; name="image"; filename="${imageName}"`
		)
	);
}

beforeEach(() => {
	instance = new VisWiz('foobar', {
		server: nock.SERVER,
	});
});

describe('buildFolder', () => {
	const buildID = 'abcdef';
	const projectID = 'qwerty';

	const buildPayload = {
		branch: 'master',
		name: 'Foo Bar',
		revision: 'abcdef1234567890',
	};
	const build = {
		...buildPayload,
		projectID,
	};
	const image = {
		name: 'Foo Bar',
		originalURL: 'http://foo.com/bar.png',
		thumbURL: 'http://foo.com/bar-thumb.png',
	};

	['buildFolder', 'buildWithImages'].forEach(method => {
		describe(method, () => {
			it('resolves on success', async () => {
				const scope = nock()
					.post(`/projects/${projectID}/builds`, buildPayload)
					.matchHeader('Authorization', 'Bearer foobar')
					.reply(200, {
						id: buildID,
						...build,
					})
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
							'subfolder/viswiz-favicon-48',
							'viswiz-favicon-48.png'
						)
					)
					.matchHeader('Authorization', 'Bearer foobar')
					.reply(200, image)
					.post(`/builds/${buildID}/finish`)
					.matchHeader('Authorization', 'Bearer foobar')
					.reply(200);

				const progress = jest.fn();

				await instance[method](build, FIXTURES, progress);

				expect(progress).toHaveBeenCalledTimes(3);
				expect(progress).toHaveBeenCalledWith(1, 3);
				expect(progress).toHaveBeenCalledWith(2, 3);
				expect(progress).toHaveBeenCalledWith(3, 3);
				expect(scope.isDone()).toBeTruthy();
			});

			it('throws when no files', async () => {
				await expect(instance[method](build, __dirname)).rejects.toThrow(
					'No image files found in image directory!'
				);
			});

			it('rejects on error request', async () => {
				nock()
					.post(`/projects/${projectID}/builds`, buildPayload)
					.matchHeader('Authorization', 'Bearer foobar')
					.reply(400);

				await expect(instance[method](build, FIXTURES)).rejects.toThrow('400');
			});
		});
	});
});

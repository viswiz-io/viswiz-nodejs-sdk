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

	['buildFolder', 'buildWithImages'].forEach((method) => {
		describe(method, () => {
			test('resolves on success', async () => {
				const replies = [];
				const scope = nock()
					.post(`/projects/${projectID}/builds`, buildPayload)
					.matchHeader('Authorization', 'Bearer foobar')
					.reply(200, {
						id: buildID,
						...build,
					})
					.post(`/builds/${buildID}/images`, (reqBody) =>
						validateRequestBody(
							reqBody,
							'subfolder/viswiz-favicon-48',
							'viswiz-favicon-48.png'
						)
					)
					.matchHeader('Authorization', 'Bearer foobar')
					.reply((uri, requestBody, callback) => {
						replies.push(Date.now());
						setTimeout(() => callback(null, [200, image]), 50);
					})
					.post(`/builds/${buildID}/images`, (reqBody) =>
						validateRequestBody(
							reqBody,
							'viswiz-100x100-white',
							'viswiz-100x100-white.png'
						)
					)
					.matchHeader('Authorization', 'Bearer foobar')
					.reply((uri, requestBody, callback) => {
						replies.push(Date.now());
						setTimeout(() => callback(null, [200, image]), 25);
					})
					.post(`/builds/${buildID}/images`, (reqBody) =>
						validateRequestBody(
							reqBody,
							'viswiz-favicon-32',
							'viswiz-favicon-32.png'
						)
					)
					.matchHeader('Authorization', 'Bearer foobar')
					.reply(200, () => {
						replies.push(Date.now());
						return image;
					})
					.post(`/builds/${buildID}/finish`)
					.matchHeader('Authorization', 'Bearer foobar')
					.reply(200);

				const progress = jest.fn();

				await instance[method](build, FIXTURES, progress, 2);

				expect(replies).toHaveLength(3);
				// The first two requests should be performed concurrently
				expect(replies[1] - replies[0]).toBeLessThanOrEqual(10);
				// The third request should be performed after one of the first 2 finish
				expect(replies[2] - replies[0]).toBeGreaterThanOrEqual(25);

				expect(progress).toHaveBeenCalledTimes(3);
				expect(progress.mock.calls[0]).toEqual([1, 3]);
				expect(progress.mock.calls[1]).toEqual([2, 3]);
				expect(progress.mock.calls[2]).toEqual([3, 3]);

				expect(scope.isDone()).toBeTruthy();
			});

			test('throws when no files', async () => {
				await expect(instance[method](build, __dirname)).rejects.toThrow(
					'No image files found in image directory!'
				);
			});

			test('rejects on error request', async () => {
				nock()
					.post(`/projects/${projectID}/builds`, buildPayload)
					.matchHeader('Authorization', 'Bearer foobar')
					.reply(400);

				await expect(instance[method](build, FIXTURES)).rejects.toThrow('400');
			});
		});
	});
});

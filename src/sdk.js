import fs from 'fs';
import FormData from 'form-data';
import glob from 'glob';
import got from 'got';
import path from 'path';
import pkg from '../package.json';

class VisWiz {
	/**
	 * @class VisWiz
	 * @typicalname client
	 * @param {string} [apiKey] - The API Key value for a VisWiz.io account
	 *
	 * If omitted, the environment variable `VISWIZ_API_KEY` will be used
	 * @param {object} [options]
	 * @param {string} [options.server=https://api.viswiz.io] - The server URL prefix for all requests
	 *
	 * @example
	 * const client = new VisWiz('your-unique-api-key-here');
	 *
	 * // Assuming environment variable VISWIZ_API_KEY is set
	 * const client = new VisWiz();
	 */
	constructor(apiKey, options) {
		this.apiKey = apiKey || process.env.VISWIZ_API_KEY;
		this.server =
			(options && options.server) ||
			process.env.VISWIZ_SERVER ||
			'https://api.viswiz.io';

		if (!this.apiKey) {
			throw new Error('Missing API key value!');
		}
	}

	/**
	 * Execute a HTTP request
	 *
	 * @private
	 * @param {string} method - http method
	 * @param {string} path - path for the request
	 * @param {object} body - body parameters / object
	 * @param {object} [headers] - header parameters
	 */
	_request(method, path, body, headers) {
		const url = this.server + path;
		const options = {
			body,
			headers,
			json: typeof body === 'object' && !(body instanceof FormData),
			method,
		};

		return got(url, options).then(response => {
			const { body } = response;
			let parsed = body;

			if (!options.json) {
				try {
					parsed = JSON.parse(body);
				} catch (err) {
					// Nothing to do here
				}
			}

			return parsed;
		});
	}

	/**
	 * Get the list of required headers for an API request
	 *
	 * @private
	 * @param {object} [additionalHeaders={}] - headers object
	 */
	_getHeaders(additionalHeaders) {
		return Object.assign(
			{
				Accept: 'application/json',
				Authorization: 'Bearer ' + this.apiKey,
				'Content-Type': 'application/json',
				'User-Agent': `viswiz-nodejs-sdk/${pkg.version} (${
					pkg.repository.url
				})`,
			},
			additionalHeaders || {}
		);
	}

	/**
	 * Get the current account information
	 *
	 * @method
	 * @returns {Promise}
	 * @fulfil {object} - The current account object
	 *
	 * @example
	 * const account = await client.getAccount();
	 */
	getAccount() {
		return this._request('GET', '/account', null, this._getHeaders());
	}

	/**
	 * Get the list of webhooks configured for the account.
	 *
	 * @method
	 * @returns {Promise}
	 * @fulfil {array<object>} - The list of webhooks objects
	 *
	 * @example
	 * const webhooks = await client.getWebhooks();
	 */
	getWebhooks() {
		return this._request('GET', '/webhooks', null, this._getHeaders()).then(
			results => results.webhooks
		);
	}

	/**
	 * When a build comparison is finished a POST HTTP request will be triggered towards all
	 * webhooks configured for the account.
	 *
	 * @method
	 * @param {object} params
	 * @returns {Promise}
	 * @fulfil {object} - The new webhook object
	 *
	 * @example
	 * const webhook = await client.createWebhook({
	 *   name: 'My first webhook',
	 *   url: 'http://amazing.com/webhook-handler'
	 * });
	 */
	createWebhook(params) {
		if (!params) {
			return Promise.reject(new Error('Missing required parameter: params'));
		}

		return this._request('POST', '/webhooks', params, this._getHeaders());
	}

	/**
	 * Get a list of all the projects for the account.
	 *
	 * @method
	 * @returns {Promise}
	 * @fulfil {array<object>} - The list of projects objects
	 *
	 * @example
	 * const projects = await client.getProjects();
	 */
	getProjects() {
		return this._request('GET', '/projects', null, this._getHeaders()).then(
			results => results.projects
		);
	}

	/**
	 * Create a new project for the account.
	 *
	 * @method
	 * @param {object} params
	 * @returns {Promise}
	 * @fulfil {object} - The new project object
	 *
	 * @example
	 * const project = await client.createProject({
	 *   baselineBranch: 'master',
	 *   name: 'My Amazing Project',
	 *   url: 'http://github.com/amaze/project'
	 * });
	 */
	createProject(params) {
		if (!params) {
			return Promise.reject(new Error('Missing required parameter: params'));
		}

		return this._request('POST', '/projects', params, this._getHeaders());
	}

	/**
	 * Get the notifications settings for a project.
	 *
	 * @method
	 * @param {string} projectID - The requested project ID
	 * @returns {Promise}
	 * @fulfil {array<object>} - The notifications settings
	 *
	 * @example
	 * const notifications = await client.getProjectNotifications('mwwuciQG7ETAmKoyRHgkGg');
	 */
	getProjectNotifications(projectID) {
		if (!projectID) {
			return Promise.reject(new Error('Missing required parameter: projectID'));
		}

		const path = `/projects/${projectID}/notifications`;

		return this._request('GET', path, null, this._getHeaders());
	}

	/**
	 * Update the notifications settings for a project.
	 *
	 * @method
	 * @param {string} projectID - The requested project ID
	 * @param {object} params
	 * @param {string} [params.emailEnabled] - Controls if email reports are sent on new builds
	 * @param {string} [params.slackEnabled] - Controls if Slack notifications are sent on new builds
	 * @param {string} [params.slackURL] - The Slack webhook URL to use for sending notifications
	 * @returns {Promise}
	 * @fulfil {array<object>} - The updated notifications settings
	 *
	 * @example
	 * const build = await client.updateProjectNotifications('mwwuciQG7ETAmKoyRHgkGg', {
	 *   emailEnabled: false,
	 *   slackEnabled: true,
	 *   slackURL: 'https://hooks.slack.com/services/FOO/BAR/A18759GACAsgawg351ac',
	 * });
	 */
	updateProjectNotifications(projectID, params) {
		if (!projectID) {
			return Promise.reject(new Error('Missing required parameter: projectID'));
		}

		const path = `/projects/${projectID}/notifications`;

		return this._request('PUT', path, params, this._getHeaders());
	}

	/**
	 * Get a list of all the builds for a project.
	 *
	 * @method
	 * @param {string} projectID - The requested project ID
	 * @returns {Promise}
	 * @fulfil {array<object>} - The list of builds objects
	 *
	 * @example
	 * const builds = await client.getBuilds('mwwuciQG7ETAmKoyRHgkGg');
	 */
	getBuilds(projectID) {
		if (!projectID) {
			return Promise.reject(new Error('Missing required parameter: projectID'));
		}

		const path = `/projects/${projectID}/builds`;

		return this._request('GET', path, null, this._getHeaders()).then(
			results => results.builds
		);
	}

	/**
	 * Create a new build for a project.
	 *
	 * @method
	 * @param {object} build
	 * @param {string} build.branch - The branch name for this build
	 * @param {string} build.projectID - The requested project ID
	 * @param {string} build.name - The commit name for this build
	 * @param {string} build.revision - The revision for this build
	 * @returns {Promise}
	 * @fulfil {object} - The new build object
	 *
	 * @example
	 * const build = await client.createBuild({
	 *   branch: 'master',
	 *   projectID: 'mwwuciQG7ETAmKoyRHgkGg',
	 *   name: 'New amazing changes',
	 *   revision: '62388d1e81be184d4f255ca2354efef1e80fbfb8'
	 * });
	 */
	createBuild(build) {
		if (!build || !build.projectID) {
			return Promise.reject(new Error('Missing required parameter: projectID'));
		}

		const path = `/projects/${build.projectID}/builds`;

		const body = Object.assign({}, build);
		delete body.projectID;

		return this._request('POST', path, body, this._getHeaders());
	}

	/**
	 * Finish a build when all images have been created. This triggers the actual build comparison to execute.
	 *
	 * @method
	 * @param {string} buildID - The requested build ID
	 * @returns {Promise}
	 *
	 * @example
	 * await client.finishBuild('gjVgsiWeh4TYVseqJsU6ev');
	 */
	finishBuild(buildID) {
		if (!buildID) {
			return Promise.reject(new Error('Missing required parameter: buildID'));
		}

		const path = `/builds/${buildID}/finish`;

		return this._request('POST', path, null, this._getHeaders());
	}

	/**
	 * Get the results for a build which has been compared to another build.
	 *
	 * @method
	 * @param {string} buildID - The requested build ID
	 * @returns {Promise}
	 * @fulfil {object} - The build results object
	 *
	 * @example
	 * const buildResults = await client.getBuildResults('gjVgsiWeh4TYVseqJsU6ev');
	 */
	getBuildResults(buildID) {
		if (!buildID) {
			return Promise.reject(new Error('Missing required parameter: buildID'));
		}

		const path = `/builds/${buildID}/results`;

		return this._request('GET', path, null, this._getHeaders());
	}

	/**
	 * Get a list of all images for a build.
	 *
	 * @method
	 * @param {string} buildID - The requested build ID
	 * @returns {Promise}
	 * @fulfil {array<object>} - The list of images objects
	 *
	 * @example
	 * const images = await client.getImages('gjVgsiWeh4TYVseqJsU6ev');
	 */
	getImages(buildID) {
		if (!buildID) {
			return Promise.reject(new Error('Missing required parameter: buildID'));
		}

		const path = `/builds/${buildID}/images`;

		return this._request('GET', path, null, this._getHeaders());
	}

	/**
	 * Upload a new image for a build. This endpoint accepts only one PNG image per request.
	 *
	 * @method
	 * @param {string} buildID - The requested build ID
	 * @param {string} name - The image name
	 * @param {string} filePath - The image file path
	 * @returns {Promise}
	 * @fulfil {object} - The new image object
	 *
	 * @example
	 * const image = await client.createImage('gjVgsiWeh4TYVseqJsU6ev', 'image-name', '/path/to/image.png');
	 */
	createImage(buildID, name, filePath) {
		if (!buildID) {
			return Promise.reject(new Error('Missing required parameter: buildID'));
		}
		if (!name) {
			return Promise.reject(new Error('Missing required parameter: name'));
		}
		if (!filePath) {
			return Promise.reject(new Error('Missing required parameter: filePath'));
		}
		if (!fs.existsSync(filePath)) {
			return Promise.reject(new Error('File not found: ' + filePath));
		}

		const path = `/builds/${buildID}/images`;

		const form = new FormData();
		form.append('name', name);
		form.append('image', fs.createReadStream(filePath));

		return this._request(
			'POST',
			path,
			form,
			this._getHeaders(form.getHeaders())
		);
	}

	/**
	 * Creates a new build and uploads all images (`*.png`) found in a folder
	 *
	 * @method
	 * @param {object} build
	 * @param {string} build.branch - The branch name for this build
	 * @param {string} build.projectID - The requested project ID
	 * @param {string} build.name - The commit name for this build
	 * @param {string} build.revision - The revision for this build
	 * @param {object} folderPath
	 * @returns {Promise}
	 *
	 * @example
	 * await client.buildWithImages({
	 *   branch: 'master',
	 *   projectID: 'mwwuciQG7ETAmKoyRHgkGg',
	 *   name: 'New amazing changes',
	 *   revision: '62388d1e81be184d4f255ca2354efef1e80fbfb8'
	 * }, '/path/to/folder/with/images');
	 */
	buildWithImages(build, folderPath) {
		let buildID;

		const imageFiles = glob.sync(path.join(folderPath, '*.png'));
		if (!imageFiles.length) {
			return Promise.reject(new Error('No images files available!'));
		}

		return this.createBuild(build)
			.then(build => {
				buildID = build.id;

				return imageFiles.reduce((chain, imageFile) => {
					const name = path.basename(imageFile, '.png');

					return chain.then(() => this.createImage(buildID, name, imageFile));
				}, Promise.resolve());
			})
			.then(() => this.finishBuild(buildID))
			.then(() => buildID);
	}
}

export default VisWiz;

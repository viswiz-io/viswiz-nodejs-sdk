const fs = require('fs');
const FormData = require('form-data');
const got = require('got');
const pkg = require('./package.json');

const SERVER_URL = 'https://api.viswiz.io';

class VisWiz {
	/**
	 * @class VisWiz
	 * @typicalname client
	 * @param {string} apiKey - The API Key value for a VisWiz.io account
	 * @param {object} [options]
	 * @param {string} [options.server=api.viswiz.io] - The server URL prefix for all requests
	 *
	 * @example
	 * const client = new VisWiz('your-unique-api-key-here');
	 */
	constructor(apiKey, options) {
		this.apiKey = apiKey || 'MISSING';
		this.server = (options && options.server) || SERVER_URL;
	}

	/**
	 * Execute a HTTP request
	 *
	 * @private
	 * @param {string} method - http method
	 * @param {string} url - url to do request
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
	 * @param {object} body
	 * @returns {Promise}
	 * @fulfil {object} - The new project object
	 *
	 * @example
	 * const project = await client.createProject({
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
	 * @param {object} params
	 * @param {string} params.projectID - The requested project ID
	 * @returns {Promise}
	 * @fulfil {object} - The new build object
	 *
	 * @example
	 * const build = await client.createBuild({
	 *   projectID: 'mwwuciQG7ETAmKoyRHgkGg',
	 *   name: 'New amazing changes',
	 *   revision: '62388d1e81be184d4f255ca2354efef1e80fbfb8'
	 * });
	 */
	createBuild(params) {
		if (!params || !params.projectID) {
			return Promise.reject(new Error('Missing required parameter: projectID'));
		}

		const path = `/projects/${params.projectID}/builds`;

		delete params.projectID;

		return this._request('POST', path, params, this._getHeaders());
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
}

module.exports = VisWiz;

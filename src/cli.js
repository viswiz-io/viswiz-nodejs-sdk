/* eslint no-console: 0 */

import program from 'commander';
import VisWiz from './sdk';
import Progress from './Progress';
import { error, getCI, log } from './utils';
import pkg from '../package.json';

const commands = {
	async build(program, cmd) {
		const ci = getCI();

		const { apiKey, project } = program;

		if (!apiKey) {
			return error('Error: Missing API key!', program);
		}
		if (!project) {
			return error('Error: Missing project ID!', program);
		}
		if (!cmd.imageDir) {
			return error('Error: Missing image directory!', cmd);
		}
		if (!cmd.branch && !ci.branch) {
			return error('Error: Missing branch name!', cmd);
		}
		if (!cmd.message && !ci.message) {
			return error('Error: Missing commit message!', cmd);
		}
		if (!cmd.revision && !ci.commit) {
			return error('Error: Missing commit revision!', cmd);
		}

		const client = new VisWiz(apiKey);
		let progress;

		log('Creating build on VisWiz.io...');

		const buildID = await client.buildWithImages(
			{
				branch: cmd.branch || ci.prBranch || ci.branch,
				name: cmd.message || ci.message,
				projectID: project,
				revision: cmd.revision || ci.commit,
			},
			cmd.imageDir,
			(current, total) => {
				if (!progress) {
					progress = new Progress(total, current);
				} else {
					progress.tick();
				}
			}
		);

		const url = `https://app.viswiz.io/projects/${project}/build/${buildID}/results`;

		log('Done!');
		log(`Build report will be available at: ${url}`);

		return 'OK';
	},
};

function run(argv) {
	program.version(pkg.version);

	program
		.option(
			'-k, --api-key [apiKey]',
			'The API key of a VisWiz account to use. Defaults to VISWIZ_API_KEY env.',
			process.env.VISWIZ_API_KEY
		)
		.option(
			'-p, --project [projectID]',
			'The ID of a VisWiz project to use. Defaults to VISWIZ_PROJECT_ID env.',
			process.env.VISWIZ_PROJECT_ID
		)
		.command('build')
		.description(
			'Creates a new build on VisWiz.io and sends images for regression testing.'
		)
		.option(
			'-i, --image-dir <path>',
			'The path to a directory (scanned recursively) with images used for the build.'
		)
		.option(
			'-b, --branch [branch name]',
			'The branch name for the build. Auto-detected on popular CIs.'
		)
		.option(
			'-m, --message [commit message]',
			'The commit message for the build. Auto-detected on popular CIs.'
		)
		.option(
			'-r, --revision [rev]',
			'The revision for the build. Auto-detected on popular CIs.'
		)
		.action(cmd =>
			commands.build(program, cmd).catch(err => error(`Error: ${err.message}`))
		);

	program.parse(argv);
}

module.exports = {
	commands,
	run,
};
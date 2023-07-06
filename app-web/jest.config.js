const tsPreset = require('ts-jest/jest-preset')
const puppeteerPreset = require('jest-puppeteer/jest-preset')

require('dotenv').config({path: '../.env'});

// Increase max listeners for process, since Puppeteer * 16 parallel processees triggers MaxListenersExceededWarning errors. Doing it here will make sure every child process will use it.
process.setMaxListeners(process.getMaxListeners() * (process.env.TEST_NUM_PROCESSES || 3) * 2);

// Export config.
const isInPHPStorm = process.env.XPC_SERVICE_NAME?.startsWith('application.com.jetbrains.PhpStorm');

module.exports = {
	...tsPreset,
	...puppeteerPreset,

	//"testRegex": "stripe-.*\\.spec\\.js",
	"testRegex": ".*\\.spec\\.(js|ts)",

	"transform": {
		"^.+\\.(ts|tsx)$": "ts-jest"
	},

	// todo: Limited by /scripts/startParallelTestServices.js. We should import that value in this script, or an .env value in both scripts
	maxWorkers: isInPHPStorm ? 1 : (process.env.TEST_NUM_PROCESSES || 3),
	"reporters": [
		"default",
		["./node_modules/jest-html-reporter", {
			"pageTitle": "Test Report",
			"includeFailureMsg": true,
			"includeSuiteFailure": true
		}],
		["jest-html-reporters", {
			"publicPath": "./html-report",
			"filename": "app-web-report.html",
			"openReport": true,
			"inlineSource": true
		}]
	]
};

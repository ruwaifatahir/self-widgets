const {configure, waitFor} = require("puppeteer-testing-library");
const {setDefaultOptions} = require("expect-puppeteer");
const Timeout = require("await-timeout");
const axios = require("axios");
const https = require("https");
const fs = require("fs");

const {attachOnDuplicateUpdate} = require("knex-on-duplicate-update");
const pti = require("puppeteer-to-istanbul");

require("dotenv").config();

attachOnDuplicateUpdate();

/**
 * Gives the base url, respecting the Jest worker. It will affect the port to the Vite server.
 *
 * @returns {string}
 */
function getBaseUrl(path) {
	return convertTestUrl(process.env.APP_URL, 5050) + path;
}

function runningInJenkins()
{
	return process.env.RUNNING_IN_JENKINS === 'true'
}

/**
 * Gives the engine url, respecting the Jest worker.
 *
 * @returns {string}
 */
function getEngineUrl(path) {
	return convertTestUrl(process.env.VITE_ENGINE_URL, 3000) + path;
}

function convertTestUrl(url, port) {
	var newUrl = new URL(url);

	newUrl.port = port + parseInt(process.env.JEST_WORKER_ID);

	return newUrl.toString().replace(/\/$/, '');
}

function getStoragePath(path = '') {
	// Determine full path.
	let fullPath = process.cwd() + '/../app-engine/storage/test-' + process.env.JEST_WORKER_ID + path;

	// Make sure dir exists. Storage dirs can be empty, w/o the structure of the normal storage dir.
	let dir = fullPath;

	if (dir.split('/').pop().includes('.'))
		dir = dir.split('/').slice(0, -1).join('/');

	if (!fs.existsSync(dir))
		fs.mkdirSync(dir, {recursive: true});

	// Return full path.
	return fullPath;
}

/**
 * Inits the database, respecting the Jest worker. It will affect the database catalog on the db server.
 */
function initDatabase() {
	// Init connection.
	const knex = require('knex')({
		client: 'mysql2',
		connection: {
			host: '127.0.0.1',
			port: 3306,
			user: process.env.DB_USERNAME || 'root',
			password: process.env.DB_PASSWORD || '',
			database: 'test_' + parseInt(process.env.JEST_WORKER_ID),
		},
	});

	// Kill the connection after every test.
	afterAll(async () => await knex.destroy());

	// Return connection.
	return knex;
}

function getUnsecureAxiosConfig() {
	return {
		httpsAgent: new https.Agent({
			rejectUnauthorized: false,
		}),
	};
}

/*async function initBrowser() {

	// Reset page.
	//await jestPuppeteer.resetBrowser();

	// Reset local storage.
	await page.goto(getBaseUrl('/img/common/logo/full-white.svg'), {waitUntil: ['networkidle0', 'domcontentloaded']});

	// Clear LocalStorage.
	await page.evaluate(() => window.localStorage.clear());

	// Check if loaded correctly.
	const data = await page.evaluate(() => document.querySelector('*').outerHTML);

	if (!data.includes('enable-background:new 0 0 1047.9 252.1;'))
		throw new Error('Page was not loaded!');

	// Set new page in Puppeteer Testing Library.
	//configure({page: global.page});
}*/

function initPageIsolation() {

	async function awaitTimeout(fn, label, timeoutFn = null) {
		const timer = new Timeout();
		try {
			await Promise.race([
				fn(),
				timer.set(10000, 'Timeout in ' + label + '!')
			]);
		} catch (ex) {
			if (timeoutFn) {
				const timer = new Timeout();
				try {
					await Promise.race([
						timeoutFn(),
						timer.set(10000, 'Timeout in ' + label + '!')
					]);
				} catch (ex) {
				} finally {
					timer.clear();
				}
			}
		} finally {
			timer.clear();
		}
	}

	async function retry(fn, amount = 5) {
		for (let i = 0; i < amount; i++) {
			try {
				await fn();

				return;
			} catch (ex) {
				if (i + 1 === amount)
					throw ex;

				else {
					console.info(process.env.JEST_WORKER_ID + " retry");

					await new Promise(r => setTimeout(r, 1000));
				}
			}
		}
	}

	//let consoleLog = [];

	/*beforeEach(async () => {

		// Clear console log.
		consoleLog = [];

		// Clear blockchain and database.
		let url = getEngineUrl('/app/debug/reset-state');

		try {
			await awaitTimeout(async () => {
				await axios.post(url, null, getUnsecureAxiosConfig());
			}, 'reset-state');
		} catch (e) {
			// @note Needed otherwise Jest would throw socket JSON circular serialization exceptions.
			console.error(url, e.message, e.code);

			throw new Error('Error resetting state via engine! \n' + url + ', ' + e.message + ', ' + e.code);
		}

		//
		//configure({page: global.page});
	});
	*/

	afterEach(async () => {
		// Navigate, to stop all requests and Vue logic. This avoids new/running requests before we reset the engine, which can generate unexpected errors.
		await page.goto(getBaseUrl('/img/common/logos/LOGO-ORIGINAL-1-1.png'), {waitUntil: ['networkidle0', 'domcontentloaded']});
	});

}

function initTimeouts() {

	// Used for Hooks and complete it()'s
	jest.setTimeout(60 * 1000);

	// Does NOT apply on the total test. Unknown purpose.
	setDefaultOptions({timeout: 30 * 1000});

	// Does NOT apply to selector timeouts. Unknown purpose.
	page.setDefaultTimeout(30 * 1000);

	// Does apply to selector timeouts.
	configure({timeout: 15 * 1000});
}

async function cleanScreenshotAndLog(name) {
	let testBaseFilename = process.cwd() + '/test/output/' + name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

	for (let extension of ['jpg', 'log']) {
		let file = testBaseFilename + '.' + extension;

		if (fs.existsSync(file))
			fs.unlinkSync(file);
	}
}

async function screenshotAndLogPage(name, consoleLog) {

	// Abort due to no page? Browser crash?
	if (!page)
		return;

	// Try to take a screenshot.
	let testBaseFilename = process.cwd() + '/test/output/' + name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

	if (testBaseFilename.length > 255)
		testBaseFilename = testBaseFilename.slice(0, 125) + '---' + testBaseFilename.slice(-126);

	try {
		await waitFor(async () => await page.screenshot({
			path: testBaseFilename + '.jpg',
			fullPage: true,
		}));
	} catch (ex) {
		console.error({testBaseFilename}, ex);
	}

	// Try to write console dump
	try {
		fs.writeFileSync(testBaseFilename + '.log', consoleLog.join("\n"));
	} catch (ex) {
		console.error(ex);
	}

	// Try to write DOM state.
	try {
		let html = await page.evaluate(() => document.documentElement.outerHTML);

		fs.writeFileSync(testBaseFilename + '.htm', html);
	} catch (ex) {
		console.error(ex);
	}
}

let consoleLog = [];

function initFailHandling() {

	// Skip due to already set?
	//if (global.it._overriden)
	//	return;

	let oldIt = global.it;

	global.it = async (name, func, timeout) => {
		return await oldIt(name, async () => {

			// Clean test artifacts.
			let testName = expect.getState().currentTestName;

			await cleanScreenshotAndLog(testName);

			try {
				return await func();
			} catch (ex) {

				// Log exception.
				console.info('XError in test "' + name + "'");
				console.info(ex);

				// Log last selector.
				let puppeteerHelpers = require('./puppeteerHelpers').puppeteerHelpers;

				console.info(process.env.JEST_WORKER_ID + ': Last selector: ', puppeteerHelpers.getLastSelector() + (puppeteerHelpers.getLastSelector() ? ' or ' + puppeteerHelpers.resolveSelector(puppeteerHelpers.getLastSelector()) : ''));

				// Try to screenshot.
				try {
					await screenshotAndLogPage(testName, consoleLog);
				} catch (ex) {
					console.error('Could not screenshot!')
				}

				// Rethrow
				throw ex;
			}

		}, timeout);
	};

	global.it.todo = oldIt.todo;
	global.it.only = oldIt.only;

	// Requirement administrative helpers.
	global.it.skipNotRelevant = (name) => oldIt.skip(name, () => {
	});

	global.it.skipTestedByOtherRequirements = global.it.skipNotRelevant;
	global.it.skipUntestable = global.it.skipNotRelevant;
	global.it.skipTestedByEngine = global.it.skipNotRelevant;

	// Log console.
	consoleLog = [];

	page.on('console', (msg) => {
		consoleLog.push(JSON.stringify({
			type: msg.type(),
			text: msg.text(),
			stackTrace: msg.stackTrace(),
		}));
	});
}

/*global.it = Object.assign(async (name, func, timeout) => {
	return await test(name, async () => {
		try {
			await func();
		} catch (ex) {
			console.info(process.env.JEST_WORKER_ID + ': Last selector: ', require('./puppeteerHelpers').puppeteerHelpers.getLastSelector())

			throw ex;
		}
	});
}, test);*/

/*
// Override it()
global.it = Object.assign(async (name, func, timeout) => {

	return await test(name, async () => {
		let testName = expect.getState().currentTestName;

		let page = global.page;

		await cleanScreenshotAndLog(testName);

		try {
			await func();
		} catch (e) {

			console.info(process.env.JEST_WORKER_ID + ': Test fail', e);
			console.info(process.env.JEST_WORKER_ID + ': Last selector: ', require('./puppeteerHelpers').puppeteerHelpers.getLastSelector())


			if (page != global.page)
				console.info('Different page?!');

			if (global.page) {
				try {
					await screenshotAndLogPage(testName, consoleLog);
				} catch (ex) {
					console.error('Could not screenshot!')
				}
			}

			try {
				await page.close();
				await browser.close();
			} catch (ex) {
			}

			throw e;
		}

	}, timeout);
}, test);

// @ugly Store it's overriden.
global.it._overriden = true;
*/

initPageIsolation();
initTimeouts();
initFailHandling();

// Exports
module.exports = {
	getBaseUrl,
	getEngineUrl,
	getStoragePath,
	getUnsecureAxiosConfig,
	knex: initDatabase(),
	runningInJenkins
};

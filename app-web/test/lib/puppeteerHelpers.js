const {getBaseUrl, getEngineUrl} = require("./parallel");
const getPixels = require("get-pixels");
const {before, last} = require("lodash");
const {waitFor, find, configure, findAll} = require("puppeteer-testing-library");
const {setDefaultOptions} = require("expect-puppeteer");
const _ = require("lodash");
const {debug} = require("util");
const colorDifference = require("color-difference");
const fs = require("fs");
const pti = require('puppeteer-to-istanbul')

let lastSelector;

async function waitForSafe(fn, options = {}) {
	let oldPage = page;

	await waitFor(async () => {

		if (page !== oldPage) {
			console.info('Abort due to different page in test "' + expect.getState().currentTestName + '"?')

			return;
		}

		try {
			await fn();
		} catch (ex) {
			//console.info('waitForSafe() catched error', ex.message || ex)

			throw ex;
		}
	}, options || {timeout: 10000});
}

/**
 * @example let address = await puppeteerHelpers.waitForValue(() => window.TestRegistry.get('lib.AuthManager').walletAddress);
 */
async function waitForValue(func, ...args) {
	try {
		return await (
			await page.waitForFunction(func, {
				timeout: 10000,
			}, ...args)
		).jsonValue();
	} catch (ex) {
		console.info('waitForValue() for func: ', func, ex)

		throw ex;
	}
}

async function waitForValuePage(func, page, ...args) {
	return await (
		await page.waitForFunction(func, {
			timeout: 10000,
		}, ...args)
	).jsonValue();
}

async function expectMissingSelector(selector) {
	lastSelector = selector;

	return await runForSingleOrArray(selector, async selector => {
		await waitForSafe(async () => {

			// Throw error due to found?
			if (await page.$(selector))
				throw new Error('Element found!')
		});
	});
}

async function runForSingleOrArray(selector, func) {
	lastSelector = selector;

	let selectors = Array.isArray(selector) ? selector : [selector];
	let last;

	for (let subSelector of selectors) {

		try {
			last = await func(resolveSelector(subSelector));
		} catch (ex) {
			throw new Error(ex + ' for selector "' + subSelector + '" which resolves to "' + resolveSelector(subSelector) + '"');
		}
	}

	return last;
}

async function waitForText(selector, expectedText = undefined, options = {}) {

	lastSelector = selector;

	let oldPage = page;

	// Error due to invalid string given?
	if (expectedText === undefined || typeof expectedText != 'string')
		throw new Error('No string given for expectedText arg!');

	// Test
	return await runForSingleOrArray(selector, async selector => {

		try {
			return await waitForSafe(async () => {

				// Get text.
				let text = await getTextOfElement(await page.$(selector))

				// Is missing?
				if (options.missing) {
					if (options.contains && !text.includes(expectedText))
						return true;

					else if (!options.contains && text != expectedText)
						return true;

					else
						throw new Error('Text is still visible!');
				}

				// Use this func as an expector?
				else if (expectedText !== undefined) {

					// Partial match?
					if (options.contains && text.includes(expectedText))
						return true;

					// Exact match?
					else if (!options.contains && text === expectedText)
						return true;

					else
						throw new Error('Not found expected text "' + expectedText + '" (yet), but found the text: "' + text  + '"');
				}
				// Or just return the current text?
				else
					return text;
			});
		} catch (ex) {
			console.error('waitForText() error', {
				testName: expect.getState().currentTestName,
				selector,
				expectedText,
				options,
				didSee: await getTextOfElement(await page.$(selector)),
				pageEqualsOldPage: oldPage === page,
			});

			// Rethrow
			throw ex;
		}
	});
}

async function elementShouldBeVisible(selector) {
	lastSelector = selector;

	return await runForSingleOrArray(selector, async selector => {

		// Expect exists in DOM.
		await waitForVisible(selector);

		// Expect if is in viewport.
		let element = await page.$(selector);

		expect(await element.isIntersectingViewport()).toBeTruthy();

		// Expect correct styling.
		// @author https://stackoverflow.com/a/60142240
		await page.evaluate((selector) => {
			var e = document.querySelector(selector);
			var style = window.getComputedStyle(e);

			return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
		}, selector);
	});
}

async function elementShouldHavePropertyValue(selector, property, value) {
	lastSelector = selector;

	// @ugly needs to wait for some time so the properties can load
	await waitForVueUpdate();

	return await runForSingleOrArray(selector, async selector => {
		await waitForVisible(selector);

		let element = await page.$(selector);

		let propertyValue = await element.evaluate(
			(element, property) => {
				return getComputedStyle(element).getPropertyValue(property);
			},
			property
		);

		expect(propertyValue).toBe(value.toString());
	});
}

async function waitForVisible(selector, options = {}) {
	lastSelector = selector;

	return await runForSingleOrArray(selector, async selector => {
		return await findAll({selector}, options);
	});
}

async function waitForVisibleAmount(selector, amount) {
	lastSelector = selector;

	expect(
		(await findAll({
			selector: resolveSelector(selector)
		}))
			.length).toBe(amount);
}

async function waitForToast(toast) {
	await waitForText('@layout-Notifications @title', toast.title);
}

async function waitAndClick(selector, options = {}) {
	lastSelector = selector;

	return await runForSingleOrArray(selector, async selector => {

		// TODO Medium: Does this always apply?
		// Make sure we don't click on a disabled button?
		selector += ':not([disabled])';

		// Find and click.
		do {
			try {

				// Get element.
				let element = await find({selector});

				// Scroll to element?
				if (options?.scroll !== false)
					await page.evaluate(selector => {
						document.querySelector(selector).scrollIntoView();
					}, selector);

				// Give Vue updating (DOM patching) a chance.
				await waitForVueUpdate();

				// Click on element.
				await element.click();

				// Abort, clicking is succeeded since it did not throw an exception.
				break;
			} catch (e) {

				// Retry, due to waiting on an animation probably?
				if (!e.message?.includes('Node is either not clickable or not an HTMLElement') && !e.message?.includes('Node is detached from document') && !e.message?.includes('Cannot read properties of null')) {
					throw e;
				}
			}
		} while (true);
	});
}

async function waitAndHover(selector) {
	lastSelector = selector;

	return await runForSingleOrArray(selector, async selector => {
		do {
			try {

				// Get element.
				let element = await find({ selector });

				// Scroll to element.
				await page.evaluate(selector => {
					document.querySelector(selector).scrollIntoView();
				}, selector);

				// Give Vue updating (DOM patching) a chance.
				await waitForVueUpdate();

				// Click on element.
				await element.hover();

				// Abort, clicking is succeeded since it did not throw an exception.
				break;
			} catch (e) {

				// Retry, due to waiting on an animation probably?
				if (!e.message?.includes('Node is either not hoverable or not an HTMLElement') && !e.message?.includes('Node is detached from document') && !e.message?.includes('Cannot read properties of null')) {
					throw e;
				}
			}
		} while (true);
	});
}

async function waitAndType(selector, value, overwriteInput = false, waitingTime = 200, waitForVue = true) {
	lastSelector = selector;

	return await runForSingleOrArray(selector, async selector => {

		// Get element.
		let element = await find({ selector });

		if (waitForVue) {
			await waitForVueUpdate();
		}

		if (overwriteInput) {
			let element = await find({selector});
			await element.click({clickCount: 3});
			await debugPause(waitingTime);
		}

		// Type
		await element.type(value);

		// @ugly
		await debugPause(waitingTime);
	});
}

async function waitAndTypeSlowly(selector, value, overwriteInput = false) {
	lastSelector = selector;
	let timeBetweenActions = 50;

	return await runForSingleOrArray(selector, async selector => {

		if (overwriteInput) {
			let element = await find({selector});
			await element.click({clickCount: 3});
			await debugPause(timeBetweenActions);
		}

		for (let i = 0; i < value.length; i++) {
			await waitAndType(selector, value[i], timeBetweenActions, false);
		}

	});
}

async function waitForVueUpdate() {

	// @ugly Just a wait, not really known when Vue is updated.
	await new Promise(resolve => setTimeout(resolve, 333));
}

// @ugly Use tokenizer next time.
// Gives @ selector support, as seen by Laravel Dusk.
function resolveSelector(selector) {
	lastSelector = selector;

	let result = '';
	let isInAt = false;
	let lastChar = null;

	for (let char of selector) {
		if (isInAt) {
			if ([' ', ':', '[', '.'].indexOf(char) !== -1) {
				result += '"]' + char;

				isInAt = false;
			} else
				result += char;
		} else if (char === '@') {
			if (lastChar === null || lastChar === ' ')
				result += '*';

			result += '[data-testid="';
			isInAt = true;
		} else
			result += char;

		lastChar = char;
	}

	if (isInAt)
		result += '"]';

	lastSelector = selector;

	return result;
}

async function goTo(url) {
	// Convert relative url to right webapp url?
	if (!url.includes('://'))
		url = getBaseUrl(url);

	await global.page.goto(url);
}

/**
 * @example await puppeteerHelpers.gotoAndWaitForLoaded(getBaseUrl('/'));
 */
async function gotoAndWaitForLoaded(url, options = {}) {

	// Convert relative url to right webapp url?
	if (!url.includes('://'))
		url = getBaseUrl(url);

	// Go to
	let page = options.page || global.page;

	let waitUntil = [options.networkidle0 !== false ? 'networkidle0' : null, 'domcontentloaded', 'load'].filter(Boolean);

	const navigationPromise = page.waitForNavigation({waitUntil});

	await page.goto(url, {waitUntil});

	await navigationPromise;

	// @ugly Navigating with vue router does not trigger reloading, so above waitUntil does not kick in? Lets wait for changed url first.
	await page.waitForFunction(url => document.location.href.endsWith(url) && document.readyState === "complete", {}, url);
}

async function clearSessionData() {

	// Go to the domain.
	await page.goto(getBaseUrl('/img/common/logos/LOGO-ORIGINAL-1-1.png'), {waitUntil: ['networkidle0', 'domcontentloaded']});

	// Clear LocalStorage.
	await page.evaluate(() => window.localStorage.clear());

	// Reset the layers and always start an app with both layers. Can be overwritten by setting this again before loading the map
	await page.evaluate(() => window.localStorage.setItem('layersManager.currentLayers', JSON.stringify(['domains', 'certificates'])));
}

function initAutoClearSession() {
	beforeEach(async () => await clearSessionData());
}

let exposedFunctions = {
	registered: [],
	handlers: {},
};

async function exposeFunctionEx(name, fn) {

	// Expose function? This can only be done once..
	if (!exposedFunctions.registered.includes(name)) {
		await page.exposeFunction(name, async (...args) => {

			// Abort due to handler does not exists?
			if (!exposedFunctions.handlers[name]) {
				return;
			}

			// Call handler.
			return await exposedFunctions.handlers[name](...args);
		});

		exposedFunctions.registered.push(name);
	}

	// Set func.
	exposedFunctions.handlers[name] = fn;
}

function initExposeFunctions() {
	beforeEach(() => exposedFunctions.handlers = {});
}

function initTestData() {

	// Expose test name.
	beforeEach(async () => {
		await exposeFunctionEx('_test_TestingTestName', () => expect.getState().currentTestName);
	});
}

initExposeFunctions();
initTestData();

/**
 * Helper to pause the browser, so we can debug.
 */
function debugPause(duration = -1) {

	// TODO High: Does not work - still timeouts after the initial 20s.
	if (duration == -1) {
		let timeout = 999999999;

		jest.setTimeout(timeout);

		// Per action timeouts.
		setDefaultOptions({timeout});
		page.setDefaultTimeout(timeout);
		configure({timeout});

		jest.clearAllTimers();
	}

	return new Promise(resolve => {

		// Resolve eventually?
		if (duration > 0)
			setTimeout(resolve, duration);

	});
}

async function getCenterPixelsOfElement(selector) {

	// Get element.
	selector = resolveSelector(selector);

	await waitForVisible(selector);

	let element = await page.$(selector);

	// Get bounding rect.
	let boundingRect = await element.evaluate(element => {
		const {top, left, bottom, right} = element.getBoundingClientRect();
		return {top, left, bottom, right};
	});

	// Calculate center.
	return {
		x: Math.round(boundingRect.left + (boundingRect.right - boundingRect.left) / 2),
		y: Math.round(boundingRect.top + (boundingRect.bottom - boundingRect.top) / 2),
	};
}

async function getPixelColor(x, y) {
	return (await getPixelColors([{x, y}]))[0];
}

function getPixelColors(pxs) {
	return new Promise(async resolve => {

		// Determine path.
		// let path = "/tmp/screenshot" + process.env.JEST_WORKER_ID + ".png";
		let path = "/tmp/screenshot" + process.env.JEST_WORKER_ID + (Math.random() + 1).toString(36).substring(7) + ".png";

		// Take a screenshot.
		try {
			await page.screenshot({
				path,
				fullPage: true,
			});

			//await new Promise(resolve => setTimeout(resolve, 1000));
		} catch (ex) {
			console.info('getPixelColors() error screenshotting', expect.getState().currentTestName);
			console.info(ex);
			throw ex;
		}

		// Get pixel color.
		getPixels(path, function (err, pixels) {

			let result = [];

			const r = pixels.get(201, 26, 0);
			const g = pixels.get(201, 26, 1);
			const b = pixels.get(201, 26, 2);

			for (let px of pxs) {

				// Get color components.
				const r = pixels.get(px.x, px.y, 0);
				const g = pixels.get(px.x, px.y, 1);
				const b = pixels.get(px.x, px.y, 2);

				// Resolve as hex notation.
				const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
					const hex = x.toString(16)
					return hex.length === 1 ? '0' + hex : hex
				}).join('')

				result.push(rgbToHex(r, g, b));
			}

			resolve(result);
		});

	});
}

async function getTextOfElement(element) {

	if (typeof element === 'string')
		element = await find({selector: resolveSelector(element)});

	return (await getPropertyOfElement(element, 'innerText')).trim();
}

async function getPropertyOfElement(element, property) {
	return await element.evaluate(
		(element, property) => {
			let value = element[property];

			if (typeof value === 'string')
				value = element[property].trim();

			return value;
		},
		property
	);
}

let consoleErrors = [];
let ignoreAjaxErrors = {};
let ignoreConsoleErrors = [];

function initPageErrors() {

	// Reset
	beforeEach(() => {

		// Reset state,
		consoleErrors = [];
		ignoreAjaxErrors = {};
		ignoreConsoleErrors = [];
	});

	// Reset AJAX errors to ignore.
	afterEach(async () => {

		// Abort due to no errors?
		if (consoleErrors.length == 0)
			return;

		// Fail expect.
		expect(consoleErrors).toEqual([]);
	});
}

// Listen for new tabs.
browser.on('targetcreated', async (target) => {

	// Abort due to no page created?
	let page = _.last(await browser.pages());

	if (!page)
		return;

	// TODO Medium: Check if not already listening?
	// Listen for console messages.
	let currentTestName = expect.getState().currentTestName;

	page.on('response', async response => {

		// Log?
		let status = response.status();
		let url = response.url();
		let path = '/' + url.split('/').splice(3).join('/');
		let data;

		try {
			data = await response.text();
		} catch (ex) {
		}

		if (status >= 400 && url.includes(getEngineUrl('/')) && !ignoreAjaxErrors[path + ':' + status])
			console.error('Not ignored engine AJAX error!', {
				status,
				ignoreAjaxErrors,
				currentTestName,
				currentTestName2: expect.getState().currentTestName,
				url: response.url(),
				postData: response.request().postData(),
				data,
				path,
			})
	});

	page.on('console', async (msg) => {

		// Abort due to not an error?
		if (msg._type != 'error')
			return;

		// Skip AJAX error?
		else if (msg._text?.includes('Failed to load resource: the server responded')) {

			let url = '/' + msg._stackTraceLocations[0].url.split('/').splice(3).join('/')
			let httpStatus = msg._text.split('a status of ')[1].split(' (')[0];

			if (ignoreAjaxErrors[url + ':' + httpStatus])
				return;
		}

		// Skip 400 Bad Request's - those are validation exceptions of NestJS.
		else if (msg._text?.includes('Failed to load resource: the server responded with a status of 400 (Bad Request)'))
			return;

		// Get error message.
		let errorMsg = msg._args[0]?._remoteObject?.description || msg._text || 'Unknown error';

		// Skip console error?
		if (_.find(ignoreConsoleErrors, error => errorMsg.includes(error)))
			return;

		// Log
		console.error('Browser error:', {
			errorMsg,
			currentTestName,
		}, msg);

		// TODO Critical: Remove if itself.
		// @ugly
		if (!errorMsg.includes('Failed to load resource'))
			consoleErrors.push(errorMsg);
	});

});

function ignoreAjaxError(url, httpCode) {

	// Invalid url given?
	if (url.substring(0, 1) != '/')
		throw new Error('Url must start with a /');

	// Set
	ignoreAjaxErrors[url + ':' + httpCode] = true;
}

function ignoreConsoleError(messageLike) {
	ignoreConsoleErrors.push(messageLike);
}

async function expectFakeUrlOfDialog(url, options = {}) {

	// Get path faked.
	let page = options.page || global.page;

	let currentDefaultPath = await waitForValuePage(() => TestRegistry.get('router').currentRoute.value.matched?.[1].currentDefaultPath, page);

	// Expect
	expect(currentDefaultPath).toBe(url);
}

async function waitForPath(path) {
	await page.waitForFunction(path => document.location.pathname === path, {}, path);
}

async function waitForAttrValueOnElement(selector, attribute, value) {
	lastSelector = selector;

	await waitForSafe(async () => {
		let element = await find({selector: resolveSelector(selector)});

		expect(await getPropertyOfElement(element, attribute)).toBe(value);
	});
}

async function waitForAttrContainsValueOnElement(selector, attribute, value) {
	lastSelector = selector;

	await waitForSafe(async () => {
		let element = await find({selector: resolveSelector(selector)});

		expect(await getPropertyOfElement(element, attribute)).toContain(value);
	});
}

async function waitForAttrDoesNotContainsValueOnElement(selector, attribute, value) {
	lastSelector = selector;

	await waitForSafe(async () => {
		let element = await find({selector: resolveSelector(selector)});

		expect(await getPropertyOfElement(element, attribute)).not.toContain(value);
	});
}

async function waitForCssClass(selector, classes, options = {}) {
	lastSelector = selector;

	await waitForSafe(async () => {
		let element = await find({selector: resolveSelector(selector)});

		let realClasses = await getPropertyOfElement(element, 'className');

		if (typeof classes === 'string')
			classes = classes.split(' ');

		for (let klass of classes) {
			if (options?.missing)
				expect(realClasses.includes(klass)).toBeFalsy();

			else
				expect(realClasses).toContain(klass);
		}
	}, options.waitForSave);
}

async function assertCssClassesAreMissing(selector, classes)
{
	// Wait for 2 seconds, because we want to make sure the app has the time to set / remove some classes
	await new Promise(resolve => setTimeout(resolve, 2000));

	await waitForCssClass(selector, classes, {missing: true})
}

async function waitForPixelColor(x, y, expectedColor, options = {}) {
	await waitForSafe(async () => {

		// Get some test points.
		let pxs = [];
		let pxMargin = options.pxMargin === 0 ? 0 : (parseInt(options.pxMargin) || 10);

		for (let x2 = x - pxMargin; x2 <= x + pxMargin; x2 += 1) {
			for (let y2 = y - pxMargin; y2 <= y + pxMargin; y2 += 1) {
				pxs.push({
					x: Math.round(x2),
					y: Math.round(y2),
				});
			}
		}

		// Get colors of picked pixels.
		let colors = await getPixelColors(pxs);

		// Check if we got a match.
		for (let color of colors) {

			// Get color diff.
			let colorDiff = colorDifference.compare(color, expectedColor, undefined);

			// Is correct color?
			if (colorDiff < (options.tolerance || 5))
				return expect(true).toBeTruthy();
		}

		// No match
		expect('Expected color not found!').toBe({
			x, y, expectedColor, colors, options
		});

	});
}

async function expectDownload(clickOnSelector) {

	// Prepare empty download dir.
	let downloadPath = '/tmp/self-widgets-' + process.env.JEST_WORKER_ID + '-' + (new Date()).getTime() + '/';

	fs.mkdirSync(downloadPath);

	for (let file of fs.readdirSync(downloadPath))
		fs.unlinkSync(file);

	// Download
	await page._client().send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath,
	});

	await waitAndClick(clickOnSelector);

	// Check if download exists.
	for (let i = 0; i < 25 && fs.readdirSync(downloadPath).length == 0; i++)
		await new Promise(r => setTimeout(r, 500));

	expect(fs.readdirSync(downloadPath).length).toBe(1);

	// Cleanup
	fs.rmSync(downloadPath, {recursive: true, force: true});
}

async function expectNewTabWithUrl(url) {
	// @ugly To give the browser a chance to open the PDF.
	await new Promise(r => setTimeout(r, 2000));
	await waitFor(async () => last(await browser.pages()));

	let pages = await browser.pages();
	
	expect(last(pages).url().includes(url)).toBeTruthy();
	await last(pages).close();
}

async function makeGpuSettingsScreenshot() {
	let screenshotPath = '/tmp/gpu_stats-' + (new Date()).getTime() + '.png';

	await page
		.goto('chrome://gpu', {waitUntil: 'networkidle0', timeout: 20 * 60 * 1000})
		.catch(e => console.log(e));
	await page.screenshot({
		path: screenshotPath
	});
}

async function waitForUrl(url) {
	return await this.waitForValue(url => window.location.href.includes(url), url)
}

async function focusElement(selector) {
	return await runForSingleOrArray(selector, async selector => {
		await page.focus(selector);
	})
}

async function reloadPage() {
	const waitUntil = ["networkidle0", "domcontentloaded"]

	const navigationPromise = page.waitForNavigation({waitUntil});

	await page.reload({waitUntil});

	await navigationPromise;
}

async function openNewTabAndUseAsActiveTab()
{
	// Apparently we overwrite a const, but this still works (or did when I wrote it).
	global.page = await browser.newPage()
	await global.page.bringToFront()

	return global.page;
}

async function setPageAsActiveTab(pageToSet) {
	global.page = pageToSet
	await global.page.bringToFront()
	return global.page;
}

async function waitForValueOfInput(selector, value)
{
	return await runForSingleOrArray(selector, async selector => {
		await waitForSafe(async () => {

			const foundValue = await page.evaluate(selector => document.querySelector(selector).value, selector);
			expect(foundValue).toBe(value)
		});
	});
}

initAutoClearSession();
initPageErrors();

// Module export.
module.exports = {
	puppeteerHelpers: {
		waitForValue,
		expectMissingSelector,
		resolveSelector,

		waitForSafe,
		waitForText,
		waitForVisible,
		waitForVisibleAmount,
		waitForToast,
		waitAndClick,
		waitAndHover,
		waitAndType,
		waitAndTypeSlowly,
		waitForVueUpdate,
		waitForUrl,

		goTo,
		gotoAndWaitForLoaded,
		clearSessionData,
		debugPause,
		getCenterPixelsOfElement,
		getPixelColor,
		getPixelColors,
		getTextOfElement,
		getPropertyOfElement,
		ignoreAjaxError,
		ignoreConsoleError,
		expectFakeUrlOfDialog,
		waitForPath,
		waitForAttrValueOnElement,
		waitForAttrContainsValueOnElement,
		waitForAttrDoesNotContainsValueOnElement,
		waitForCssClass,
		assertCssClassesAreMissing,
		waitForPixelColor,
		expectDownload,
		expectNewTabWithUrl,
		makeGpuSettingsScreenshot,
		elementShouldBeVisible,
		elementShouldHavePropertyValue,
		focusElement,

		exposeFunctionEx,

		getLastSelector: () => lastSelector,
		reloadPage,
		openNewTabAndUseAsActiveTab,
		setPageAsActiveTab,
		waitForValueOfInput
	},
};

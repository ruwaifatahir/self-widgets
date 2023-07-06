const {puppeteerHelpers} = require("./puppeteerHelpers");
let hooks = {};
let loaded = false;

async function _init() {

	// Set as loaded.
	loaded = true;

	// Expose function to get hook ids.
	await puppeteerHelpers.exposeFunctionEx('testing_hooks_ids', () => Object.keys(hooks));

	// Expose function for a hit.
	await puppeteerHelpers.exposeFunctionEx('testing_hooks_hit', async (id, context) => {

		// Execute hook.
		await hooks[id].hookFn(context);

		// Resolve waitForHook();
		hooks[id].resolve();

		delete hooks[id];
	});

}

function reset() {
	hooks = {};
}

/**
 * @example
 *
 *         await puppeteerHelpers.waitForHook(
 *             'pages.map.lib.MapManager.startMap',
 *             async () => {
 *
 *                 // Go to map and see loader.
 *                 await puppeteerHelpers.gotoAndWaitForLoaded('/map');
 *             },
 *             async () => {
 *
 *                 // Expect loader.
 *                 await page.waitForSelector('[data-testid="pages-map-MapControl"] [data-testid="loader"]');
 *             });
 *
 *         // Continue
 *
 */
async function executeHook(id, prepareFn, hookFn) {

	// Init?
	if (!loaded)
		await _init();

	// Call prepare fn after soon.
	setTimeout(prepareFn, 1);

	// Return promise to let this callee wait.
	return new Promise(resolve => {
		hooks[id] = {
			hookFn,
			resolve,
		};
	});
}

beforeEach(() => reset());

// Module export.
module.exports = {
	hookHelpers: {
		executeHook,
	},
};

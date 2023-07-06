const {puppeteerHelpers} = require("./../../lib/puppeteerHelpers");
const {widgetHelpers} = require("../../lib/widgetHelpers");

// @see https://laveto.monday.com/boards/4487410310/pulses/4742514399
describe('As visitor I can use a resolve widget on any website', () => {

	// @see https://laveto.monday.com/boards/4487410310/pulses/4754738327
	it('Shows an introduction to the concept of SELF', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @intro');
	});

});

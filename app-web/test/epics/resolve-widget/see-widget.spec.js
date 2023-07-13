const {puppeteerHelpers} = require("./../../lib/puppeteerHelpers");
const {widgetHelpers} = require("../../lib/widgetHelpers");

// @see https://laveto.monday.com/boards/4487410310/pulses/4742514399
describe('As visitor I can use a resolve widget on any website', () => {

	// @see https://laveto.monday.com/boards/4487410310/pulses/4754738327
	it('Shows an introduction to the concept of SELF', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @intro');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755815064
	it('Shows a link to the website of SELF', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @link');
		await puppeteerHelpers.waitForAttrContainsValueOnElement('@widgets-ResolveWidget @link', 'href', 'https://selfcrypto.io/');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @link');
		await puppeteerHelpers.expectNewTabWithUrl('https://selfcrypto.io');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4742515485
	it('Shows name field', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @name');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4742515773
	it('Shows check button', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @check');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4742517380
	it('Press on check button resolves the name using the blockchain RPC', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmartAcceptance');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @name-success');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @name-success', 'Is available');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755789046
	it('Show possiblity to retry to resolve another name', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmartAcceptance');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @name-success');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @name-success', 'Is available');
		await puppeteerHelpers.waitForAttrDoesNotContainsValueOnElement('@widgets-ResolveWidget @name', 'disabled', 'disabled');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4742536230
	it('The widget is embeddable on any website', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget');
		//await puppeteerHelpers.elementShouldBeVisible('iframe');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4742536701
	// Not testable
	it('The widget is hosted at SELF', async () => {
		// await widgetHelpers.loadWidget({type: 'resolve'});
		// await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget');
		// await puppeteerHelpers.elementShouldBeVisible('iframe');
		//await puppeteerHelpers.waitForAttrContainsValueOnElement('iframe', 'src', 'https://selfcrypto.io/');
		// await puppeteerHelpers.waitForAttrContainsValueOnElement('iframe', 'src', '/index.html');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4742547856
	// @todo: how to test this?
	it('The widget is available on a standalone test page', async () => {

	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4742536701
	// Not testable
	it('The widget is responsive', async () => {
		// await widgetHelpers.loadWidget({type: 'resolve'});
		// await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget');

		// Set the viewport to 500px x 500px
		// await puppeteerHelpers.setViewport({width: 500, height: 500});

		// Check if all elements are visible
		// await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @intro');
		// await puppeteerHelpers.isVisibleInViewport('@widgets-ResolveWidget @intro');

		// await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @link');
		// await puppeteerHelpers.isVisibleInViewport('@widgets-ResolveWidget @link');

		// await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @name');
		// await puppeteerHelpers.isVisibleInViewport('@widgets-ResolveWidget @name');

		// await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @check');
		// await puppeteerHelpers.isVisibleInViewport('@widgets-ResolveWidget @check');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4754726390
	it('The widget is available in white and dark mode', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget');
		await puppeteerHelpers.waitForCssClass('@widgets-ResolveWidget @widget', 'dark:text-white');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755827897
	it('A name has a maximum of 40 characters', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @name');
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', '1234567890123456789012345678901234567890', true);
		await puppeteerHelpers.waitForValueOfInput('@widgets-ResolveWidget @name', '1234567890123456789012345678901234567890');

		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', '123456789012345678901234567890123456789012');
		await puppeteerHelpers.waitForValueOfInput('@widgets-ResolveWidget @name', '1234567890123456789012345678901234567890', true);
	});

});

describe('As a visitor I can see that the name is in use', () => {

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755787475
	it('Shows the NFT name', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmart');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @nftName', 'walmart');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755736488
	// @see https://laveto.monday.com/boards/4487410310/pulses/4755782902
	it('Shows the NFT image', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmart');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitForAttrContainsValueOnElement('@widgets-ResolveWidget @nftImage', 'src', 'https://ipfs.io/ipfs/bafybeihu4z7xmerke6arp5r2lboppavhiieciul6jtlcn5k4fkknhm5mgu/walmart.png');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755784304
	// @todo fix this test
	it('If image is unavailable: shows SELF logo', async () => {

	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755805096
	it('Shows link to the minting of the NFt on the blockchain', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmart');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitForAttrContainsValueOnElement('@widgets-ResolveWidget @Bitcoin @explorerLink', 'href', 'https://www.blockchain.com/explorer/addresses/btc//1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjRg');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @Bitcoin @explorerLink');
		await puppeteerHelpers.expectNewTabWithUrl('https://www.blockchain.com/explorer/addresses/btc//1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjRg');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755752555
	it('Show all NFT addresses', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmart');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @Bitcoin');
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @Ripple');
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @Klever');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755753972
	it('Show per NFT address the wallet address', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmart');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @Bitcoin @walletAddress', '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjRg');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @Ripple @walletAddress', 'NQ80XQ51AYBGXU4M7JSHT4A9LV8LU7P0MGSB!');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @Klever @walletAddress', 'NQ80XQ51AYBGXU4M7JSHTas4A9LV8LU7P0MGSB!');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755755964
	it('Show per NFT address the name of the network', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmart');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @Bitcoin @networkName', 'Bitcoin');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @Ripple @networkName', 'Ripple');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @Klever @networkName', 'Klever');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755756902
	// TODO: fix this test. Not all networks have an icon
	it('Shows per address: the icon of the network', async () => {

	});

	it('Show copy button per address', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmart');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @Bitcoin @copy');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @Bitcoin @walletAddress', '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjRg');
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @Ripple @copy');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @Ripple @walletAddress', 'NQ80XQ51AYBGXU4M7JSHT4A9LV8LU7P0MGSB!');
		await puppeteerHelpers.waitForVisible('@widgets-ResolveWidget @Klever @copy');
		await puppeteerHelpers.waitForText('@widgets-ResolveWidget @Klever @walletAddress', 'NQ80XQ51AYBGXU4M7JSHTas4A9LV8LU7P0MGSB!');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755776360
	it('Show per address the link to the explorer', async () => {
		await widgetHelpers.loadWidget({type: 'resolve'});
		await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmart');
		await puppeteerHelpers.waitAndClick('@widgets-ResolveWidget @check');
		await puppeteerHelpers.waitForAttrContainsValueOnElement('@widgets-ResolveWidget @Bitcoin @explorerLink', 'href', 'https://www.blockchain.com/explorer/addresses/btc//1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjRg');
		await puppeteerHelpers.waitForAttrContainsValueOnElement('@widgets-ResolveWidget @Ripple @explorerLink', 'href', 'https://xrpscan.com/account//NQ80XQ51AYBGXU4M7JSHT4A9LV8LU7P0MGSB!');
		//await puppeteerHelpers.waitForAttrContainsValueOnElement('@widgets-ResolveWidget @Klever @explorerLink', 'href', 'https://explorer.klever.io/tx/0x6b175474e89094c44da98b954');
	});

	// @see https://laveto.monday.com/boards/4487410310/pulses/4755760849
	// @todo: fix this test
	it('If no addresses are present: shows no addresses available (yet)', async () => {
		// await widgetHelpers.loadWidget({type: 'resolve'});
		// await puppeteerHelpers.waitAndType('@widgets-ResolveWidget @name', 'walmart');
		// await puppeteerHelpers.click('@widgets-ResolveWidget @check');
		// await puppeteerHelpers.elementShouldNotExist('@widgets-ResolveWidget @Bitcoin');
		// await puppeteerHelpers.elementShouldNotExist('@widgets-ResolveWidget @Ripple');
	});
});

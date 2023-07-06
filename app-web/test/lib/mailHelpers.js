const {MailhogClient} = require("mailhog-awesome");
const htmlparser2 = require("htmlparser2");
const CSSselect = require("css-select");
const retry = require('retry-assert');

let mailhog;

function initMailhog() {

	// Init client.
	mailhog = new MailhogClient({
		host: 'localhost',
	});

	// Start each test with a clean inbox.
	beforeEach(async () => {
		await mailhog.deleteEmails({
			from: 'Jest worker ' + process.env.JEST_WORKER_ID + ' <jest-' + process.env.JEST_WORKER_ID + '@test.com>',
		});
	});
}

async function getLastEmail(filterOptions = {}) {

	// Error due to not initialized?
	if (!mailhog)
		throw new Error('Mailhog not initialized. Call initMailhog() from your test first!');

	// Try to get email.
	return await retry()
		.fn(async () => mailhog.getLastEmail({
			from: 'Jest worker ' + process.env.JEST_WORKER_ID + ' <jest-' + process.env.JEST_WORKER_ID + '@test.com>',
			...filterOptions
		}))
		.withTimeout(10000)
		.until(email => expect(email).toBeTruthy());
}

function getEmailHtmlSelectorText(email, cssSelector) {

	// Abort due to element not found in HTML?
	const dom = htmlparser2.parseDocument(email.html);

	let element = CSSselect.selectOne(cssSelector, dom);

	if (!element)
		throw new Error('Element not found!');

	// Get and trim text.
	return (element.children[0]).data.replaceAll("\r", '')
		.replaceAll("\n", '')
		.trim();
}

function getEmailHtmlSelectorElement(email, cssSelector) {

	// Abort due to element not found in HTML?
	const dom = htmlparser2.parseDocument(email.html);

	return CSSselect.selectOne(cssSelector, dom);
}

module.exports = {
	initMailhog,
	getLastEmail,
	getEmailHtmlSelectorText,
	getEmailHtmlSelectorElement,
}

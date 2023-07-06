const {puppeteerHelpers} = require("./puppeteerHelpers");
const {findAll} = require("puppeteer-testing-library");
const _ = require('lodash');

async function testForNoDeadLinks(options)
{
	// Browse
	await puppeteerHelpers.gotoAndWaitForLoaded(options.url);

	// Collect all links.
	let foundLinks = [];

	for(let element of await findAll({ selector: 'a' }))
		foundLinks.push(await page.evaluate(element => element.getAttribute('href'), element));

	foundLinks = _.uniq(foundLinks);

	// Process each found link.
	for(let [url, expector] of Object.entries(options.links))
	{
		try {

			// Search for relevant links.
			let foundLinksForThisUrl = [];

			let populateElements = async () => {
				foundLinksForThisUrl = await findAll({selector: 'a[href="' + url + '"]'});
			};

			await populateElements();

			if (foundLinksForThisUrl.length === 0) {
				console.info('No foundLinksForThisUrl found for url:', url)

				expect(foundLinksForThisUrl.length).toBeGreaterThan(0);
			}

			// Process each link.
			for (let i = 0; i < foundLinksForThisUrl.length; i++) {

				// Click
				await foundLinksForThisUrl[i].click();

				if (typeof expector === 'string')
					await puppeteerHelpers.waitForVisible(expector);

				else
					await expector();

				// Go back?
				if(!(await page.url()).endsWith(options.url))
					await page.goBack();

				await populateElements();

				//
				_.pull(foundLinks, url);
			}
		}
		catch(ex)
		{
			console.error('Error processing url "' + url + '"');

			throw ex;
		}
	}

	// Assert all links are tested.
	console.info('Rest found links:', foundLinks);

	expect(foundLinks.length).toBe(0);
}

module.exports = {
	contentHelpers: {
		testForNoDeadLinks,
	},
};

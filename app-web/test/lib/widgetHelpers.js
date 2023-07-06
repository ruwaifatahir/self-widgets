const {puppeteerHelpers} = require("./puppeteerHelpers");

async function loadWidget(options)
{
	let context = {
		id: 1,
		options,
	};

	await puppeteerHelpers.gotoAndWaitForLoaded('/index.html?context=' + encodeURIComponent(JSON.stringify(context)), { networkidle0: false });
}

module.exports = {
	widgetHelpers: {
		loadWidget,
	},
};

const {launchArgs} = require('puppeteer-testing-library');

module.exports = {
	launch: {
		args: launchArgs([

			// Dev:
			'--window-size=1500,960',
			//'--auto-open-devtools-for-tabs',

			'--explicitly-allowed-ports=' + [...Array(17).keys()].map(i => 5050 + i).join(','),

			// For lav-skylar.
			'--ignore-certificate-errors',
			'--ignore-gpu-blocklist',
			'--enable-gpu-rasterization',
			'--enable-zero-copy',

			// Test recording:
			/*
			'--window-position=100,100',
			'--window-size=1500,1180',
			*/
		]),
		defaultViewport: {

			// Dev:
			height: 900,

			// Test recording:
			//height: 1180,

			width: 1500,
		},
		ignoreHTTPSErrors: true,
		headless: false, // True doesn't work somehow.
	},

	browserContext: 'incognito',
	browserPerWorker: true,
	exitOnPageError: false,
}

const { knex } = require("../lib/parallel");

describe('app.testable', () => {

    it('has a valid jest worker id', async () => {

        // Expect we have a Jest worker id.
        expect(parseInt(process.env.JEST_WORKER_ID)).toBeGreaterThan(0);
    });

    it('has a correct local connection to the database', async () => {
        expect(knex.client.database()).toBe('test_' + process.env.JEST_WORKER_ID);
    });

    it.todo('will use the correct chain RPC url in the browser'/*, async function () {

        // Load app.
        await page.goto(getBaseUrl('/'), {waitUntil: 'networkidle0'});

        // Get blockchain RPC url.
		let rpcUrl = await page.evaluate(_ => {
			return window.TestRegistry.get('lib.Signer2').providerRpc.connection.url;
		});

		// Expect
		let jestWorkerId = parseInt(process.env.JEST_WORKER_ID);

		expect(rpcUrl).toContain(':' + (8545 + jestWorkerId));

	}*/);

});

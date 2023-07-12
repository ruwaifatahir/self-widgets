import axios from "axios";

export default new class Testing {

	public init() {
		this.disableCssTransitions();
		this.initAxios();
	}

	get isTesting(): boolean {

		// is testing env (Jenkins)?
		if (import.meta.env.VITE_APP_ENV === 'testing')
			return true;

		// Is parallel testing on dev machine?
		let port = parseInt(window.location.port);

		return !isNaN(port) && port > 5050;
	}

	get jestWorkerId(): number {
		return parseInt(window.location.port) - 5050;
	}

	transformPortForJestTesting(url: string): string {

		// Parse url.
		let newUrl = new URL(url);

		// Increase port by worker id?
		if (this.isTesting) {
			newUrl.port = '' + (parseInt(newUrl.port) + this.jestWorkerId);
		}

		// Return new url.
		return newUrl.toString();
	}

	private disableCssTransitions() {

		return;

		// Abort due to not testing?
		if (!this.isTesting)
			return;

		// Wait for DOM loaded.
		document.addEventListener("DOMContentLoaded", () => {

			// Disable transitions via style.
			const style = document.createElement('style');
			style.textContent = '* { transition: none !important; }';
			document.head.append(style);

		});
	}

	public initAxios() {

		// Abort due to not testing, or test name retriever not available? Might be missing when we debug a test manually via Chrome.
		if (!this.isTesting || !(window as any)._test_TestingTestName)
			return;

		// Set header on every Axios request.
		axios.interceptors.request.use(async (config: any) => {

			// Check if working locally and not in parallel mode.
			// TODO Medium: change?
			if (window.location.port === '5000') {
				// Get and set test name as header.
				(config as any).headers.test_name = (await (window as any)._test_TestingTestName()).replace(/[^a-z0-9]/gi, ' ');
			}

			// Pipe
			return config;
		});
	}

}

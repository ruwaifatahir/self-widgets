import * as Sentry from '@sentry/vue';
import {BrowserTracing} from '@sentry/tracing';
import type {App} from "vue";


export default new class SentryManager {

	public init(app: App) {

		// Abort due to not configured?
		if (!import.meta.env.VITE_SENTRY_DSN)
			return;

		//
		this._init(app);
	}

	protected _init(app: App) {

		Sentry.init({
			app,
			dsn: import.meta.env.VITE_SENTRY_DSN,
			environment: import.meta.env.VITE_APP_ENV,
			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: 0.2,
			ignoreErrors: ['ResizeObserver loop limit exceeded'],
			beforeSend(event) {

				// @ugly Refresh page due to client probably does not have the latest version of the assets?
				let message = event?.exception?.values?.[0]?.value;

				if (message && (message.includes('Failed to fetch dynamically imported module') || message.includes('Load failed') || message.includes('Importing a module script failed') || message.includes('Unable to preload CSS for'))) {

					// Refresh because we did not in the last minute? This avoids infinite loops.
					let lastRefresh = window.localStorage.getItem('main.lastRefreshDueToImportModuleFailed');

					if (!lastRefresh || parseInt(lastRefresh) < (new Date()).getTime() - 60 * 1000) {

						// Store last refresh time.
						window.localStorage.setItem('main.lastRefreshDueToImportModuleFailed', '' + (new Date()).getTime());

						// Reload window to get latest assets.
						window.location.reload();

						// Sent nothing to Sentry.
						return null;
					}
				}

				// Sent to Sentry.
				return event;
			},
		});

	}

}

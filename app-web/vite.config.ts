import {fileURLToPath, URL} from 'url';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {esbuildCommonjs} from '@originjs/vite-plugin-commonjs';
import checker from 'vite-plugin-checker';
import * as fs from 'fs';
import {ViteEjsPlugin} from 'vite-plugin-ejs'
import {resolve} from 'path';

require('dotenv').config();

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		//dynamicImport(),
		vue({
		}),
		esbuildCommonjs(),
		ViteEjsPlugin((viteConfig) => ({
			// viteConfig is the current Vite resolved config
			env: viteConfig.env,
		})),
		checker({
			typescript: process.env.IS_PARALLEL === 'true',
			//vueTsc: process.env.IS_PARALLEL !== 'true', // Gives out of memories and lstat errors in parallel?
		}),
		//createHtmlPlugin(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},

		// Needed to be able to import from contracts-deployments/ symlink, so Vite is not going to serve outside it's own allowed dir.
		preserveSymlinks: true,
	},

	optimizeDeps: {
		include: [
			'vue-number-format',

			// @ugly Needed to prevent reloading the page in tests, when this dependency got touched and optimized. This failed at least some "router-link" -tests.
			'@vue/reactivity'
		],
	},
	build: {
		commonjsOptions: {
			include: [/vue-number-format/, /node_modules/],
		},
		sourcemap: true,
	},

	// @ugly Otherwise we only got a ERR_EMPTY_RESPONSE or infinite page load loop.
	server: {
		host: true,
		port: 5050,
		https: process.env.HTTP_SSL_KEY ? {
			key: fs.readFileSync(process.env.HTTP_SSL_KEY),
			cert: fs.readFileSync(process.env.HTTP_SSL_CERT),
		} : undefined,
		watch: {
			ignored: process.env.VITE_WITHOUT_WATCHING === 'true' ? ['**'] : ['node_modules', 'src/contracts-deployments/**'],
		},
		proxy: {

			/*// Route /storage to the /storage of the engine. As a kind of symlink.
			'/storage': {
				target: (() => {
					let [engineScheme, engineBaseUrl, enginePort] = process.env.VITE_ENGINE_URL.split(':');
					let port = !isNaN(parseInt(process.env.PARALELL_INDEX))
						? (parseInt(enginePort) + (parseInt(process.env.PARALELL_INDEX) + 1))
						: parseInt(enginePort);

					return engineScheme + ':' + engineBaseUrl + ':' + port + '/storage';
				})(),
				secure: false,
				rewrite: (path) => path.replace(/^\/storage/, '')
			},*/
		}
	},

	cacheDir: process.env.VITE_CACHE_DIR || 'node_modules/.vite',

	/*
	build: {
		commonjsOptions: {
			transformMixedEsModules: true,
			exclude: ['node_modules/vue-number-format/src/**']
		},
	},*/
	/*optimizeDeps: {
		include: ['vue-number-format/src/vue-number-format.vue', 'vue-number-format/src/defaultOptions.js']
	}*/
});

import {createApp} from 'vue';
import axios from 'axios';
import TestRegistry from '@/lib/TestRegistry';
import './main.scss';
import Testing from '@/lib/Testing';
import SentryManager from "@/lib/SentryManager";
import App from "@/components/App.vue";
import VueClickAway from 'vue3-click-away';

// @note Did not work in env.d.ts
declare module '@vue/runtime-dom' {
	interface HTMLAttributes {
		dataTestid?: string;
		dataTestidExtra?: string;
	}
}

// Init Vue app.
let app = createApp(App);

SentryManager.init(app);

app.use(VueClickAway);

app.mount('#app');

// Init testing.
Testing.init();

TestRegistry.setMultiple({
	axios,
});

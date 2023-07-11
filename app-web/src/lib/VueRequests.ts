import {computed, ref} from 'vue';
import App from '@/components/App.vue';

type RequestOptions = {
	humanMessages?: {
		[name: string]: any;
	},
	onFail?: Function,
	skipValidation?: boolean
};

export function initVueRequests() {

	let loadings = ref(0);
	let vuelidateExternalResults = ref({
		general: null,
	} as any);

	//let v$ = useVuelidate({$externalResults: vuelidateExternalResults});

	let request = async (requester: () => Promise<any>, options?: RequestOptions): Promise<any> => {

		// Clear external results.
		vuelidateExternalResults.value = {};

		if (options?.skipValidation === true) return;

		//if (v$.value && !await v$.value.$validate()) return;

		// Request
		try {

			// Increase loadings.
			loadings.value++;

			// @debug
			await new Promise(resolve => setTimeout(resolve, 400));

			// Request server.
			return await requester();
		} catch (ex) {

			// Abort due to onFail() handled the error?
			let onFailResult = options?.onFail?.();

			if(onFailResult === true)
				return;

			// Handle validation error?
			else if ((ex as any)?.response?.status === 400) {

				// Is API validation error?
				if ((ex as any)?.response?.data?.error === 'Bad Request') {

					// Is general message?
					let message: string | string[] = (ex as any)?.response?.data?.message;

					if (typeof message == 'string')
						vuelidateExternalResults.value.general = options?.humanMessages?.[message] || message as string;

					// Is true validation message?
					else {
						// Get first word of each message, which are probably the fields to be validated.
						for (let subMessage of message as string[]) {
							vuelidateExternalResults.value[subMessage.split(' ')[0]] = [subMessage];
						}
					}

					// Set general message anyway?
					if (!vuelidateExternalResults.value.general)
						vuelidateExternalResults.value.general = 'Something went wrong.';
				} else
					throw ex;
			}
			// Notify of server error?
			//if ((ex as any)?.response?.status === 500 || !(ex as any).response) {
			else {
				App.getInstance().$notify({
					group: 'bottomRight',
					type: 'error',
					title: "Error",
					text: 'Something went wrong. Try again later.',
				});

				// Rethrow due to not an axios error?
				if (!(ex as any).response)
					throw ex;
			}
			// Rethrow?
			//else
			//	throw ex;

		} finally {
			// Decrease loadings.
			loadings.value--;
		}
	};

	// Return reactive props, to be used in setup() of a Vue component.
	return {
		vueRequests: {
			isLoading: computed(() => loadings.value > 0),
			request,
		},
		//v$,
		vuelidateExternalResults,
	};
}

export function getParentWithVueRequests(instance: any) {

	while (instance) {

		// Return due to found vueRequests?
		if (instance._?.setupState?.vueRequests) {
			return instance;
		}

		// Check parent?
		instance = instance.$parent;
	}

	return null;
}

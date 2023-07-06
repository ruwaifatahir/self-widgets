<template>

	<div
		data-testid="common-Modal"
		class="relative z-10">

		<div class="fixed inset-0 z-10 overflow-y-auto">

			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

				<transition
					name="fade"
					mode="out-in">

					<div
						v-if="show"
						class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
						v-click-away="() => this.closeModal()">

						<button
							type="button"
							data-testid="closeModal"
							class="absolute top-4 right-4 text-gray-400 z-30 focus:outline-none hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
							@click="closeModal">

							<svg class="h-6 w-6"
								 xmlns="http://www.w3.org/2000/svg"
								 fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									  d="M6 18L18 6M6 6l12 12"></path>
							</svg>

						</button>

						<slot />

					</div>

				</transition>

			</div>

		</div>

	</div>

</template>

<script lang="ts">

import {defineComponent, PropType} from 'vue';
import {IframePayload} from "@/embed";
import type {WidgetContext} from "@/components/App.vue";
import EmbedBus from "@/lib/EmbedBus";

export default defineComponent({

	props: {
		widgetContext: {
			type: Object as PropType<WidgetContext>,
			required: true,
		},
	},

	data()
	{
		return {
			show: false,
		};
	},

	mounted()
	{
		// Start transition.
		this.show = true;
	},

	methods: {

		closeModal()
		{
			// Delegate
			EmbedBus.postMessage('closeModal');
		}

	}

})

</script>

<style lang="scss">

.fade-enter-active,
.fade-leave-active {
	transition: opacity .4s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

</style>

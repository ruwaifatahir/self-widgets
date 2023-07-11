<template>

	<div
		data-testid="common-Modal"
		class="relative z-10"
	>

		<div class="fixed inset-0 z-10 overflow-y-auto">

			<div class="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">

				<transition
					name="fade"
					mode="out-in">

					<div
						v-if="show"
						class="relative px-4 py-5 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-sm"
						v-click-away="() => this.closeModal()">

						<button
							type="button"
							data-testid="closeModal"
							class="absolute z-30 text-gray-400 top-4 right-4 focus:outline-none hover:text-gray-500"
							@click="closeModal"
						>

							<svg class="w-6 h-6"
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

import {defineComponent} from 'vue';
import EmbedBus from "@/lib/EmbedBus";

export default defineComponent({

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

<template>

	<div
		data-testid="App">

		<ResolveWidget
			v-if="widgetContext?.options.type == 'resolve'" />

		<Notifications/>

	</div>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ResolveWidget from "@/components/widgets/ResolveWidget.vue";
import EmbedBus from "@/lib/EmbedBus";
import Notifications from "@/components/common/Notifications.vue";

let instance: any;

export default defineComponent({

	components: {
		Notifications,
		ResolveWidget,
	},

	data()
	{
		return {
			elementObserver: null as null | ResizeObserver,
			widgetContext: EmbedBus.widgetContext,
		};
	},

	mounted()
	{
		// @ugly Vue anti pattern.
		instance = this as any;

		//
		this.initHeightManaging();
	},

	getInstance(): any {
		return instance;
	},

	beforeUnmount() {

		// Disconnect element observer?
		this.elementObserver && this.elementObserver.disconnect();
	},

	methods: {

		initHeightManaging() {

			// Abort due to a modal is requested?
			if((EmbedBus.widgetContext!.options as any).showModal)
				return;

			// Init resize observer.
			this.elementObserver = new ResizeObserver(() => {

				// Delegate
				EmbedBus.postMessage('setHeight', {
					height: this.$el.clientHeight,
				});
			});

			// Start observing.
			this.elementObserver.observe(this.$el);
		}

	}

});
</script>

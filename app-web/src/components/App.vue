<template>

	<div
		data-testid="App">

		<ResolveWidget
			v-if="widgetContext?.options.type == 'resolve'" />

	</div>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ResolveWidget from "@/components/widgets/ResolveWidget.vue";
import {IframePayload} from "@/embed";
import EmbedBus from "@/lib/EmbedBus";

export default defineComponent({

	components: {
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
		this.initHeightManaging();
	},

	beforeUnmount() {

		// Disconnect element observer?
		this.elementObserver && this.elementObserver.disconnect();
	},

	methods: {

		initHeightManaging() {

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

<template>

	<div
		data-testid="widgets-ResolveWidget">

		<ResolveComponent
			v-if="!showInstructionModal" />

		<InstructionModal
			v-else />

	</div>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ResolveComponent from "@/components/widgets/resolve/ResolveComponent.vue";
import InstructionModal from "@/components/widgets/resolve/InstructionModal.vue";
import EmbedBus from "@/lib/EmbedBus";

export type ResolveWidgetOptions = {
	showModal?: {
		type: 'instruction';
	};
};

export default defineComponent({

	components: {
		ResolveComponent,
		InstructionModal,
	},

	data()
	{
		return {
			contextWidgetOptions: EmbedBus.getWidgetOptions<ResolveWidgetOptions>(),
		};
	},

	computed: {

		showInstructionModal()
		{
			return this.contextWidgetOptions.showModal?.type === 'instruction';
		},

	}

});
</script>

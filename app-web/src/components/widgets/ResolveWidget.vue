<template>

	<div>
		<resolveWidgetModal v-if="showInstructionModal" />

		<resolveWidgetPanel @openModal="openModal" v-else></resolveWidgetPanel>
	</div>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Modal from "@/components/common/Modal.vue";
import resolveWidgetModal from "@/components/widgets/resolve/Modal.vue";
import resolveWidgetPanel from "@/components/widgets/resolve/Component.vue";
import EmbedBus from "@/lib/EmbedBus";
import SelfNftService from "@/logic/SelfNftService";
import type {SelfNftMetaData} from "@/logic/SelfNftService";
import {initVueRequests} from "@/lib/vueRequests";

export type ResolveWidgetOptions = {
	showModal?: {
		type: 'instruction';
	};
};

export default defineComponent({

	components: {
		resolveWidgetModal,
		resolveWidgetPanel,
	},

	data()
	{
		return {
			nameInput: 'walmart',
			contextWidgetOptions: EmbedBus.getWidgetOptions<ResolveWidgetOptions>(),
			height: 0,
			nftMetaData: undefined as SelfNftMetaData | undefined,
		};
	},

	setup()
	{
		return {
			...initVueRequests(),
		};
	},

	methods: {

		openModal()
		{
			// Delegate
			EmbedBus.postMessage('openModal', {
				type: 'instruction',
			});
		},

	},

	computed: {

		showInstructionModal()
		{
			return this.contextWidgetOptions.showModal?.type === 'instruction';
		},

	}

});
</script>

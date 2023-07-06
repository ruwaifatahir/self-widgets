<template>

	<div
		v-if="showInstructionModal">

		<Modal
			:widget-context="widgetContext">

			<div>
				<div class="mt-3 text-center sm:mt-5">
					<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">About SELF</h3>
					<div class="mt-2">
						<p class="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.</p>
					</div>
				</div>
			</div>

		</Modal>

	</div>

	<div
		v-else
		data-testid="widgets-ResolveWidget"
		class="bg-gray-50 rounded py-10 px-16"
		:style="{height: height ? height + 'px' : 'auto'}">

		<h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">SELF resolve widget</h2>

		<p
			class="mt-6 text-lg leading-8 text-gray-600"
			data-testid="intro">
			Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
		</p>

		<div class="space-x-4 mt-5">

			<input
				class="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				placeholder="Enter a SELF name"
				v-model="nameInput" />

			<button
				class="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				@click="resolveName">
				Resolve name
			</button>

			<button
				class="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				@click="openModal">
				Open modal
			</button>

			<button
				class="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				@click="height += 50">
				Increase widget height ({{height}})
			</button>

		</div>

	</div>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import BlockchainContracts from "@/lib/BlockchainContracts";
import {keccak256, toUtf8Bytes} from "ethers";
import Modal from "@/components/common/Modal.vue";
import EmbedBus from "@/lib/EmbedBus";

export type ResolveWidgetOptions = {
	showModal?: {
		type: 'instruction';
	};
};

export default defineComponent({

	components: {Modal},

	data()
	{
		return {
			nameInput: 'test',
			contextWidgetOptions: EmbedBus.getWidgetOptions<ResolveWidgetOptions>(),
			height: 0,
		};
	},

	mounted()
	{
		// @debug
		this.height = this.$el.clientHeight;

		this.resolveName().then();
	},

	methods: {

		async resolveName()
		{
			console.info('resolveName()')

			let contract = await BlockchainContracts.getContract('SelfNft');

			console.info(this.nameInput);

			let result = await contract.ownerOf(keccak256(toUtf8Bytes(this.nameInput)));

			console.info(result);
		},

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

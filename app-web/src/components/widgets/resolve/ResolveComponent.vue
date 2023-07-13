<template>

    <div class="space-y-4" data-testid="widgets-resolve-ResolveComponent">

        <div class="p-4 bg-white border lg:px-12 lg:py-10 dark:bg-gray-800 dark:border-0 dark:text-white rounded-xl"
            data-testid="widget"
        >

            <div class="flex lg:gap-x-12 gap-y-4">
                <div class="flex-1 lg:pr-32">
                    <img src="/img/common/logos/LOGO-ORIGINAL-1-1.png" alt="SELF logo" class="w-auto h-8 mb-6 dark:hidden" />
                    <img src="/img/common/logos/LOGO-ORIGINAL-1-2.png" alt="SELF logo" class="hidden w-auto h-8 mb-6 dark:block" />

                    <h2 class="text-2xl font-bold" data-testid="intro">SELF resolve widget</h2>

                    <div class="relative mt-8 space-x-4">

                        <input
                            data-testid="name"
                            class="border bg-transparent flex-auto focus-visible:outline focus:ring-2 focus:ring-indigo-600 min-w-0 placeholder:text-gray-400 px-3.5 py-4 rounded-md w-full"
                            :class="{
                                'border-green-400': success,
                                'border-red-400': error,
                                'border-opacity-[15%] dark:border-white dark:border-opacity-[15%]': !success && !error,
                            }"
                            placeholder="Is your identity available?"
                            maxlength="40"
                            v-model="nameInput"
                        />

                        <button
                            class="absolute top-1/2 -translate-y-1/2 right-2 flex-none rounded-md bg-pink px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus:ring-2 focus:ring-indigo-600"
                            @click="resolveName"
                            data-testid="check"
                        >
                            Check
                        </button>

                    </div>

                    <div class="flex items-center mt-2" v-if="success" data-testid="name-success">
                        <i class="mr-1 text-green-400 fas fa-check-circle fa-fw" ></i>
                        Is available
                    </div>

                    <div class="flex items-center mt-2" v-if="error" data-testid="name-error">
                        <i class="mr-1 text-red-400 fas fa-times-circle fa-fw" ></i>
                        Already in use
                    </div>

                    <a v-if="success" 
                        class="inline-flex px-4 py-2 mt-4 rounded-md bg-purple hover:bg-opacity-75" 
                        href="https://self-mvp.vercel.app"
                        target="_blank"
                        data-testid="register"
                    >
                        Register
                    </a>
                </div>

                <div class="flex-shrink-0">

                    <div class="absolute top-0 right-0 mt-2 mr-2">
                        <a href="https://selfcrypto.io/" target="_blank" rel="noopener noreferrer"
                            data-testid="link"
                            class="flex items-center justify-center flex-none w-8 h-8 text-sm rounded-full bg-purple bg-opacity-10 hover:bg-opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:bg-gray-600"
                        >
                            <i class="fa-solid fa-arrow-up-right-from-square text-purple dark:text-white"></i>
                        </a>
                    </div>

                    <InstructionBlock 
                        title="So... how does it work?"
                        subtitle="Learn more about the concept of SELF"
                        :list="[
                            'Simplify Web3 Identity',
                            'Secure and Private',
                            'Enhanced User Experience',
                        ]"
                        buttonText="Start introduction"
                        className="hidden lg:block" 
                        @openInstructionModal="openInstructionModal"
                    />

                </div>
            </div>

            <i
                v-if="vueRequests.isLoading.value"
                class="fas fa-spinner fa-spin"
            ></i>

            <div class="pt-6 lg:pt-8 mt-6 lg:mt-16 border-t border-black dark:border-white border-opacity-[15%] dark:border-opacity-[15%]" v-if="nftMetaData">
                <h3 class="mb-6 text-2xl font-semibold text-darkgray dark:text-white">Identity Information</h3>

                <div class="flex flex-col lg:grid grid-cols-[repeat(13,_minmax(0,_1fr))] gap-16 border border-black border-opacity-[15%] dark:border-white rounded-2xl p-4 lg:px-8 lg:py-6 dark:border-opacity-[15%]">

                    <div class="flex items-center flex-shrink-0 col-span-4 gap-2 lg:pr-24">
                        <img class="w-12 aspect-[1] rounded-full object-cover" 
                            :src="nftMetaData.image || '/img/common/logos/logo-rings.png'" 
                            alt="Logo of the NFT"
                            data-testid="nftImage"
                        >
                        <span data-testid="nftName">{{ nftMetaData.name }}</span>
                    </div>

                    <div
                        v-for="foreignAddress of nftMetaData?.foreignAddresses || []"
                        class="col-span-3"
                        :data-testid="foreignAddress.name"
                    >

                        <div class="mb-1 font-semibold" data-testid="networkName">{{ foreignAddress.name }}</div>
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-full truncate" data-testid="walletAddress">{{ foreignAddress.address }}</div>
                            <a class="cursor-pointer block flex-shrink-0 text-gray-400 py-0.5 px-1 dark:bg-gray-600 bg-gray-200 rounded"
                                @click="copyToClipboard(foreignAddress.address)"
                                data-testid="copy"
                            >
                                <i class="text-sm fal fa-fw fa-copy"></i>
                            </a>
                        </div>

                        <a
                            v-if="foreignAddress.explorerLink"
                            class="px-4 py-2 transition border rounded-full outline-none hover:bg-darkgray focus:ring-1 focus:ring-offset-2 focus:ring-darkgray dark:hover:bg-white dark:hover:text-black hover:text-white dark:focus:ring-white hover:border-black hover:bg-gray-800 dark:border-opacity-[15%] dark:border-white"
                            :href="foreignAddress.explorerLink"
                            target="_blank"
                            data-testid="explorerLink"
                        >
                            Explorer
                        </a>

                    </div>

                </div>
            </div>

        </div>

        <InstructionBlock 
            title="So... how does it work?"
            subtitle="Learn more about the concept of SELF"
            :list="[
                'Simplify Web3 Identity',
                'Secure and Private',
                'Enhanced User Experience',
            ]"
            buttonText="Start introduction"
            className="lg:hidden" 
            @openInstructionModal="openInstructionModal"
        />

    </div>

</template>


<script lang="ts">
import {defineComponent} from 'vue';
import SelfNftService from "@/logic/SelfNftService";
import type {SelfNftMetaData} from "@/logic/SelfNftService";
import {initVueRequests} from "@/lib/VueRequests";
import EmbedBus from "@/lib/EmbedBus";
import InstructionBlock from "@/components/widgets/resolve/InstructionBlock.vue";
import copy from 'copy-to-clipboard';
import App from '@/components/App.vue';

export default defineComponent({

    components: {
        InstructionBlock,
    },

	data()
	{
		return {
			nftMetaData: undefined as SelfNftMetaData | undefined,
			nameInput: null as string | null,
            error: false,
            success: false,
		};
	},

	setup()
	{
		return {
			...initVueRequests(),
		};
	},

	mounted()
	{
		// @debug
		//this.nameInput = 'walmart';
		//this.resolveName().then();
	},

	methods: {

        copyToClipboard(text: string)
        {
            copy(text);

            App.getInstance().$notify({
                group: 'bottomRight',
                type: 'success',
                title: 'Copied',
                text: 'Copied NFT address to clipboard.',
            });
        },

		async resolveName()
		{
            // Reset
            this.success = false;
            this.error = false;

			await this.vueRequests.request(async() => {

				// Load meta data.
				this.nftMetaData = await SelfNftService.getMetaDataByName(this.nameInput);

                if( this.nftMetaData?.name )
                {
                    this.error = true;
                } else {
                    this.success = true;
                }

				// @debug
				console.info({
					metaData: this.nftMetaData,
				});
			});
		},

		openInstructionModal()
		{
			// Delegate
			EmbedBus.postMessage('openModal', {
				type: 'instruction',
			});
		}

	},


});
</script>

<template>

    <div
        data-testid="widgets-resolve-ResolveComponent"
        class="px-12 py-10 bg-white border dark:bg-gray-800 dark:border-0 dark:text-white rounded-xl"
    >

        <div class="flex gap-x-12 gap-y-4">
            <div class="flex-1 lg:pr-32">
                <img src="/img/common/logos/LOGO-ORIGINAL-1-1.png" alt="SELF logo" class="w-auto h-8 mb-6 dark:hidden" />
                <img src="/img/common/logos/LOGO-ORIGINAL-1-2.png" alt="SELF logo" class="hidden w-auto h-8 mb-6 dark:block" />

                <h2 class="text-2xl font-bold" data-testid="intro">SELF resolve widget</h2>

                <div class="relative mt-8 space-x-4">

                    <input
                        class="border dark:border-white dark:border-opacity-[15%] border-opacity-[15%] bg-transparent flex-auto focus-visible:outline focus:ring-2 focus:ring-indigo-600 min-w-0 placeholder:text-gray-400 px-3.5 py-4 rounded-md w-full"
                        :class="{
                            'ring-green-400': false, // TODO Success
                            'ring-red-400': false, // TODO Error
                        }"
                        placeholder="Enter a SELF name"
                        v-model="nameInput"
                    />

                    <button
                        class="absolute top-1/2 -translate-y-1/2 right-2 flex-none rounded-md bg-pink px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus:ring-2 focus:ring-indigo-600"
                        @click="resolveName"
                    >
                        Check
                    </button>

                </div>
            </div>

            <div class="flex-shrink-0">

                <div class="absolute top-0 right-0 mt-2 mr-2">
                    <button
                        class="flex items-center justify-center flex-none w-8 h-8 text-sm rounded-full bg-purple bg-opacity-10 hover:bg-opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:bg-gray-600"
                        @click="openInstructionModal">
                        <i class="fas fa-arrow-up-right-from-square text-purple dark:text-white"></i>
                    </button>
                </div>

                <div class="relative py-6 pl-8 pr-32 text-white rounded-3xl bg-gradient-to-r from-pink to-purple">
                    <h2 class="text-2xl font-semibold">So... how does it work?</h2>
                    <p class="mb-4">Learn more about the concept of SELF</p>
                    <ul class="pl-0 m-0 mb-3 list-none">
                        <li class="flex items-center">
                            <i class="mr-2 fas fa-check"></i>
                            <span>Simplify Web3 Identity</span>
                        </li>
                        <li class="flex items-center">
                            <i class="mr-2 fas fa-check"></i>
                            <span>Secure and Private</span>
                        </li>
                        <li class="flex items-center">
                            <i class="mr-2 fas fa-check"></i>
                            <span>Enhanced User Experience</span>
                        </li>
                    </ul>

                    <button
						class="px-8 py-3 mt-2 font-semibold bg-white rounded-md text-pink"
						@click="openInstructionModal">
						Start introduction
					</button>

                    <div class="absolute top-0 right-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="203" height="257" viewBox="0 0 203 257" fill="none">
                            <path d="M109.15 249.956C107.918 249.956 106.682 249.526 105.684 248.649C103.504 246.734 103.29 243.415 105.205 241.234C126.491 217.007 142.275 187.824 150.849 156.841C159.84 124.356 160.994 91.0112 154.28 57.7335C153.706 54.8891 155.547 52.1184 158.391 51.5443C161.237 50.9683 164.007 52.8117 164.581 55.6555C171.625 90.5666 170.412 125.553 160.977 159.644C151.981 192.147 135.425 222.759 113.098 248.17C112.06 249.353 110.608 249.956 109.15 249.956Z" fill="url(#paint0_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M83.9949 241.342C82.6722 241.342 81.3483 240.845 80.3264 239.849C78.249 237.822 78.2073 234.497 80.2343 232.419C98.1584 214.043 111.977 192.606 121.305 168.703C122.36 166.001 125.408 164.666 128.109 165.718C130.812 166.774 132.149 169.82 131.093 172.523C121.251 197.746 106.67 220.366 87.7561 239.756C86.7269 240.812 85.3612 241.342 83.9949 241.342Z" fill="url(#paint1_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M136.389 255.202C135.257 255.202 134.117 254.838 133.157 254.088C130.87 252.301 130.465 248.999 132.252 246.712C175.17 191.79 191.892 121.159 178.129 52.9296L177.775 51.1765C176.495 46.8884 173.782 43.2157 170.009 40.7084C165.738 37.8708 160.619 36.8674 155.595 37.8807C146.087 39.7966 139.633 48.474 140.227 57.8963L140.744 60.4612C146.211 87.5884 146.068 114.954 140.317 141.799C139.709 144.636 136.915 146.443 134.079 145.836C131.241 145.229 129.434 142.435 130.042 139.598C135.13 115.841 135.582 91.6461 131.394 67.6041L131.286 67.6237L130.268 62.5687C127.033 46.5114 137.462 30.8145 153.517 27.5796C161.291 26.0088 169.214 27.563 175.824 31.9555C182.433 36.3467 186.938 43.048 188.507 50.8252L189.433 55.4086L189.312 55.448C202.038 125.256 184.38 197.072 140.532 253.183C139.496 254.508 137.95 255.202 136.389 255.202Z" fill="url(#paint2_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M61.0121 229.816C59.6083 229.816 58.2088 229.257 57.1741 228.151C55.1919 226.033 55.3024 222.708 57.4216 220.725C96.4936 184.172 115.549 130.806 108.394 77.9708C108.004 75.0951 110.02 72.4479 112.895 72.0592C115.774 71.6692 118.418 73.6852 118.808 76.5609C126.418 132.763 106.154 189.525 64.6007 228.399C63.5875 229.347 62.2985 229.816 61.0121 229.816Z" fill="url(#paint3_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M165.598 256.445C164.576 256.445 163.543 256.147 162.636 255.526C160.241 253.888 159.628 250.618 161.267 248.223C185.407 212.936 200.711 171.97 205.524 129.756C205.853 126.873 208.461 124.802 211.34 125.131C214.223 125.459 216.294 128.064 215.965 130.947C210.959 174.856 195.045 217.461 169.94 254.156C168.922 255.644 167.274 256.445 165.598 256.445Z" fill="url(#paint4_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M40.2461 215.789C38.7748 215.789 37.3108 215.174 36.2718 213.974C34.3719 211.781 34.6108 208.462 36.8036 206.563C55.3479 190.502 69.458 169.779 77.6079 146.635C85.4355 124.406 87.5098 100.497 83.6743 77.1706L83.632 77.178L82.623 72.1776C78.4867 51.6708 82.5837 30.7819 94.1602 13.3596C105.735 -4.06223 123.404 -15.9334 143.911 -20.068C151.043 -21.5067 158.308 -21.9525 165.508 -21.3937C168.402 -21.1684 170.564 -18.6409 170.339 -15.748C170.114 -12.8551 167.592 -10.6936 164.694 -10.9171C158.462 -11.4028 152.17 -11.0147 145.988 -9.76755C128.232 -6.18752 112.935 4.09079 102.913 19.1748C93.6929 33.0503 89.9532 49.4656 92.2001 65.8263L93.0573 70.0763C98.4531 96.8319 96.5379 124.512 87.519 150.123C78.7636 174.987 63.6053 197.25 43.6824 214.505C42.6889 215.365 41.4638 215.788 40.2449 215.788L40.2461 215.789Z" fill="url(#paint5_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M196.617 252.918C195.713 252.918 194.798 252.685 193.964 252.195C191.46 250.726 190.622 247.507 192.09 245.004C227.795 184.143 239.771 112.513 225.814 43.309L225.355 41.0332C220.965 22.5466 209.045 6.75275 192.373 -2.54611C189.838 -3.9597 188.93 -7.16022 190.343 -9.69449C191.756 -12.2281 194.956 -13.1376 197.491 -11.724C217.525 -0.549767 231.617 18.7468 236.153 41.2174L237.054 45.6805L236.982 45.7057C250.06 116.054 237.401 188.538 201.154 250.322C200.176 251.99 198.42 252.918 196.617 252.918Z" fill="url(#paint6_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M21.7711 199.518C20.2507 199.518 18.7425 198.861 17.7035 197.593C15.8644 195.348 16.1941 192.038 18.4386 190.199C33.9985 177.454 46.0766 160.799 53.3669 142.034C54.4175 139.329 57.4621 137.988 60.1671 139.039C62.872 140.091 64.2126 143.135 63.1619 145.84C55.2177 166.287 42.0545 184.438 25.0969 198.328C24.1206 199.129 22.9422 199.518 21.7711 199.518Z" fill="url(#paint7_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M229.189 243.59C228.417 243.59 227.633 243.418 226.891 243.057C224.282 241.786 223.198 238.642 224.47 236.033C233.183 218.151 240.198 199.378 245.32 180.235C246.071 177.433 248.949 175.772 251.754 176.518C254.557 177.268 256.221 180.149 255.472 182.952C250.176 202.742 242.924 222.15 233.916 240.635C233.007 242.503 231.136 243.59 229.189 243.59Z" fill="url(#paint8_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M263.029 226.668C262.405 226.668 261.771 226.556 261.153 226.32C258.443 225.284 257.086 222.246 258.123 219.535C280.607 160.757 286.009 96.9855 273.769 35.0221L273.496 33.6927C270.146 17.0864 263.43 1.77641 253.536 -11.8099C251.828 -14.1556 252.344 -17.4421 254.69 -19.1505C257.036 -20.8594 260.322 -20.3418 262.03 -17.9966C272.39 -3.77233 279.553 12.1794 283.34 29.4445L283.362 29.4587L283.805 31.6202C296.781 95.952 291.294 162.23 267.938 223.289C267.137 225.381 265.144 226.668 263.029 226.668Z" fill="url(#paint9_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M5.65119 181.265C4.11356 181.265 2.59005 180.593 1.55166 179.302C-0.265984 177.04 0.0950916 173.732 2.35671 171.915C28.2717 151.096 40.857 118.455 35.7971 85.9009L34.9687 81.7927C25.6085 35.3727 42.6483 -12.0236 79.4378 -41.9012C81.6908 -43.7311 85 -43.3872 86.8287 -41.1348C88.6581 -38.8818 88.3154 -35.5732 86.0624 -33.7439C53.5339 -7.32781 37.837 34.0157 44.4334 75.0963L45.3612 79.6951C52.9788 117.462 39.0222 155.938 8.93769 180.108C7.96746 180.888 6.80503 181.266 5.64997 181.266L5.65119 181.265Z" fill="url(#paint10_linear_16_637)" fill-opacity="0.25"/>
                            <path d="M297.506 199.022C297.057 199.022 296.602 198.963 296.149 198.842C293.345 198.095 291.678 195.216 292.426 192.412C302.409 154.986 306.233 116.4 303.794 77.7234C303.611 74.8274 305.811 72.3312 308.707 72.1488C311.604 71.9578 314.099 74.1654 314.281 77.0614C316.794 116.874 312.856 156.595 302.579 195.119C301.952 197.469 299.828 199.022 297.506 199.022Z" fill="url(#paint11_linear_16_637)" fill-opacity="0.25"/>
                            <defs>
                                <linearGradient id="paint0_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint1_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint2_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint3_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint4_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint5_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint6_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint7_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint8_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint9_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint10_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                                <linearGradient id="paint11_linear_16_637" x1="303.632" y1="72.1373" x2="303.632" y2="199.022" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white"/>
                                <stop offset="1" stop-color="white" stop-opacity="0"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

            </div>
        </div>

        <i
            v-if="vueRequests.isLoading.value"
            class="fas fa-spinner fa-spin"
        ></i>

        <pre
			v-if="nftMetaData"
			class="mt-8 text-xs">{{ nftMetaData }}</pre>

        <div class="pt-8 mt-16 border-t border-black dark:border-white border-opacity-[15%] dark:border-opacity-[15%]">
            <h3 class="mb-6 text-2xl font-semibold text-darkgray dark:text-white">Identity Information</h3>

            <div class="flex flex lg:grid grid-cols-[repeat(13,_minmax(0,_1fr))] gap-16 border border-black border-opacity-[15%] dark:border-white rounded-2xl px-8 py-6 dark:border-opacity-[15%]">

                <div class="flex items-center flex-shrink-0 col-span-4 gap-2 lg:pr-24">
                    <img class="w-12 aspect-[1] rounded-l-2xl" src="/img/common/logos/logo-rings.png" alt="Logo SELF with rings">
                    <span>SELF-Example</span>
                </div>

                <div
					v-for="foreignAddress of nftMetaData?.foreignAddresses || []"
					class="col-span-3">

					<div class="mb-1 font-semibold">BTC</div>
                    <div class="flex items-center gap-2 mb-3">
                        <div class="w-full truncate">5N3oefVeg5sti43a0ja449aj405s5s5s</div>
                        <div class="flex-shrink-0 text-gray-400 py-0.5 px-1 dark:bg-gray-600 bg-gray-200 rounded">
                            <i class="text-sm fal fa-fw fa-copy"></i>
                        </div>
                    </div>

                    <a
						v-if="foreignAddress.explorerLink"
						class="px-4 py-2 transition border rounded-full outline-none hover:bg-darkgray focus:ring-1 focus:ring-offset-2 focus:ring-darkgray dark:hover:bg-white dark:hover:text-black hover:text-white dark:focus:ring-white hover:border-black hover:bg-gray-800 dark:border-opacity-[15%] dark:border-white"
						:href="foreignAddress.explorerLink"
						target="_blank"
						data-testid="explorerLink">
                        Explorer
                    </a>

                </div>

            </div>
        </div>

    </div>

</template>


<script lang="ts">
import {defineComponent} from 'vue';
import SelfNftService from "@/logic/SelfNftService";
import type {SelfNftMetaData} from "@/logic/SelfNftService";
import {initVueRequests} from "@/lib/VueRequests";
import EmbedBus from "@/lib/EmbedBus";

export default defineComponent({

	data()
	{
		return {
			nftMetaData: undefined as SelfNftMetaData | undefined,
			nameInput: null as string | null,
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
		this.nameInput = 'walmart';
		this.resolveName().then();
	},

	methods: {

		async resolveName()
		{
			await this.vueRequests.request(async() => {

				// Load meta data.
				this.nftMetaData = await SelfNftService.getMetaDataByName(this.nameInput);

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
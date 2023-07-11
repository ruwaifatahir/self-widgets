<template>

    <Modal>

        <div class="relative flex flex-col items-center justify-center">

            <div class="flex gap-2 self-baseline">
                <div class="w-[3rem] h-2 bg-gray-300 rounded"
                    v-bind:class="setActiveClassOnSlide(0)"
                ></div>
                
                <div class="w-[3rem] h-2 bg-gray-300 rounded"
                    v-bind:class="setActiveClassOnSlide(1)"
                ></div>
            </div>

			<div class="relative mt-8 lg:mt-16">
				<transition
					v-bind:enter-from-class="enterFromClasses()"
					enter-active-class="duration-300 ease-out delay-150"
					enter-to-class="opacity-100"
					leave-active-class="hidden duration-200 ease-in delay-150"
					leave-from-class="block opacity-100"
					v-bind:leave-to-class="leaveToClasses()"
				>
					<div :key="currentSlide" class="flex flex-col items-center justify-center">
						<component :is="slides[currentSlide]['icon']"></component>

						<span class="mt-6 text-base font-semibold md:text-lg"> {{ slides[currentSlide]['title'] }} </span>
						<span class="max-w-sm mt-2 text-sm text-center text-black/50"> {{ slides[currentSlide]['text'] }} </span>

					</div>
				</transition>
			</div>

			<div class="inline-flex w-full gap-3 mt-8 center md:gap-0">
				<transition
					enter-from-class="transform opacity-0"
					enter-active-class="duration-300 ease-out delay-150"
					enter-to-class="opacity-100"
					leave-active-class="duration-200 ease-in"
					leave-from-class="opacity-100"
					leave-to-class="transform opacity-0"
				>
					<button
						class="inline-flex h-[46px] items-center space-x-3 rounded-full border bg-white py-3 px-5 text-ecoblue transition hover:opacity-75"
						v-if="currentSlide !== 0"
						@click="previousClick"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="6.414" height="10.828" viewBox="0 0 6.414 10.828">
							<path
								id="Path_9717"
								data-name="Path 9717"
								d="M12,13,8,9l4-4"
								transform="translate(-7 -3.586)"
								fill="none"
								stroke="#000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
							/>
						</svg>
						<span>Previous</span>
					</button>
				</transition>

				<button
					class="ml-auto h-[46px] w-[100px] rounded-full bg-brand-pink py-3 px-8 text-white transition hover:bg-opacity-75"
					@click="nextClick"
					data-testid="nextButton"
				>
					{{ !isLastSlide ? 'Next' : 'Done' }}
				</button>
			</div>

		</div>

    </Modal>

</template>


<script lang="ts">
import {defineComponent} from 'vue';
import Modal from "@/components/common/Modal.vue";
import RegisterIdentity from "@/components/widgets/resolve/icons/RegisterIdentity.vue";

export type ResolveWidgetOptions = {
	showModal?: {
		type: 'instruction';
	};
};

export default defineComponent({

	components: {
		Modal,
        RegisterIdentity,
	},

    emits: ['update:show'],

	props: {
		show: Boolean,
	},

	data() {
		return {
			currentSlide: 0,
			nextOrPrev: 'next',
		};
	},

	methods: {
		nextClick() {
			this.nextOrPrev = 'next';

			if (this.isLastSlide) {
				// Close modal
				this.$emit('update:show', false);

				// Reset the modal with a delay, so we don't mess with the slide-out animation
				setTimeout(() => (this.currentSlide = 0), 500);
			} else {
				// Go to next modal
				this.currentSlide += 1;
			}
		},

		previousClick() {
			this.nextOrPrev = 'prev';

			if (this.currentSlide < 1) {
				return;
			}

			this.currentSlide -= 1;
		},

		setActiveClassOnSlide(slide: number) {
			let activeClass = 'bg-black';
			let defaultClass = 'bg-gray-300';

			if (this.currentSlide >= slide) {
				return activeClass;
			}

			return defaultClass;
		},

		enterFromClasses() {
			if (this.nextOrPrev == 'prev') {
				return 'transform opacity-0 -translate-x-full';
			}

			return 'transform opacity-0 translate-x-full';
		},

		leaveToClasses() {
			if (this.nextOrPrev == 'prev') {
				return 'transform opacity-0 translate-x-full';
			}

			return 'transform opacity-0 -translate-x-full';
		},
	},

	computed: {
		isLastSlide() {
			return this.slides.length - 1 == this.currentSlide;
		},

		slides() {
			return [
				{
					icon: RegisterIdentity,
					title: 'Regsiter an identity',
					text: 'Lorem ipsum dolor sit amet, consectetur adip iscing elit. Nunc purus tortor, scelerisque maximus.',
				},
				{
					icon: RegisterIdentity,
					title: 'Test',
					text: 'Put text here.',
				},
			];
		},
	},

})
</script>
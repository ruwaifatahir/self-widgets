module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

	theme: {

		extend: {
			colors: {
				'lightgray': '#2f2f2f',
				'darkgray': '#1E1E1E',
				'pink': '#DD13B8',
				'purple': '#4D15F1',
				'brand-pink': '#D944BA',
				'brand-indigo': '#8B4FF9',
				'brand-blue': '#00B8FF',
				'brand-gray': '#f7f7f7',
			},
		},

		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
		},
	},

};

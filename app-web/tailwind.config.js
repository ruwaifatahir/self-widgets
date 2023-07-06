module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

	theme: {

		extend: {
			colors: {
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

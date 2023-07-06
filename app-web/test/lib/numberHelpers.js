function formatNumberAsVueFormatWithPrecisionTwo(number)
{
	return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number)
}

// Module export.
module.exports = {
	numberHelpers: {
		formatNumberAsVueFormatWithPrecisionTwo,
	},
};

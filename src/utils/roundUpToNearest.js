var roundToPrecision = require('./roundToPrecision');

/**
 * Rounds a Number <em>up</em> to the nearest multiple of an input. For example, by rounding
 * 16 up to the nearest 10, you will receive 20. Similar to the built-in function Math.ceil().
 *
 * @see Math#ceil
 *
 * @function GOWN.utils.roundUpToNearest
 * @param number The number to round up {Number}
 * @param nearest The number whose multiple must be found {Number}
 * @return {Number} The rounded number
 */
module.exports = function(number, nearest) {
    nearest = nearest || 1;
    if(nearest === 0) {
		return number;
	}
	return Math.ceil(roundToPrecision(number / nearest, 10)) * nearest;
};

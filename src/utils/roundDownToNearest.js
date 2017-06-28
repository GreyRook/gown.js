var roundToPrecision = require('./roundToPrecision');

/**
 * Rounds a Number <em>down</em> to the nearest multiple of an input. For example, by rounding
 * 16 down to the nearest 10, you will receive 10. Similar to the built-in function Math.floor().
 *
 * @see Math#floor
 *
 * @function GOWN.utils.roundDownToNearest
 * @param number The number to round down {Number}
 * @param nearest The number whose multiple must be found {Number}
 * @return {Number} The rounded number
 */
module.exports = function(number, nearest) {
    nearest = nearest || 1;
    if(nearest === 0) {
		return number;
	}
	return Math.floor(roundToPrecision(number / nearest, 10)) * nearest;
};

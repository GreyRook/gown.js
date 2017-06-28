var roundToPrecision = require('./roundToPrecision');

/**
 * Rounds a Number to the nearest multiple of an input. For example, by rounding
 * 16 to the nearest 10, you will receive 20. Similar to the built-in function Math.round().
 *
 * @see Math#round
 *
 * @function GOWN.utils.roundToNearest
 * @param number The number to round {Number}
 * @param nearest The number whose multiple must be found {Number}
 * @return {Number} The rounded number
 */
module.exports = function(number, nearest) {
    nearest = nearest || 1;
    if(nearest === 0) {
		return number;
	}
	var roundedNumber = Math.round(roundToPrecision(number / nearest, 10)) * nearest;
    return roundToPrecision(roundedNumber, 10);
};

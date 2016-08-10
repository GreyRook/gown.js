var roundToPrecision = require('./roundToPrecision');

/**
 * Rounds a Number to the nearest multiple of an input. For example, by rounding
 * 16 to the nearest 10, you will receive 20. Similar to the built-in function Math.round().
 *
 * @param	numberToRound		the number to round
 * @param	nearest				the number whose mutiple must be found
 * @return	the rounded number
 *
 * @see Math#round
 */

module.exports = function(number, nearest) {
    nearest = nearest || 1;
    if(nearest === 0) {
		return number;
	}
	var roundedNumber = Math.round(roundToPrecision(number / nearest, 10)) * nearest;
    return roundToPrecision(roundedNumber, 10);
};

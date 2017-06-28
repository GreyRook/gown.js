/**
 * Rounds a number to a certain level of precision. Useful for limiting the number of
 * decimal places on a fractional number.
 *
 * @see Math#round
 *
 * @function GOWN.utils.roundToPrecision
 * @param number The input number to round {Number}
 * @param precision The number of decimal digits to keep {Number}
 * @return {Number} The rounded number, or the original input if no rounding is needed
 */
module.exports = function(number, precision) {
    precision = precision || 0;
    var decimalPlaces = Math.pow(10, precision);
	return Math.round(decimalPlaces * number) / decimalPlaces;
};

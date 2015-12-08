var ToggleButton = require('./ToggleButton');

/**
	* A toggle control that contains a label and a box that may be checked
	* or not to indicate selection.
  *
  * @class Check
  * @extends GOWN.ToggleButton
  * @memberof GOWN
  * @constructor
  */
function Check(theme, skinName) {
    this._skinName = skinName || Check.SKIN_NAME;
    ToggleButton.call(this, theme);
}

Check.prototype = Object.create( ToggleButton.prototype );
Check.prototype.constructor = Check;
module.exports = Check;

// name of skin that will be applied
Check.SKIN_NAME = 'check';

var ToggleButton = require('./ToggleButton');

/**
 * A toggle control that contains a label and a box that may be checked
 * or not to indicate selection.
 *
 * @class Check
 * @extends GOWN.ToggleButton
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the button {GOWN.Theme}
 * @param [skinName=Check.SKIN_NAME] name of the check skin {String}
 */
function Check(theme, skinName) {
    // TODO: use and place Label from ToggleButton
    skinName = skinName || Check.SKIN_NAME;
    ToggleButton.call(this, theme, skinName);
}

Check.prototype = Object.create( ToggleButton.prototype );
Check.prototype.constructor = Check;
module.exports = Check;

/**
 * Default check skin name
 *
 * @static
 * @final
 * @type String
 */
Check.SKIN_NAME = 'check';

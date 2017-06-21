var ToggleButton = require('./ToggleButton');

/**
 * A toggleable control that exists in a set that requires a single, exclusive toggled item.
 *
 * @class Radio
 * @extends GOWN.ToggleButton
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the radio button {GOWN.Theme}
 * @param [skinName=Radio.SKIN_NAME] name of the radio button skin {String}
 */
function Radio(theme, skinName) {
    skinName = skinName || Radio.SKIN_NAME;
    ToggleButton.call(this, theme, skinName);
}

Radio.prototype = Object.create( ToggleButton.prototype );
Radio.prototype.constructor = Radio;
module.exports = Radio;

/**
 * Default radio button skin name
 *
 * @static
 * @final
 * @type String
 */
Radio.SKIN_NAME = 'radio';

/**
 * Set the toggle group and add this radio button to it
 *
 * @name GOWN.Radio#label
 * @type String
 */
Object.defineProperty(Radio.prototype, 'toggleGroup', {
    get: function() {
        return this._toggleGroup;
    },
    set: function(toggleGroup) {
        if(this._toggleGroup === toggleGroup) {
            return;
        }
        this._toggleGroup = toggleGroup;
        toggleGroup.addItem(this);
    }
});

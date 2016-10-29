var ToggleButton = require('./ToggleButton');

/**
  * A toggleable control that exists in a set that requires a single, exclusive toggled item.
  *
  * @class Radio
  * @extends GOWN.ToggleButton
  * @memberof GOWN
  * @constructor
  */
function Radio(theme, skinName) {
    skinName = skinName || Radio.SKIN_NAME;
    ToggleButton.call(this, theme, skinName);
}

Radio.prototype = Object.create( ToggleButton.prototype );
Radio.prototype.constructor = Radio;
module.exports = Radio;

// name of skin that will be applied
Radio.SKIN_NAME = 'radio';

/**
 * Create/Update the label of the button.
 *
 * @property label
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

var ToggleButton = require('./ToggleButton'),
    Skinable = require('../Skinable');

/**
 * PickerList allows the user to select an option from a list
 *
 * @class PickerList
 * @extends PIXI_UI.Control
 * @memberof PIXI_UI
 * @constructor
 */
function PickerList(theme) {
    this.skinName = this.skinName || PickerList.SKIN_NAME;
    ToggleButton.call(this, theme);
    this._dataProvider = [];

    // selected item
    // TODO: create setter that updates the list
    this.selectedIndex = -1;
}

PickerList.prototype = Object.create( ToggleButton.prototype );
PickerList.prototype.constructor = PickerList;
module.exports = PickerList;

// name of skin that will be applied
PickerList.SKIN_NAME = 'pickerlist';

PickerList.prototype.skinableChangeSkin = Skinable.prototype.changeSkin;
/**
 * remove old skin and add new one
 *
 * @method changeSkin
 * @param skin {DisplayObject}
 */
Skinable.prototype.changeSkin = function(skin) {
    if (this._currentSkin !== skin) {

    }
    this.skinableChangeSkin(skin);
};

// TODO: prompt
// TODO: PopupManager (?)
// TODO: createButton
// TODO: createList
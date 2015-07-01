var Control = require('../Control');

/**
 * PickerList allows the user to select an option from a list
 *
 * @class PickerList
 * @extends PIXI_UI.Control
 * @memberof PIXI_UI
 * @constructor
 */
function PickerList() {
    // TODO: inherit Button?
    Control.call(this);
    this._dataProvider = [];

    // selected item
    // TODO: create setter that updates the list
    this.selectedIndex = -1;
    // TODO: toggle button?
}

PickerList.prototype = Object.create( Control.prototype );
PickerList.prototype.constructor = PickerList;
module.exports = PickerList;

// name of skin that will be applied
PickerList.SKIN_NAME = 'pickerlist';

// TODO: prompt
// TODO: PopupManager (?)
// TODO: createButton
// TODO: createList
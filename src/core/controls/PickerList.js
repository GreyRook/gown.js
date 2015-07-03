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
    this.invalidIcon = true
}

PickerList.prototype = Object.create( ToggleButton.prototype );
PickerList.prototype.constructor = PickerList;
module.exports = PickerList;

// name of skin that will be applied
PickerList.SKIN_NAME = 'pickerlist';

/**
 * show icon for selection
 *
 * @method showIcon
 * @param skin
 */
PickerList.prototype.showIcon = function(skin) {
    if (this.iconSkin !== skin) {
        if(this.iconSkin) {
            this.removeChild(this.iconSkin);
        }

        this.addChild(skin);
        this.iconSkin = skin;
    }
    skin.x = this.width - skin.getBounds().width - 10;
    skin.y = Math.floor((this.height - skin.getBounds().height )/ 2);
    this.invalidIcon = false;
};

/**
 * redraw the skin
 *
 * @method redraw
 */
PickerList.prototype.redraw = function() {
    this.redrawSkinable();
    if (this.invalidIcon) {
        this.fromSkin('picker_list_'+this._currentState, this.showIcon);
    }
};


// TODO: prompt
// TODO: PopupManager (?)
// TODO: createButton/ListItem
// TODO: createList
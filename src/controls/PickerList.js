var Control = require('../core/Control');
var ToggleButton = require('./ToggleButton');
var List = require('./List');
var Point = PIXI.Point;

/**
 * PickerList allows the user to select an option from a list
 *
 * @class PickerList
 * @extends PIXI_UI.Control
 * @memberof PIXI_UI
 * @constructor
 */
function PickerList(theme) {
    this.theme = theme;

    Control.call(this);

    // TODO: Icons for Button
    this._listFactory = this._listFactory || this._defaultListFactory;
    this._buttonFactory = this._buttonFactory || this._defaultButtonFactory;

    // TODO: implement PopUpManager!
    this.popUpParent = this;

    this.invalidList = true;
    this.invalidButton = true;
}

PickerList.prototype = Object.create( Control.prototype );
PickerList.prototype.constructor = PickerList;
module.exports = PickerList;

// name of skin that will be applied (ignored for testing right now ;-) )
PickerList.SKIN_NAME = 'picker_list';

PickerList.prototype._clickList = function() {
    if (!this.open) {
        this.openList();
    } else {
        this.closeList();
    }
};



/**
 * Creates and adds the list sub-component and removes the old instance, if one exists.
 * Meant for internal use, and subclasses may override this function with a custom implementation.
 */
PickerList.prototype._defaultListFactory = function(theme) {
    return new List(theme);
};

PickerList.prototype._defaultButtonFactory = function(theme) {
    return new ToggleButton(theme);
};

/**
 * Opens the pop-up list, if it isn't already open.
 */
PickerList.prototype.openList = function() {
    if (this.popUpParent === this) {
        this.list.y = this.height;
    } else {
        var pos = new Point(0, this.height);
        pos = this.toGlobal(pos);
        pos = this.popUpParent.toLocal(pos);
        this.list.position = pos;
    }
    this.list.clippingInvalid = true;
    this.popUpParent.addChild(this.list);
    this.open = true;
};

/**
 * Closes the pop-up list, if it is open.
 */
PickerList.prototype.closeList = function() {
    this.popUpParent.removeChild(this.list);
    this.open = false;
};

Object.defineProperty(PickerList.prototype, 'itemRendererFactory', {
    set: function(itemRendererFactory) {
        if (this.list) {
            this.list.itemRendererFactory = itemRendererFactory;
        }
        this._itemRendererFactory = itemRendererFactory;
    },
    get: function() {
        return this._itemRendererFactory;
    }
});

Object.defineProperty(PickerList.prototype, 'dataProvider', {
    set: function(dataProvider) {
        if (this.list) {
            this.list.dataProvider = dataProvider;
        }
        this._dataProvider = dataProvider;
    },
    get: function() {
        return this._dataProvider;
    }
});

PickerList.prototype.createButton = function() {
    this.button = this._buttonFactory(this.theme);

    this.button.width = this.width;
    this.button.height = this.height;

    this.button.on('mouseup', this._clickList, this);
    this.button.on('touchend', this._clickList, this);

    this.addChild(this.button);
};

PickerList.prototype.createList = function() {
    this.list = this._listFactory(this.theme);
    if (this.dataProvider) {
        this.list._dataProvider = this.dataProvider;
    }
    if (this.itemRendererFactory) {
        this.list.itemRendererFactory = this.itemRendererFactory;
    }
    // forward list events
    this.list.on(List.CHANGE, this._listChange, this);
};

/**
 * forward list events
 */
PickerList.prototype._listChange = function(itemRenderer, value) {
    this.emit(List.CHANGE, itemRenderer, value);
    this.closeList();
};

PickerList.prototype.redraw = function() {
    if (this.invalidButton) {
        if (this.button) {
            this.button.off('click', this._clickList, this);
            this.button.off('tap', this._clickList, this);
        }
        this.createButton();
        this.invalidButton = false;
    }
    if (this.invalidList) {
        this.createList();
        this.invalidList = false;
    }
};

PickerList.prototype.destroy = function() {
    if (this.button) {
        this.button.off('click', this._clickList, this);
        this.button.off('tap', this._clickList, this);
    }
    this.button.destroy();
    if (this.list) {
        this.list.destroy();
    }
};
// TODO: setter/gettter for List to get selectedItem
// TODO: prompt
// TODO: PopupManager (!)

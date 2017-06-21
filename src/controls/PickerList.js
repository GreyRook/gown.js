var Control = require('../core/Control');
var ToggleButton = require('./ToggleButton');
var List = require('./List');
var Point = PIXI.Point;

/**
 * PickerList allows the user to select an option from a list
 *
 * @class PickerList
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the picker list {GOWN.Theme}
 */
function PickerList(theme) {
    this.theme = theme;

    Control.call(this);

    // TODO: Icons for Button

    /**
     * A function that is expected to return a new GOWN.List
     *
     * @private
     * @type function
     * @default this._defaultListFactory
     */
    this._listFactory = this._listFactory || this._defaultListFactory;

    /**
     * A function that is expected to return a new GOWN.ToggleButton
     *
     * @private
     * @type function
     * @default this._defaultButtonFactory
     */
    this._buttonFactory = this._buttonFactory || this._defaultButtonFactory;

    // TODO: implement PopUpManager!
    /**
     * TODO
     *
     * @type GOWN.PickerList
     * @default this
     */
    this.popUpParent = this;

    /**
     * Invalidate list so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidList = true;

    /**
     * Invalidate button so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidButton = true;
}

PickerList.prototype = Object.create( Control.prototype );
PickerList.prototype.constructor = PickerList;
module.exports = PickerList;

/**
 * Default picker list skin name
 *
 * @static
 * @final
 * @type String
 */
PickerList.SKIN_NAME = 'picker_list';

/**
 * Toggle the list
 *
 * @private
 */
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
 *
 * @param [theme] theme for the list {GOWN.Theme}
 * @private
 */
PickerList.prototype._defaultListFactory = function(theme) {
    return new List(theme);
};

/**
 * Creates and adds the button sub-component and removes the old instance, if one exists.
 * Meant for internal use, and subclasses may override this function with a custom implementation.
 *
 * @param [theme] theme for the list {GOWN.Theme}
 * @private
 */
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

/**
 * Set item renderer factory for the GOWN.List
 *
 * @name GOWN.PickerList#itemRendererFactory
 * @type function
 */
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

/**
 * Set the data provider for the GOWN.List
 *
 * @name GOWN.PickerList#dataProvider
 * @type Array
 */
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

/**
 * Set item renderer properties for the GOWN.List
 *
 * @name GOWN.List#itemRendererProperties
 * @type Object
 */
Object.defineProperty(PickerList.prototype, 'itemRendererProperties', {
    set: function(itemRendererProperties) {
        if (this.list) {
            this.list.itemRendererProperties = itemRendererProperties;
        }
        this._itemRendererProperties = itemRendererProperties;
    },
    get: function() {
        return this._itemRendererProperties;
    }
});

/**
 * Create the picker list button
 *
 * @private
 */
PickerList.prototype.createButton = function() {
    this.button = this._buttonFactory(this.theme);

    this.button.width = this.width;
    this.button.height = this.height;

    this.button.on('mouseup', this._clickList, this);
    this.button.on('touchend', this._clickList, this);

    this.addChild(this.button);
};

/**
 * Create the picker list internal GOWN.List
 *
 * @private
 */
PickerList.prototype.createList = function() {
    this.list = this._listFactory(this.theme);
    if (this.dataProvider) {
        this.list._dataProvider = this.dataProvider;
    }
    if (this.itemRendererFactory) {
        this.list.itemRendererFactory = this.itemRendererFactory;
    }
    if (this.itemRendererProperties) {
        this.list.itemRendererProperties = this.itemRendererProperties;
    }
    // forward list events
    this.list.on(List.CHANGE, this._listChange, this);
};

/**
 * Forward list events
 *
 * @param itemRenderer The item renderer {Array}
 * @param value {String}
 * @private
 */
PickerList.prototype._listChange = function(itemRenderer, value) {
    this.emit(List.CHANGE, itemRenderer, value);
    if (this.button && value) {
        this.button.label = itemRenderer.label;
    }
    this.closeList();
};

/**
 * Update before draw call
 *
 * @protected
 */
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

/**
 * Destroy button and list and remove button listeners
 */
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
// TODO: setter/getter for List to get selectedItem
// TODO: prompt
// TODO: PopupManager (!)

var EventEmitter = require('eventemitter3');
var ToggleButton = require('./ToggleButton');

/**
 * Controls the selection of two or more toggles
 * (RadioButtons/ToggleButton/Check instances)
 * where only one may be selected at a time
 *
 * @class ToggleGroup
 * @memberof GOWN
 * @constructor
 */
function ToggleGroup() {
    // list of toggle (RadioButtons/ToggleButton/Check) in the group
	this._items = [];
    // The currently selected toggle.
	this._selectedItem = null;
    // Determines if the user can deselect the currently selected item or not.
    this._isSelectionRequired = true;
	EventEmitter.call(this);
}

ToggleGroup.prototype = Object.create( EventEmitter.prototype );
ToggleGroup.prototype.constructor = ToggleGroup;
module.exports = ToggleGroup;

ToggleGroup.CHANGE = 'change';

/**
 * Adds a toggle to the group.
 *
 * @property radioButton
 * @type RadioButton
 */
ToggleGroup.prototype.addItem = function(item) {
    if (this._items.indexOf(item) === -1) {
    	this._items.push(item);
		item.on(ToggleButton.CHANGE, this._toggleChanged, this);
        // new radio button is selected, unselect the old one
    	if (item.selected) {
    		if (this.selectedItem) {
    			this.selectedItem.setSelected(false);
    		}
    		this.selectedItem = item;
    	}
    }
};

ToggleGroup.prototype._toggleChanged = function(item) {
	if (item === this.selectedItem && this._isSelectionRequired && !item.selected) {
		item.setSelected(true);
	} else if (item.selected) {
		this.selectedItem = item;
	}
};

/**
 * Remove a Radio Button that is currently being tracked
 *
 * @property radioButton
 * @type RadioButton
 */
ToggleGroup.prototype.removeItem = function(item) {
	var index = this._items.indexOf(item);
	if (index !== -1) {
		item.off(ToggleButton.CHANGE, this._toggleChanged, this);
		this._items.remove(index);
        // removed item was selected!
		if (this.selectedItem === item) {
			this.selectedItem = null;
		}
	}
};

/**
 * remove all event listener, clear items-list and set selectedItem to null.
 */
ToggleGroup.prototype.destroy = function() {
	while (this._items.length > 0) {
		var item = this._items.pop();
		item.off(ToggleButton.CHANGE, this._toggleChanged, this);
	}
	this.selectedItem = null;
};

/**
 * The currently selected toggle
 *
 * @property selectedItem
 * @type Check
 */
Object.defineProperty(ToggleGroup.prototype, 'selectedItem', {
    get: function() {
        return this._selectedItem;
    },
    set: function(item) {
        if (item === null && this._isSelectionRequired) {
            // item is null, but we need to select something, so we assume
            // the user wants to set the first item as selected instead
            item = this._items[0];
        } else if (this._items.indexOf(item) === -1) {
            return;
        }
        if (item) {
            item.setSelected(true);
        }
        // unselect any previously selected item
        if (this.selectedItem) {
	        this._selectedItem.setSelected(false);
        }
		this._selectedItem = item;
		this.emit(ToggleGroup.CHANGE, item);
    }
});


/**
 * The index of the currently selected toggle.
 *
 * @property selectedIndex
 * @type RadioButton
 */
Object.defineProperty(ToggleGroup.prototype, 'selectedIndex', {
    get: function() {
        return this._items.indexOf(this._selectedItem);
    },
    set: function(index) {
        if (index >= 0 && index < this._items.length &&
            this.selectedIndex !== index) {
            this.selectedItem = this._items[index];
        }
    }
});

/**
 * Determines if the user can deselect the currently selected item or not.
 */
Object.defineProperty(ToggleGroup.prototype, 'isSelectionRequired', {
    get: function () {
        return this._isSelectionRequired;
    },
    set: function(isSelectionRequired) {
        if (isSelectionRequired && !this._selectedItem && this._items.length > 0) {
            this.selectedItem = this._items[0];
        }
        this._isSelectionRequired = isSelectionRequired;
    }
});

var EventEmitter = require('eventemitter3');

/**
 * Used to handle data manipulation (emit events when data changes, so for
 *  example a List showing it can be updated and the user does not need to
 *  call a special update function every time he adds/removes data from the
 *  ListCollection.
 * Use the ListCollection functions to manipulate the data-array OR modify it
 * using the default array-functions and dispatch the CHANGED-Event yourself.
 *
 * @class ListCollection
 * @extends EventEmitter
 * @memberof GOWN
 * @constructor
 * @param [data] The data source {Array}
 */
function ListCollection(data) {
    EventEmitter.call(this);

    if (!data) {
        data = [];
    }
    this.data = data;
}

ListCollection.prototype = Object.create( EventEmitter.prototype );
ListCollection.prototype.constructor = ListCollection;
module.exports = ListCollection;

/**
 * Dispatched when the list data gets changed.
 *
 * @static
 * @final
 * @type String
 */
ListCollection.CHANGED = 'changed';

/**
 * Dispatched when the list gets cleared.
 *
 * @static
 * @final
 * @type String
 */
ListCollection.RESET = 'reset';

/**
 * Dispatched when a list item gets removed from the list.
 *
 * @static
 * @final
 * @type String
 */
ListCollection.REMOVE_ITEM = 'removeItem';

/**
 * Dispatched when a list item gets replaced.
 *
 * @static
 * @final
 * @type String
 */
ListCollection.REPLACE_ITEM = 'replaceItem';

/**
 * Dispatched when an item gets added to the list.
 *
 * @static
 * @final
 * @type String
 */
ListCollection.ADD_ITEM = 'addItem';

/**
 * The data source for this collection. Has to be an array.
 *
 * @name GOWN.ListCollection#data
 * @type Array
 */
Object.defineProperty(ListCollection.prototype, 'data', {
    set: function(data) {
        this._data = data;
        this.emit(ListCollection.CHANGED);
    },
    get: function() {
        return this._data;
    }
});

/**
 * The length of the list
 *
 * @name GOWN.ListCollection#length
 * @type Number
 * @readonly
 */
Object.defineProperty(ListCollection.prototype, 'length', {
    get: function() {
        if (!this.data) {
            return 0;
        }
        return this._data.length;
    }
});

/**
 * Get an item at a specific index
 *
 * @param index The index to get the item from {Number}
 * @returns {Object} The item at the specific index
 */
ListCollection.prototype.getItemAt = function(index) {
    return this._data[index];
};

/**
 * Get the index of a list item
 *
 * @param item The list item {Object}
 * @returns {Number} The item index
 */
ListCollection.prototype.getItemIndex = function(item) {
    return this._data.indexOf(item);
};

/**
 * Add a new item between index and index+1
 *
 * @param item The new item {Object}
 * @param index The index where the item gets inserted {Number}
 */
ListCollection.prototype.addItemAt = function(item, index) {
    this._data.splice(index, 0, item);
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.ADD_ITEM, item, index);
};

/**
 * Removes the item at the specific index from the collection and
 * returns it.
 *
 * @param index The item index {Number}
 * @returns {Object}
 */
ListCollection.prototype.removeItemAt = function (index) {
    var item = this._data.splice(index, 1);
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.REMOVE_ITEM, item, index);
    return item;
};

/**
 * Removes an item from the list
 *
 * @param item The item to remove {Object}
 */
ListCollection.prototype.removeItem = function (item) {
    var index = this.getItemIndex(item);
    if (index >= 0) {
		this.removeItemAt(index);
	}
};

/**
 * Removes all items from the list
 *
 * @param item
 */
ListCollection.prototype.removeAll = function (item) {
    if (this._data.length === 0) {
        return;
    }
    this._data.length = 0;
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.RESET);
};

/**
 * Set an item at a specific index
 *
 * @param item The item that gets added {Object}
 * @param index The index where the item gets set {Number}
 */
ListCollection.prototype.setItemAt = function (item, index) {
    this._data[index] = item;
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.REPLACE_ITEM, index, item);
};

/**
 * Push an item on the list at the last position
 *
 * @param item The item to push {Object}
 */
ListCollection.prototype.push = function (item) {
    this._data.push(item);
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.ADD_ITEM, item, this._data.length-1);
};

/**
 * Pop the last item from the last
 */
ListCollection.prototype.pop = function () {
    var item = this._data.pop();
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.REMOVE_ITEM, item, this._data.length);
};

/**
 * Add an item to the front of the list
 *
 * @param item The item to add {Object}
 */
ListCollection.prototype.unshift = function (item) {
    this.addItemAt(item, 0);
};

/**
 * Remove the item at the front of the list
 */
ListCollection.prototype.shift = function () {
    this.removeItemAt(0);
};

/**
 * Checks if an item is in the list
 *
 * @param item The item to check {Object}
 * @returns {boolean} True if the item is in the list, otherwise false
 */
ListCollection.prototype.contains = function (item) {
    return this.getItemIndex(item) >= 0;
};

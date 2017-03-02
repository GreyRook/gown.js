var EventEmitter = require('eventemitter3');

/**
 * used to handle data manipulation (emit events when data changes so for
 *  example a List showing it can be updated and the user does not need to
 *  call a special update function every time he adds/removes data from the
 *  ListCollection.
 * use the ListCollection functions to manipulate the data-array OR modify it
 * using the default array-functions and dispatch the CHANGED-Event yourself.
 *
 * @class ListCollection
 * @extends GOWN.ListCollection
 * @memberof GOWN
 * @constructor
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

ListCollection.CHANGED = 'changed';

ListCollection.RESET = 'reset';
ListCollection.REMOVE_ITEM = 'removeItem';
ListCollection.REPLACE_ITEM = 'replaceItem';
ListCollection.ADD_ITEM = 'addItem';

/**
 * The data source for this collection. Has to be an array.
 *
 * @property data
 * @type Object
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

Object.defineProperty(ListCollection.prototype, 'length', {
    get: function() {
        if (!this.data) {
            return 0;
        }
        return this._data.length;
    }
});

ListCollection.prototype.getItemAt = function(index) {
    return this._data[index];
};

ListCollection.prototype.getItemIndex = function(item) {
    return this._data.indexOf(item);
};

/**
 * add new item between index and index+1
 */
ListCollection.prototype.addItemAt = function(item, index) {
    this._data.splice(index, 0, item);
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.ADD_ITEM, item, index);
};

/**
 * Removes the item at the specified index from the collection and
 * returns it.
 */
ListCollection.prototype.removeItemAt = function (index) {
    var item = this._data.splice(index, 1);
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.REMOVE_ITEM, item, index);
    return item;
};

ListCollection.prototype.removeItem = function (item) {
    var index = this.getItemIndex(item);
    if (index >= 0) {
		this.removeItemAt(index);
	}
};


ListCollection.prototype.removeAll = function (item) {
    if (this._data.length === 0) {
        return;
    }
    this._data.length = 0;
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.RESET);
};

ListCollection.prototype.setItemAt = function (item, index) {
    this._data[index] = item;
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.REPLACE_ITEM, index, item);
};

ListCollection.prototype.push = function (item) {
    this._data.push(item);
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.ADD_ITEM, item, this._data.length-1);
};

ListCollection.prototype.pop = function () {
    var item = this._data.pop();
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.REMOVE_ITEM, item, this._data.length);
};

ListCollection.prototype.unshift = function (item) {
    this.addItemAt(item, 0);
};

ListCollection.prototype.shift = function () {
    this.removeItemAt(0);
};

ListCollection.prototype.contains = function (item) {
    return this.getItemIndex(item) >= 0;
};

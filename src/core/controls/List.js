var Scroller = require('./Scroller');

/**
 * The basic list
 *
 * @class List
 * @extends PIXI_UI.List
 * @memberof PIXI_UI
 * @constructor
 */
function List(dataProvider, theme) {
    Scroller.call(this, theme);
    this.skinName = this.skinName || List.SKIN_NAME;

    // Determines if items in the list may be selected.
    this._selectable = true;

    // The index of the currently selected item.
    this._selectedIndex = -1;

    // If true multiple items may be selected at a time.
    this._allowMultipleSelection = false;

    // The indices of the currently selected items.
    this._selectedIndices = [];

    // The collection of data displayed by the list.
    this._dataProvider = dataProvider;
    this.itemRendererProperties = {};
    // TODO: set layout (defaults to VerticalLayout)
}

List.prototype = Object.create( Scroller.prototype );
List.prototype.constructor = List;
module.exports = List;

// name of skin that will be applied
List.SKIN_NAME = 'list';

/**
 * A function called that is expected to return a new item renderer
 */
List.prototype.itemRendererFactory = function() {
    return null;
};

/**
 * dataProvider for list
 * the dataProvider is a sturcture thats provides the data.
 * in its simplest form it is a array containing the data
 *
 * @property dataProvider
 * @type Array
 */
Object.defineProperty(List.prototype, 'dataProvider', {
    set: function(dataProvider) {
        if (this._dataProvider === dataProvider) {
            return;
        }
        this.selectedIndex = -1;
        this._dataProvider = dataProvider;

        //reset the scroll position because this is a drastic change and
        //the data is probably completely different
        this.horizontalScrollPosition = 0;
        this.verticalScrollPosition = 0;
        // TODO: invalidate
    },
    get: function() {
        return this._dataProvider;
    }
});

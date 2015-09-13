var Scroller = require('./Scroller');

/**
 * The basic list
 *
 * @class List
 * @extends PIXI_UI.List
 * @memberof PIXI_UI
 * @constructor
 */
function List(theme, data) {
    Scroller.call(this); // TODO: extend scroller?
    this.skinName = this.skinName || List.SKIN_NAME;

    this._selectable = true;
    this._selectedIndex = -1;
    this._allowMultipleSelection = false;
    this._selectedIndices = [];

    this.dataProvider = data;
    this.itemRendererProperties = {};

    // TODO: set layout (defaults to VerticalLayout)
}

List.prototype = Object.create( Scroller.prototype );
List.prototype.constructor = List;
module.exports = List;

// name of skin that will be applied
List.SKIN_NAME = 'list';

/**
 * dataProvider for list
 * the dataProvider is a simple array containing the data
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
        // TODO: invalidate
    },
    get: function() {
        return this._dataProvider;
    }
});

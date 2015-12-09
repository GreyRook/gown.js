var Scroller = require('./Scroller');
var ListCollection = require('../data/ListCollection');
var LayoutGroup = require('./LayoutGroup');
var VerticalLayout = require('../layout/VerticalLayout');
var DefaultListItemRenderer = require('./renderer/DefaultListItemRenderer');

/**
 * The basic list
 *
 * @class List
 * @extends GOWN.List
 * @memberof GOWN
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

    this._itemChangeHandler = this.itemChangeHandler.bind(this);
    this._itemRendererChangeHandler = this.itemRendererChangeHandler.bind(this);

    // create new instance of the item renderer
    this.itemRendererFactory = this._itemRendererFactory;

    // The collection of data displayed by the list.
    this.dataProvider = dataProvider;

    /**
     * properties that will be passed down to every item
     * renderer when the list validates.
     */
    this.itemRendererProperties = {};

    // TODO: itemRendererStyleName (?)

    // initialize
    if (!this.viewPort) {

        // We do not implement ListDataViewPort from feathers
        // (most of what that it does is implemented in List directly to
        //  manage the viewport)
        // and instead use the normal LayoutGroup (less abstraction, less code)
        this.viewPort = new LayoutGroup();
    }

    var layout = this._layout;

    if (!layout) {
        layout = new VerticalLayout();
        layout.padding = 0;
        layout.gap = 0;
        layout.horizontalAlign = VerticalLayout.HORIZONTAL_ALIGN_JUSTIFY;
        layout.verticalAlign = VerticalLayout.VERTICAL_ALIGN_TOP;
    }
    // use setter to set layout of the viewport
    this.layout = layout;
}

List.prototype = Object.create( Scroller.prototype );
List.prototype.constructor = List;
module.exports = List;

// name of skin that will be applied
List.SKIN_NAME = 'list';

/**
 * Dispatched when the selected item changes.
 */
List.CHANGE = 'change';


/**
 * A function called that is expected to return a new item renderer
 */
List.prototype._itemRendererFactory = function(theme) {
    return new DefaultListItemRenderer(theme);
};

List.prototype.itemChangeHandler = function() {
    // this code is executed when new data is added or removed
    // to the dataProvider
    // TODO: test code so it will handle if item is removed
    // deselect removed items
    var index = this._dataProvider.data.length;
    if (this._selectedIndex >= index) {
        this._selectedIndex = -1;
    }
    var indexCount = this._selectedIndices.length;
    for (var i = 0; i < indexCount; i++) {
        var currentIndex = this._selectedIndices[i];
        if (currentIndex >= index) {
            this._selectedIndices.splice(i, 1);
        }
    }
    // force redraw
    this.dataInvalid = true;
};


// performance increase to avoid using call.. (10x faster)
List.prototype.scrollerRedraw = Scroller.prototype.redraw;
/**
 * update before draw call
 *
 * @method redraw
 */
List.prototype.redraw = function() {
    var basicsInvalid = this.dataInvalid;
    if (basicsInvalid) {
        this.refreshRenderers();
    }
    this.scrollerRedraw();
};

List.prototype.refreshRenderers = function () {
    //TODO: update only new renderer
    //      see ListDataViewPort --> refreshInactieRenderers
    this._itemRenderer = []
    if (this._dataProvider && this.viewPort) {
        this.viewPort.removeChildren();
        for (var i = 0; i < this._dataProvider.length; i++) {
            var item = this._dataProvider.getItemAt(i);
            var itemRenderer = this.itemRendererFactory(this.theme);
            itemRenderer.on('change', this._itemRendererChangeHandler);
            itemRenderer.width = 100;
            itemRenderer.percentHeight = 100;
            itemRenderer.data = item;
            this._itemRenderer.push(itemRenderer);
            this.viewPort.addChild(itemRenderer);
        }
    }

    this.dataInvalid = false;
};

/**
 * item catch/forward renderer change event
 * this is thrown when the state of the itemRenderer Changes
 * (e.g. from unselected to selected), not when the data changes
 */
List.prototype.itemRendererChangeHandler = function(itemRenderer, value) {
    // TODO: update selected item
    this._selectedIndices = [];

    for (var i = 0; i < this._itemRenderer.length; i++) {
        if (this._itemRenderer[i].selected) {
            if (this.allowMultipleSelection) {
                this._selectedIndices.push(i);
            } else {
                this._selectedIndices = [i];
                break;
            }
        }
    }

    this.emit('change', itemRenderer, value);
};

/**
 * set layout and ass eventlistener to it
 *
 * @property layout
 * @type LayoutAlignment
 */
Object.defineProperty(List.prototype, 'layout', {
    set: function(layout) {
        if (this._layout === layout) {
            return;
        }
        if (this.viewPort) {
            // this is different from feathers - there the viewport does not
            // know the layout (feathers uses ListDataViewPort, not LayoutGroup
            // as viewPort for List)
            this.viewPort.layout = layout;
        }
        // TODO: this.invalidate(INVALIDATION_FLAG_LAYOUT);
    },
    get: function() {
        return this._layout;
    }
});


/**
 * allow/disallow multiple selection
 * if selection has been disallowed, deselect all but one.
 *
 * @property allowMultipleSelection
 * @type Boolean
 */
 Object.defineProperty(List.prototype, 'allowMultipleSelection', {
     set: function(allowMultipleSelection) {
         if (this._allowMultipleSelection === allowMultipleSelection) {
             return;
         }
         this._allowMultipleSelection = allowMultipleSelection;

         if (!this._allowMultipleSelection && this._selectedIndices) {
             // only last index is selected
             this._selectedIndices = [this._selectedIndices.pop()];
         }
         this.refreshSelection();
     },
     get: function() {
         return this._allowMultipleSelection;
     }
 });


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
        if (!(dataProvider instanceof ListCollection || dataProvider === null)) {
            throw new Error('the dataProvider has to be a GOWN.ListCollection');
        }

        if (this._dataProvider) {
            this._dataProvider.off(ListCollection.CHANGED, this._itemChangeHandler);
        }
        this._dataProvider = dataProvider;

        //reset the scroll position because this is a drastic change and
        //the data is probably completely different
        this.horizontalScrollPosition = 0;
        this.verticalScrollPosition = 0;

        if (this._dataProvider) {
            this._dataProvider.on(ListCollection.CHANGED, this._itemChangeHandler);
        }

        this.selectedIndex = -1;
        this.dataInvalid = true;
    },
    get: function() {
        return this._dataProvider;
    }
});

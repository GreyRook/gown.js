var Scroller = require('./Scroller');
var ListCollection = require('../data/ListCollection');
var LayoutGroup = require('./LayoutGroup');
var DefaultListItemRenderer = require('./renderers/DefaultListItemRenderer');

/**
 * The basic list
 *
 * @class List
 * @extends GOWN.Scroller
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the list {Theme}
 */
function List(theme) {
    Scroller.call(this, theme);

    /**
     * The skin name
     *
     * @type String
     * @default List.SKIN_NAME
     */
    this.skinName = this.skinName || List.SKIN_NAME;

    /**
     * Determines if items in the list may be selected. (not implemented yet)
     *
     * @private
     * @type bool
     * @default true
     */
    this._selectable = true;

    /**
     * The index of the currently selected item.
     *
     * @private
     * @type Number
     * @default -1
     */
    this._selectedIndex = -1;

    /**
     * If true multiple items may be selected at a time.
     *
     * @private
     * @type bool
     * @default false
     */
    this._allowMultipleSelection = false;

    /**
     * The indices of the currently selected items.
     *
     * @private
     * @type Number[]
     * @default []
     */
    this._selectedIndices = [];

    /**
     * The item renderer
     *
     * @private
     * @type Array
     * @default []
     */
    this._itemRenderer = [];

    /**
     * The item change handler
     *
     * @private
     * @type function
     */
    this._itemChangeHandler = this.itemChangeHandler.bind(this);

    /**
     * The item renderer change handler
     *
     * @private
     * @type function
     */
    this._itemRendererChangeHandler = this.itemRendererChangeHandler.bind(this);

    /**
     * The item renderer factory creates a new instance of the item renderer
     *
     * @private
     * @type function
     * @default this._defaultItemRendererFactory
     */
    this._itemRendererFactory = this._itemRendererFactory || this._defaultItemRendererFactory;

    /**
     * Properties that will be passed down to every item renderer when the list validates.
     *
     * @private
     * @type Object
     * @default {}
     */
    this._itemRendererProperties = {};

    // TODO: itemRendererStyleName (?)

    if (!this.viewPort) {
        /**
         * We do not implement ListDataViewPort from feathers
         * (most of what it does is implemented in List directly to
         * manage the viewport)
         * and instead use the normal LayoutGroup (less abstraction, less code)
         *
         * @private
         * @type GOWN.LayoutGroup
         */
        this.viewPort = new LayoutGroup();
    }
    this.layoutChanged = true;
}

List.prototype = Object.create( Scroller.prototype );
List.prototype.constructor = List;
module.exports = List;

/**
 * Default list skin name
 *
 * @static
 * @final
 * @type String
 */
List.SKIN_NAME = 'list';

/**
 * Dispatched when the selected item changes.
 *
 * @static
 * @final
 * @type String
 */
List.CHANGE = 'change';

/**
 */

/**
 * A function that is expected to return a new item renderer*
 *
 * @param theme The item theme {Theme}
 * @returns {DefaultListItemRenderer}
 * @private
 */
List.prototype._defaultItemRendererFactory = function(theme) {
    return new DefaultListItemRenderer(theme);
};

/**
 * Gets called when new data is added or removed
 * to the dataProvider
 *
 * @protected
 */
List.prototype.itemChangeHandler = function() {
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

/**
 * Select one of the items
 *
 * @param item The item to select {String}
 */
List.prototype.selectItem = function(item) {
    this.selectedIndex = this._dataProvider.data.indexOf(item);
};


/**
 * @private
 */
// performance increase to avoid using call.. (10x faster)
List.prototype.scrollerRedraw = Scroller.prototype.redraw;

/**
 * Update before draw call
 *
 * @protected
 */
List.prototype.redraw = function() {
    var basicsInvalid = this.dataInvalid;
    if (basicsInvalid) {
        this.refreshRenderers();
    }
    this.scrollerRedraw();

    if (!this.layout) {
        var layout = new GOWN.layout.VerticalLayout();
        layout.padding = 0;
        layout.gap = 0;
        layout.horizontalAlign = GOWN.layout.VerticalLayout.HORIZONTAL_ALIGN_JUSTIFY;
        layout.verticalAlign = GOWN.layout.VerticalLayout.VERTICAL_ALIGN_TOP;
        this.layout = layout;
    }
};

/**
 * Refresh the renderers
 */
List.prototype.refreshRenderers = function () {
    //TODO: update only new renderer
    //      see ListDataViewPort --> refreshInactieRenderers
    this._itemRenderer.length = 0;
    if (this._dataProvider && this.viewPort) {
        this.viewPort.removeChildren();
        for (var i = 0; i < this._dataProvider.length; i++) {
            var item = this._dataProvider.getItemAt(i);
            var itemRenderer = this._itemRendererFactory(this.theme);

            if (this._itemRendererProperties) {
                itemRenderer.labelField = this._itemRendererProperties.labelField;
            }

            itemRenderer.on('change', this._itemRendererChangeHandler);
            itemRenderer.data = item;
            this._itemRenderer.push(itemRenderer);
            this.viewPort.addChild(itemRenderer);
        }
    }

    this.dataInvalid = false;
};

/**
 * Item catch/forward renderer change event.
 * This is thrown when the state of the itemRenderer changes
 * (e.g. from unselected to selected), not when the data changes
 *
 * @protected
 */
List.prototype.itemRendererChangeHandler = function(itemRenderer, value) {
    // TODO: update selected item
    var i;
    this._selectedIndices.length = 0;

    if (!this.allowMultipleSelection) {
        for (i = 0; i < this._itemRenderer.length; i++) {
            if (this._itemRenderer[i] !== itemRenderer && value === true) {
                this._itemRenderer[i].selected = false;
            }
        }
        if (value === true) {
            this._selectedIndices = [this._itemRenderer.indexOf(itemRenderer)];
        }
    } else {
        for (i = 0; i < this._itemRenderer.length; i++) {
            if (this._itemRenderer[i].selected === true) {
                this._selectedIndices.push(i);
            }
        }
    }

    this.emit(List.CHANGE, itemRenderer, value);
};

/**
 * Set layout and pass event listener to it
 *
 * @name GOWN.List#layout
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
 * Set item renderer properties (e.g. labelField) and update all itemRenderer
 *
 * @name GOWN.List#itemRendererProperties
 * @type Object
 */
Object.defineProperty(List.prototype, 'itemRendererProperties', {
    set: function(itemRendererProperties) {
        this._itemRendererProperties = itemRendererProperties;
        this.dataInvalid = true;
    },
    get: function() {
        return this._itemRendererProperties;
    }
});


/**
 * Set item renderer factory (for custom item Renderer)
 *
 * @name GOWN.List#itemRendererFactory
 * @type function
 */
Object.defineProperty(List.prototype, 'itemRendererFactory', {
    set: function(itemRendererFactory) {
        this._itemRendererFactory = itemRendererFactory;
        this.dataInvalid = true;
    },
    get: function() {
        return this._itemRendererFactory;
    }
});

/**
 * Allow/disallow multiple selection.
 * If selection has been disallowed, deselect all but one.
 *
 * @name GOWN.List#allowMultipleSelection
 * @type bool
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
         //TODO: this.refreshSelection();
     },
     get: function() {
         return this._allowMultipleSelection;
     }
 });

/**
 * The index of the selected item
 *
 * @name GOWN.List#selectedIndex
 * @type Number
 */
Object.defineProperty(List.prototype, 'selectedIndex', {
    set: function(selectedIndex) {
        this._selectedIndex = selectedIndex;
        // force redraw
        this.dataInvalid = true;
    },
    get: function() {
        return this._selectedIndex;
    }
});

/**
 * dataProvider for list.
 * The dataProvider is a structure that provides the data.
 * In its simplest form it is an array containing the data
 *
 * @name GOWN.List#dataProvider
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

// TODO: selectedItem

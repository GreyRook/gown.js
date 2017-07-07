/**
 * Basic layout stub - see GOWN.LayoutAlignment
 *
 * @class Layout
 * @memberof GOWN.layout
 * @constructor
 */
function Layout() {
    this.gap = 0;
    this.padding = 0;
    this.layoutChildren = true;
}

module.exports = Layout;

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the top.
 *
 * @static
 * @final
 * @type String
 */
Layout.VERTICAL_ALIGN_TOP = 'top';

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the middle.
 *
 * @static
 * @final
 * @type String
 */
Layout.VERTICAL_ALIGN_MIDDLE = 'middle';

/**
 * Alignment justified
 *
 * @static
 * @final
 * @type String
 */
Layout.ALIGN_JUSTIFY = 'justify';

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the bottom.
 *
 * @static
 * @final
 * @type String
 */
Layout.VERTICAL_ALIGN_BOTTOM = 'bottom';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the left.
 *
 * @static
 * @final
 * @type String
 */
Layout.HORIZONTAL_ALIGN_LEFT = 'left';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the center.
 *
 * @static
 * @final
 * @type String
 */
Layout.HORIZONTAL_ALIGN_CENTER = 'center';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the right.
 *
 * @static
 * @final
 * @type String
 */
Layout.HORIZONTAL_ALIGN_RIGHT = 'right';

/**
 * The space, in pixels, between items.
 *
 * @name GOWN.layout.Layout#gap
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'gap', {
    get: function() {
        return this._gap;
    },
    set: function(value) {
        if(this._gap === value) {
            return;
        }
        this._gap = value;
        this._needUpdate = true;
    }
});

/**
 * Indicates if the layout needs to be rearranged.
 *
 * @name GOWN.layout.Layout#needUpdate
 * @readonly
 */
Object.defineProperty(Layout.prototype, 'needUpdate', {
    get: function() {
        return this._needUpdate;
    }
});

/**
 * Shortcut to set all paddings (left, right, top, bottom)
 *
 * @name GOWN.layout.Layout#padding
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'padding', {
    set: function(value) {
        this._paddingLeft = value;
        this._paddingRight = value;
        this._paddingBottom = value;
        this._paddingTop = value;
        this._needUpdate = true;
    },
    get: function (){
        // just return paddingTop, because we do not save the
        // overall padding value (just like feathers)
        return this._paddingTop;
    }
});

/**
 * The minimum space, in pixels, above the items.
 *
 * @name GOWN.layout.Layout#paddingTop
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'paddingTop', {
    get:  function() {
        return this._paddingTop;
    },
    set: function(value) {
        if(this._paddingTop === value) {
            return;
        }
        this._paddingTop = value;
        this._needUpdate = true;
    }
});

/**
 * The minimum space, in pixels, below the items.
 *
 * @name GOWN.layout.Layout#paddingBottom
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'paddingBottom', {
    get:  function() {
        return this._paddingBottom;
    },
    set: function(value) {
        if(this._paddingBottom === value) {
            return;
        }
        this._paddingBottom = value;
        this._needUpdate = true;
    }
});

/**
 * The space, in pixels, that appears to the left, before the first
 * item.
 *
 * @name GOWN.layout.Layout#paddingLeft
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'paddingLeft', {
    get:  function() {
        return this._paddingLeft;
    },
    set: function(value) {
        if(this._paddingLeft === value) {
            return;
        }
        this._paddingLeft = value;
        this._needUpdate = true;
    }
});

/**
 * The space, in pixels, that appears to the right, after the last item.
 *
 * @name GOWN.layout.Layout#paddingLeft
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'paddingRight', {
    get:  function() {
        return this._paddingRight;
    },
    set: function(value) {
        if(this._paddingRight === value) {
            return;
        }
        this._paddingRight = value;
        this._needUpdate = true;
    }
});

/**
 * Position (and possibly resize) the supplied items.
 *
 * @param items items that will be layouted {Array}
 * @param viewPortBounds {ViewPortBounds}
 */
/* jshint unused: false */
Layout.prototype.layout = function (items, viewPortBounds) {
};

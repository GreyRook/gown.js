/**
 * basic layout stub - see LayoutAlignment
 *
 * @class Layout
 * @memberof GOWN
 * @constructor
 */
function Layout() {
    this.gap = 0;
    this.padding = 0;
}

module.exports = Layout;

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the top.
 *
 * @property VERTICAL_ALIGN_TOP
 * @static
 */
Layout.VERTICAL_ALIGN_TOP = 'top';

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the middle.
 *
 * @property VERTICAL_ALIGN_MIDDLE
 * @static
 */
Layout.VERTICAL_ALIGN_MIDDLE = 'middle';

/**
 * Alignment justified
 *
 * @property ALIGN_JUSTIFY
 * @static
 */
Layout.ALIGN_JUSTIFY = 'justify';

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the bottom.
 *
 * @property VERTICAL_ALIGN_BOTTOM
 * @static
 */
Layout.VERTICAL_ALIGN_BOTTOM = 'bottom';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the left.
 *
 * @property HORIZONTAL_ALIGN_LEFT
 * @static
 */
Layout.HORIZONTAL_ALIGN_LEFT = 'left';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the center.
 *
 * @property HORIZONTAL_ALIGN_CENTER
 * @static
 */
Layout.HORIZONTAL_ALIGN_CENTER = 'center';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the right.
 *
 * @property HORIZONTAL_ALIGN_RIGHT
 * @static
 */
Layout.HORIZONTAL_ALIGN_RIGHT = 'right';



/**
 * The space, in pixels, between items.
 *
 * @property gap
 * @type Number
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
 * @property needUpdate
 * @readonly
 */
Object.defineProperty(Layout.prototype, 'needUpdate', {
    get: function() {
        return this._needUpdate;
    }
});

/**
 * shotrtcut to set all paddings (left, right, top, bottom)
 *
 * @property padding
 * @type Number
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
 * @default 0
 * @property paddingTop
 * @type Number
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
 * @default 0
 * @property paddingTop
 * @type Number
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
 * @default 0
 * @property paddingLeft
 * @type Number
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
 * @default 0
 * @property paddingLeft
 * @type Number
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
 * Position (and possibly resizes) the supplied items.
 *
 * @method layout
 * @param items items that will be layouted {Array}
 * @param viewPortBounds {ViewPortBounds}
 */
/* jshint unused: false */
Layout.prototype.layout = function (items, viewPortBounds) {
};

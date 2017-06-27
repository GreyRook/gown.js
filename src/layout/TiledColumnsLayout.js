var TiledLayout = require('./TiledLayout');

/**
 * Tiled columns Layout
 * (roughly based on starling TiledColumnsLayout)
 *
 * @class TiledColumnsLayout
 * @extends GOWN.layout.TiledLayout
 * @memberof GOWN.layout
 * @constructor
 */
function TiledColumnsLayout() {
    TiledLayout.call(this);

    this._paging = TiledLayout.PAGING_VERTICAL;
    this._orientation = TiledLayout.ORIENTATION_COLUMNS;
}

TiledColumnsLayout.prototype = Object.create( TiledLayout.prototype );
TiledColumnsLayout.prototype.constructor = TiledColumnsLayout;
module.exports = TiledColumnsLayout;

/**
 * Quickly sets both <code>horizontalGap</code> and <code>verticalGap</code>
 * to the same value. The <code>gap</code> getter always returns the
 * value of <code>verticalGap</code>, but the value of
 * <code>horizontalGap</code> may be different.
 *
 * @see #_horizontalGap
 * @see #_verticalGap
 *
 * @name GOWN.layout.TiledColumnsLayout#gap
 * @type Number
 * @default 0
 */
Object.defineProperty(TiledColumnsLayout.prototype, 'gap', {
    set: function(value) {
        this._verticalGap = value;
        this._horizontalGap = value;
        this._needUpdate = true;
    },
    get: function() {
        return this._verticalGap;
    }
});

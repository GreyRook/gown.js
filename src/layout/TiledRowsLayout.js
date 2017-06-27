var TiledLayout = require('./TiledLayout');

/**
 * Tiled rows Layout
 * (roughly based on starling TiledRowsLayout)
 *
 * @class TiledRowsLayout
 * @extends GOWN.layout.TiledLayout
 * @memberof GOWN.layout
 * @constructor
 */
function TiledRowsLayout() {
    TiledLayout.call(this);

    this._paging = TiledLayout.PAGING_HORIZONTAL;
    this._orientation = TiledLayout.ORIENTATION_ROWS;
}

TiledRowsLayout.prototype = Object.create( TiledLayout.prototype );
TiledRowsLayout.prototype.constructor = TiledRowsLayout;
module.exports = TiledRowsLayout;

/**
 * Quickly sets both <code>horizontalGap</code> and <code>verticalGap</code>
 * to the same value. The <code>gap</code> getter always returns the
 * value of <code>horizontalGap</code>, but the value of
 * <code>verticalGap</code> may be different.
 *
 * @see #_horizontalGap
 * @see #_verticalGap
 *
 * @name GOWN.layout.TiledRowsLayout#gap
 * @type Number
 * @default 0
 */
Object.defineProperty(TiledRowsLayout.prototype, 'gap', {
    get: function() {
        return this._horizontalGap;
    },
    set: function(value) {
        this._verticalGap = value;
        this._horizontalGap = value;
        this._needUpdate = true;
    }
});

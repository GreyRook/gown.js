/**
 * @author Andreas Bresser
 */

/**
 * Tiled columns Layout
 * (roughly based on starling TiledColumnsLayout)
 *
 * @class TiledRowsLayout
 * @constructor
 */
PIXI_UI.TiledRowsLayout = function() {
    PIXI_UI.TiledLayout.call(this);
    this._paging = PIXI_UI.TiledLayout.PAGING_HORIZONTAL;
    this._orientation = PIXI_UI.TiledLayout.ORIENTATION_ROWS;
};

PIXI_UI.TiledRowsLayout.prototype = Object.create( PIXI_UI.TiledLayout.prototype );
PIXI_UI.TiledRowsLayout.prototype.constructor = PIXI_UI.TiledRowsLayout;

/**
 * Quickly sets both <code>horizontalGap</code> and <code>verticalGap</code>
 * to the same value. The <code>gap</code> getter always returns the
 * value of <code>horizontalGap</code>, but the value of
 * <code>verticalGap</code> may be different.
 *
 * @default 0
 *
 * @see #_horizontalGap
 * @see #_verticalGap
 *
 * @property gap
 * @type Number
 */
Object.defineProperty(PIXI_UI.TiledRowsLayout.prototype, 'gap', {
    get: function() {
        return this._horizontalGap;
    },
    set: function(value) {
        this._verticalGap = value;
        this._horizontalGap = value;
        this._needUpdate = true;
    }
});
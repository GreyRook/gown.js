/**
 * Tiled columns Layout
 * (roughly based on starling TiledColumnsLayout)
 *
 * @class TiledColumnsLayout
 * @constructor
 */

PIXI_UI.TiledColumnsLayout = function() {
    PIXI_UI.TiledLayout.call(this);
    this._paging = PIXI_UI.TiledLayout.PAGING_VERTICAL;
    this._orientation = PIXI_UI.TiledLayout.ORIENTATION_COLUMNS;
};

PIXI_UI.TiledColumnsLayout.prototype = Object.create( PIXI_UI.TiledLayout.prototype );
PIXI_UI.TiledColumnsLayout.prototype.constructor = PIXI_UI.TiledColumnsLayout;

/**
 * Quickly sets both <code>horizontalGap</code> and <code>verticalGap</code>
 * to the same value. The <code>gap</code> getter always returns the
 * value of <code>verticalGap</code>, but the value of
 * <code>horizontalGap</code> may be different.
 *
 * @default 0
 *
 * @see #_horizontalGap
 * @see #_verticalGap
 * @property gap
 * @type Number
 */
Object.defineProperty(PIXI_UI.TiledColumnsLayout.prototype, 'gap', {
    set: function(value) {
        this._verticalGap = value;
        this._horizontalGap = value;
        this._needUpdate = true;
    },
    get: function() {
        return this._verticalGap;
    }
});
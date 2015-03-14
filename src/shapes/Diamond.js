/**
 * @author Andreas Bresser
 */
/**
 * basic diamond shape
 *
 * @class Diamond
 * @constructor
 */
PIXI_UI.Diamond = function(color, alpha, width, height) {
    PIXI_UI.Shape.call(this, color, alpha, width, height);
};

PIXI_UI.Diamond.prototype = Object.create( PIXI_UI.Shape.prototype );
PIXI_UI.Diamond.prototype.constructor = PIXI_UI.Diamond;

/**
 * draw the diamond during redraw.
 *
 * @method _drawShape
 * @private
 */
PIXI_UI.Diamond.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    this.graphics.moveTo(this._width/2, 0)
        .lineTo(this._width, this._height/2)
        .lineTo(this._width/2, this._height)
        .lineTo(0, this._height/2)
        .lineTo(this._width/2, 0);
};
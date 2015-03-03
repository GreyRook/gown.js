/**
 * @author Andreas Bresser
 */
/**
 * basic ellipse shape
 *
 * @class Ellipse
 * @constructor
 */
PIXI_UI.Ellipse = function(color, width, height) {
    PIXI_UI.Shape.call(this, color, width, height);
};

PIXI_UI.Ellipse.prototype = Object.create( PIXI_UI.Shape.prototype );
PIXI_UI.Ellipse.prototype.constructor = PIXI_UI.Ellipse;

/**
 * draw the ellipse during redraw.
 *
 * @method _drawShape
 * @private
 */
PIXI_UI.Ellipse.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    this.drawEllipse(0, 0, this.width, this.height);
};
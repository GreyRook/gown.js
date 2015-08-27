var Shape = require('./Shape');

/**
 * basic ellipse shape
 *
 * @class Ellipse
 * @extends GOWN.Shape
 * @memberof GOWN
 * @constructor
 */
function Ellipse(color, alpha, width, height) {
    Shape.call(this, color, alpha, width, height);
}

Ellipse.prototype = Object.create( Shape.prototype );
Ellipse.prototype.constructor = Ellipse;
module.exports = Ellipse;

/**
 * draw the ellipse during redraw.
 *
 * @method _drawShape
 * @private
 */
Ellipse.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    this.drawEllipse(0, 0, this.width, this.height);
};
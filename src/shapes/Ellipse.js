var Shape = require('./Shape');

/**
 * Basic ellipse shape
 *
 * @class Ellipse
 * @extends PIXI.shape.Shape
 * @memberof PIXI.shape
 * @constructor
 * @param color Color of the ellipse shape {Number}
 * @param alpha Alpha value of the ellipse shape {Number}
 * @param width Width of the ellipse shape {Number}
 * @param height Height of the ellipse shape {Number}
 */
function Ellipse(color, alpha, width, height) {
    Shape.call(this, color, alpha, width, height);
}

Ellipse.prototype = Object.create( Shape.prototype );
Ellipse.prototype.constructor = Ellipse;
module.exports = Ellipse;

/**
 * Draw the ellipse during redraw.
 *
 * @private
 */
Ellipse.prototype._drawShape = function() {
    this.drawEllipse(this.width/2, this.height/2,
        Math.abs(this.width/2),
        Math.abs(this.height/2));
};

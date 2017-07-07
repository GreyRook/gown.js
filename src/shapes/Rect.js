var Shape = require('./Shape');

/**
 * Basic rectangular shape
 *
 * @class Rect
 * @extends GOWN.shapes.Shape
 * @memberof GOWN.shapes
 * @constructor
 * @param color Color of the rectangular shape {Number}
 * @param alpha Alpha value of the rectangular shape {Number}
 * @param width Width of the rectangular shape {Number}
 * @param height Height of the rectangular shape {Number}
 * @param radius Radius of the rectangular shape {Number}
 */
function Rect(color, alpha, width, height, radius) {
    Shape.call(this, color, alpha, width, height);
    this._radius = radius;
}

Rect.prototype = Object.create( Shape.prototype );
Rect.prototype.constructor = Rect;
module.exports = Rect;

/**
 * Draw the rect during redraw. will use drawRoundRect if a radius is provided.
 *
 * @private
 */
Rect.prototype._drawShape = function() {
    if (this.radius) {
        this.drawRoundedRect(
            Math.min(this._width, 0),
            Math.min(this._height, 0),
            Math.abs(this._width),
            Math.abs(this._height),
            this.radius);
    } else {
        this.drawRect(
            Math.min(this._width, 0),
            Math.min(this._height, 0),
            Math.abs(this._width),
            Math.abs(this._height));
    }
};

/**
 * The radius of the rectangle border, setting this will redraw the component.
 *
 * @name GOWN.shapes.Rect#radius
 * @type Number
 */
Object.defineProperty(Rect.prototype, 'radius', {
    get: function() {
        return this._radius;
    },
    set: function(radius) {
        this._radius = radius;
        this.invalid = true;
    }
});

var Shape = require('./Shape');

/**
 * basic rectangular shape
 *
 * @class Rect
 * @extends GOWN.shapes.Shape
 * @memberof GOWN.shapes
 * @constructor
 */

function Rect(color, alpha, width, height, radius) {
    Shape.call(this, color, alpha, width, height);
    this._radius = radius;
}

Rect.prototype = Object.create( Shape.prototype );
Rect.prototype.constructor = Rect;
module.exports = Rect;

/**
 * draw the rect during redraw. will use drawRoundRect if a radius is provided.
 *
 * @method _drawShape
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
 * @property color
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

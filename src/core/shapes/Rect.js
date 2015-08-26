var Shape = require('./Shape');

/**
 * basic rectangular shape
 *
 * @class Rect
 * @extends GOWN.Shape
 * @memberof GOWN
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
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    if (this.radius) {
        this.drawRoundedRect(0, 0,
            this._width, this._height,
            this.radius);
    } else {
        this.drawRect(0, 0, this._width, this._height);
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
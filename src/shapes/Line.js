var Shape = require('./Shape');

/**
 * basic line
 *
 * @class Line
 * @extends GOWN.Shape
 * @memberof GOWN
 * @constructor
 */

function Line(color, alpha, width, height, reverse) {
    Shape.call(this, color, alpha, width, height);
    this._reverse = reverse;
}

Line.prototype = Object.create( Shape.prototype );
Line.prototype.constructor = Line;
module.exports = Line;

/**
 * draw the rect during redraw. will use drawRoundRect if a radius is provided.
 *
 * @method _drawShape
 * @private
 */
Line.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    if (this.reverse) {
        this.moveTo(this._width, 0);
        this.lineTo(0, this._height);
    } else {
        this.moveTo(0, 0);
        this.lineTo(this._width, this._height);
    }
};

/**
 * The radius of the rectangle border, setting this will redraw the component.
 *
 * @property color
 * @type Number
 */
Object.defineProperty(Line.prototype, 'reverse', {
    get: function() {
        return this._reverse;
    },
    set: function(reverse) {
        this._reverse = reverse;
        this.invalid = true;
    }
});

var Shape = require('./Shape');

/**
 * Basic diamond shape
 *
 * @class Diamond
 * @extends GOWN.shapes.Shape
 * @memberof GOWN.shapes
 * @constructor
 * @param color Color of the diamond shape {Number}
 * @param alpha Alpha value of the diamond shape {Number}
 * @param width Width of the diamond shape {Number}
 * @param height Height of the diamond shape {Number}
 */
function Diamond(color, alpha, width, height) {
    Shape.call(this, color, alpha, width, height);
}

Diamond.prototype = Object.create( Shape.prototype );
Diamond.prototype.constructor = Diamond;
module.exports = Diamond;

/**
 * Draw the diamond during redraw.
 *
 * @private
 */
Diamond.prototype._drawShape = function() {
    this.moveTo(this._width/2, 0)
        .lineTo(this._width, this._height/2)
        .lineTo(this._width/2, this._height)
        .lineTo(0, this._height/2)
        .lineTo(this._width/2, 0);
};

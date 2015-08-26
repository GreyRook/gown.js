var Shape = require('./Shape');

/**
 * basic diamond shape
 *
 * @class Diamond
 * @extends GOWN.Shape
 * @memberof GOWN
 * @constructor
 */
function Diamond(color, alpha, width, height) {
    Shape.call(this, color, alpha, width, height);
}

Diamond.prototype = Object.create( Shape.prototype );
Diamond.prototype.constructor = Diamond;
module.exports = Diamond;

/**
 * draw the diamond during redraw.
 *
 * @method _drawShape
 * @private
 */
Diamond.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    this.graphics.moveTo(this._width/2, 0)
        .lineTo(this._width, this._height/2)
        .lineTo(this._width/2, this._height)
        .lineTo(0, this._height/2)
        .lineTo(this._width/2, 0);
};
var Shape = require('./Shape');

/**
 * Basic arrow shape
 *
 * @class Arrow
 * @extends GOWN.shapes.Shape
 * @memberof GOWN.shapes
 * @constructor
 * @param color Color of the arrow {Number}
 * @param alpha Alpha value of the arrow {Number}
 * @param tailWidth Tail width of the arrow {Number}
 * @param tailHeight Tail height of the arrow {Number}
 * @param width Width of the arrow {Number}
 * @param height Height of the arrow {Number}
 */
function Arrow(color, alpha, tailWidth, tailHeight, width, height) {
    /**
     * Tail height of the arrow
     *
     * @private
     * @type Number
     */
    this.tailHeight = tailHeight;

    /**
     * Tail width of the arrow
     *
     * @private
     * @type Number
     */
    this.tailWidth = tailWidth;

    Shape.call(this, color, alpha, width, height);
}

Arrow.prototype = Object.create( Shape.prototype );
Arrow.prototype.constructor = Arrow;
module.exports = Arrow;

/**
 * Draw the arrow during redraw.
 *
 * @private
 */
Arrow.prototype._drawShape = function() {
    // start y-positon of tail
    var tailY = Math.floor((this._height-this.tailHeight)/2);
    // draw arrow tail
    this.moveTo(0, tailY)
        .lineTo(this.tailWidth, tailY)
        .lineTo(this.tailWidth, 0)
        .lineTo(this._width, Math.floor(this._height/2))
        .lineTo(this.tailWidth, this._height)
        .lineTo(this.tailWidth, tailY+this.tailHeight)
        .lineTo(0, tailY+this.tailHeight);
};

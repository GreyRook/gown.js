var Shape = require('./Shape');

/**
 * basic arrow shape
 *
 * @class Arrow
 * @extends GOWN.shapes.Shape
 * @memberof GOWN.shapes
 * @constructor
 */
function Arrow(color, alpha, tailWidth, tailHeight, width, height) {
    this.tailHeight = tailHeight;
    this.tailWidth = tailWidth;
    Shape.call(this, color, alpha, width, height);
}

Arrow.prototype = Object.create( Shape.prototype );
Arrow.prototype.constructor = Arrow;
module.exports = Arrow;

/**
 * draw the arrow during redraw.
 *
 * @method _drawShape
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

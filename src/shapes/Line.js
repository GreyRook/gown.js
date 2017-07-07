var Shape = require('./Shape');

/**
 * Basic line
 *
 * @class Line
 * @extends PIXI.shape.Shape
 * @memberof PIXI.shape
 * @constructor
 * @param color Color of the line {Number}
 * @param alpha Alpha value of the line {Number}
 * @param width Width of the line {Number}
 * @param height Height of the line {Number}
 * @param [lineWidth=1] Width of the line {Number}
 * @param reverse
 */
function Line(color, alpha, width, height, lineWidth, reverse) {
    /**
     * Reverse the line
     *
     * @private
     * @type bool
     */
    this._reverse = reverse;

    Shape.call(this, color, alpha, width, height);

    /**
     * The width of the line
     *
     * @type Number
     * @default 1
     */
    this.lineWidth = lineWidth || 1;
}

Line.prototype = Object.create( Shape.prototype );
Line.prototype.constructor = Line;
module.exports = Line;

/**
 * Draw the rect during redraw. Will use drawRoundRect if a radius is provided.
 *
 * @private
 */
Line.prototype._drawShape = function() {
    if (this.reverse) {
        this.moveTo(this._width, 0);
        this.lineTo(0, this._height);
    } else {
        this.moveTo(0, 0);
        this.lineTo(this._width,this._height);
    }
};

/**
 * Reverses the line
 *
 * @name GOWN.shapes.Line#reverse
 * @type bool
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


/**
 * Update before draw call.
 * Line has to be drawn different than other Shapes
 *
 * @private
 */
Line.prototype.redraw = function() {
    if(!this.invalid) {
        return;
    }

    var lineWidth = this.lineWidth;
    this.clear();
    this.lineStyle(lineWidth, this.color);
    this._drawShape();

    this.invalid = false;
};

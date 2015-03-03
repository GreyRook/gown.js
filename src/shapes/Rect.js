/**
 * @author Andreas Bresser
 */
/**
 * basic rectangular shape
 *
 * @class Rect
 * @constructor
 */

PIXI_UI.Rect = function(color, width, height, radius) {
    PIXI_UI.Shape.call(this, color, width, height);
    this._radius = radius;
};

PIXI_UI.Rect.prototype = Object.create( PIXI_UI.Shape.prototype );
PIXI_UI.Rect.prototype.constructor = PIXI_UI.Rect;

/**
 * draw the rect during redraw. will use drawRoundRect if a radius is provided.
 *
 * @method _drawShape
 * @private
 */
PIXI_UI.Rect.prototype._drawShape = function() {
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
Object.defineProperty(PIXI_UI.Rect.prototype, 'radius', {
    get: function() {
        return this._radius;
    },
    set: function(radius) {
        this._radius = radius;
        this.invalid = true;
    }
});
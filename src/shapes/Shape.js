/**
 * shape base class
 *
 * @class Shape
 * @extends PIXI.Graphics
 * @memberof GOWN
 * @constructor
 */
function Shape(color, alpha, width, height) {
    PIXI.Graphics.call(this);
    this._color = color;
    this._alpha = alpha || 1.0;
    this._width = width;
    this._height = height;
    this.invalid = true;
}

Shape.prototype = Object.create( PIXI.Graphics.prototype );
Shape.prototype.constructor = Shape;
module.exports = Shape;

// setter/getter
/**
 * The width of the shape, setting this will redraw the component.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(width) {
        this._width = width;
        this.invalid = true;
    }
});

/**
 * The height of the shape, setting this will redraw the component.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(height) {
        this._height = height;
        this.invalid = true;
    }
});

/**
 * The fill color of the shape, setting this will redraw the component.
 *
 * @property color
 * @type Number
 */

Object.defineProperty(Shape.prototype, 'color', {
    get: function() {
        return this._color;
    },
    set: function(color) {
        this._color = color;
        this.invalid = true;
    }
});

/**
 * The alpha of the shape, setting this will redraw the component.
 *
 * @property alpha
 * @type Number
 */

Object.defineProperty(Shape.prototype, 'alpha', {
    get: function() {
        return this._alpha;
    },
    set: function(alpha) {
        this._alpha = alpha;
        this.invalid = true;
    }
});

/**
 * apply the color to the shape (called during redraw)
 *
 * @method applyColor
 */
Shape.prototype.applyColor = function() {
    this.beginFill(this.color, this.alpha);
};

/**
 * apply the border around shape (called during redraw)
 *
 * @method drawBorder
 */
Shape.prototype.drawBorder = function() {
    if (this.border) {
        this.lineStyle(this.border, this.borderColor);
    }
};

/**
 * draw the shape during redraw. defaults to a simple rect
 *
 * @method _drawShape
 * @private
 */
Shape.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    // default shape is a rect
    this.drawRect(0, 0, this._width, this._height);
};


Shape.prototype.updateTransform = function() {
    this.redraw();

    PIXI.Graphics.prototype.updateTransform.call(this);
};


/**
 * update before draw call
 * redraw control for current state from theme
 *
 * @method redraw
 */
Shape.prototype.redraw = function() {
    if(!this.invalid) {
        return;
    }

    this.clear();
    this.applyColor();
    this.drawBorder();
    this._drawShape();

    this.invalid = false;
};

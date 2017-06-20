/**
 * shape base class
 *
 * @class Shape
 * @extends PIXI.Graphics
 * @memberof GOWN.shapes
 * @constructor
 */
function Shape(color, alpha, width, height) {
    PIXI.Graphics.call(this);
    this._color = color;
    this._alpha = alpha || 1.0;
    this._width = width;
    this._height = height;
    this._borderAlpha = 1.0;
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
 * setting the color to a negative value or 'null' the shape will not be filled
 * (comes in handy when you only want to draw the border).
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

 */
Shape.prototype.applyColor = function() {
    if (this.color > 0 && typeof this.color !== null) {
        this.beginFill(this.color, this.alpha);
    }
};

/**
 * apply the border around shape (called during redraw)
 *

 */
Shape.prototype.drawBorder = function() {
    if (this.border) {
        this.lineStyle(this.border, this.borderColor, this.borderAlpha);
    }
};

/**
 * change border color of shape
 *
 * @property borderColor
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'borderColor', {
    get: function() {
        return this._borderColor;
    },
    set: function(borderColor) {
        this._borderColor = borderColor;
        this.invalid = true;
    }
});

/**
 * change border alpha of shape (between 0.0 - 1.0)
 *
 * @property borderAlpha
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'borderAlpha', {
    get: function() {
        return this._borderAlpha;
    },
    set: function(borderAlpha) {
        this._borderAlpha = borderAlpha;
        this.invalid = true;
    }
});

/**
 * change border size
 *
 * @property border
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'border', {
    get: function() {
        return this._border;
    },
    set: function(border) {
        this._border = border;
        this.invalid = true;
    }
});

/**
 * draw the shape during redraw. defaults to a simple rect
 *

 * @private
 */
Shape.prototype._drawShape = function() {
    // default shape is a rect
    this.drawRect(
        Math.min(this._width, 0),
        Math.min(this._height, 0),
        Math.abs(this._width),
        Math.abs(this._height));
};


Shape.prototype.updateTransform = function() {
    this.redraw();

    PIXI.Graphics.prototype.updateTransform.call(this);
};


/**
 * update before draw call
 * redraw control for current state from theme
 *

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

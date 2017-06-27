/**
 * Shape base class
 *
 * @class Shape
 * @extends PIXI.Graphics
 * @memberof GOWN.shapes
 * @constructor
 * @param color Color of the shape {Number}
 * @param [alpha=1.0] Alpha value of the shape {Number}
 * @param width Width of the shape {Number}
 * @param height Height of the shape {Number}
 */
function Shape(color, alpha, width, height) {
    PIXI.Graphics.call(this);

    /**
     * Color of the shape
     *
     * @private
     * @type Number
     */
    this._color = color;

    /**
     * Alpha value of the shape
     *
     * @private
     * @type Number
     * @default 1.0
     */
    this._alpha = alpha || 1.0;

    /**
     * Width of the shape
     *
     * @private
     * @type Number
     */
    this._width = width;

    /**
     * Height of the shape
     *
     * @private
     * @type Number
     */
    this._height = height;

    /**
     * Alpha value of the border
     *
     * @private
     * @type Number
     * @default 1.0
     */
    this._borderAlpha = 1.0;

    /**
     * Invalidate shape so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalid = true;
}

Shape.prototype = Object.create( PIXI.Graphics.prototype );
Shape.prototype.constructor = Shape;
module.exports = Shape;

/**
 * The width of the shape, setting this will redraw the component.
 *
 * @name GOWN.shapes.Shape#width
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
 * @name GOWN.shapes.Shape#height
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
 * Setting the color to a negative value or 'null', the shape will not be filled
 * (comes in handy when you only want to draw the border).
 *
 * @name GOWN.shapes.Shape#color
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
 * @name GOWN.shapes.Shape#alpha
 * @type Number
 * @default 1.0
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
 * Apply the color to the shape (called during redraw)
 *
 * @private
 */
Shape.prototype.applyColor = function() {
    if (this.color > 0 && typeof this.color !== null) {
        this.beginFill(this.color, this.alpha);
    }
};

/**
 * Apply the border around shape (called during redraw)
 *
 * @private
 */
Shape.prototype.drawBorder = function() {
    if (this.border) {
        this.lineStyle(this.border, this.borderColor, this.borderAlpha);
    }
};

/**
 * Change the border color of shape
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
 * Change the border alpha of shape (between 0.0 - 1.0)
 *
 * @property borderAlpha
 * @type Number
 * @default 1.0
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
 * Change the border size
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
 * Draw the shape during redraw. Defaults to a simple rect.
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

/**
 * PIXI method to update the object transform for rendering
 * Used to call redraw() before rendering
 *
 * @private
 */
Shape.prototype.updateTransform = function() {
    this.redraw();

    PIXI.Graphics.prototype.updateTransform.call(this);
};


/**
 * Update before draw call.
 * Redraw control for current state from theme
 *
 * @private
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

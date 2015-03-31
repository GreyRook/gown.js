/**
 * @author Andreas Bresser
 */
/**
 * shape
 *
 * @class Shape
 * @constructor
 */
PIXI_UI.Shape = function(color, alpha, width, height) {
    PIXI.Graphics.call(this);
    this._color = color;
    this._alpha = alpha || 1.0;
    this._width = width;
    this._height = height;
    this.invalid = true;
};

PIXI_UI.Shape.prototype = Object.create( PIXI.Graphics.prototype );
PIXI_UI.Shape.prototype.constructor = PIXI_UI.Shape;

// setter/getter
/**
 * The width of the shape, setting this will redraw the component.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI_UI.Shape.prototype, 'width', {
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
Object.defineProperty(PIXI_UI.Shape.prototype, 'height', {
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

Object.defineProperty(PIXI_UI.Shape.prototype, 'color', {
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

Object.defineProperty(PIXI_UI.Shape.prototype, 'alpha', {
    get: function() {
        return this._alpha;
    },
    set: function(alpha) {
        this._alpha = alpha;
        this.invalid = true;
    }
});

// renderer
/* istanbul ignore next */
PIXI_UI.Shape.prototype._renderWebGL = function(renderSession) {
    if (this.invalid) {
        this.redraw();
        this.invalid = false;
    }
    return PIXI.Graphics.prototype._renderWebGL.call(this, renderSession);
};

/* istanbul ignore next */
PIXI_UI.Shape.prototype._renderCanvas = function(renderSession) {
    if (this.invalid) {
        this.redraw();
        this.invalid = false;
    }
    return PIXI.Graphics.prototype._renderCanvas.call(this, renderSession);
};

// shape drawing

/**
 * apply the color to the shape (called during redraw)
 *
 * @method applyColor
 */
PIXI_UI.Shape.prototype.applyColor = function() {
    this.beginFill(this.color, this.alpha);
};

/**
 * apply the border around shape (called during redraw)
 *
 * @method drawBorder
 */
PIXI_UI.Shape.prototype.drawBorder = function() {
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
PIXI_UI.Shape.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    // default shape is a rect
    this.drawRect(0, 0, this._width, this._height);
};

/**
 * update before draw call
 * redraw control for current state from theme
 *
 * @method redraw
 */
PIXI_UI.Shape.prototype.redraw = function() {
    this.clear();
    this.applyColor();
    this.drawBorder();
    this._drawShape();
};

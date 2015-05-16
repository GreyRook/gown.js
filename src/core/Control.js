/**
 * base for all UI controls (see controls/)
 * based on pixi-DisplayContainer that supports adding children, so all
 * controls are container
 * @class Control
 * @extends PIXI.Container
 * @memberof PIXI_UI
 * @constructor
 */
function Control() {
    PIXI.Container.call(this);
    this.enabled = this.enabled !== false;
    // assume all controls are interactive
    this.interactive = true;
}

Control.prototype = Object.create( PIXI.Container.prototype );
Control.prototype.constructor = Control;
module.exports = Control;

/**
 * change the theme (every control can have a theme, even if it does not
 * inherit Skinable, e.g. if there is only some color in the skin that will
 * be taken)
 *
 * @method setTheme
 * @param theme the new theme {Theme}
 */
Control.prototype.setTheme = function(theme) {
    if (theme === this.theme && theme) {
        return;
    }

    this.theme = theme;
    this.invalidSkin = true;
};

/**
 * Renders the object using the WebGL renderer
 *
 * @method _renderWebGL
 * @param renderSession {RenderSession}
 * @private
 */
/* istanbul ignore next */
Control.prototype._renderWebGL = function(renderSession) {
    this.redraw();
    return PIXI.Container.prototype._renderWebGL.call(this, renderSession);
};

/**
 * Renders the object using the Canvas renderer
 *
 * @method _renderWebGL
 * @param renderSession {RenderSession}
 * @private
 */
/* istanbul ignore next */
Control.prototype._renderCanvas = function(renderSession) {
    this.redraw();
    return PIXI.Container.prototype._renderCanvas.call(this, renderSession);
};

/**
 * get local mouse position from PIXI.InteractionData
 *
 * @method mousePos
 * @returns {x: Number, y: Number}
 */
Control.prototype.mousePos = function(e) {
    return e.getLocalPosition(e.target || this);
};

/**
 * update before draw call
 * redraw control for current state from theme
 *
 * @method redraw
 */
Control.prototype.redraw = function() {
};

/**
 * Enables/Disables the control.
 * (not implemented yet)
 *
 * @property enabled
 * @type Boolean
 */
Object.defineProperty(Control.prototype, 'enabled', {
    get: function() {
        return this._enabled;
    },
    set: function(value) {
        this._enabled = value;
    }
});


//var originalWidth = Object.getOwnPropertyDescriptor(PIXI.DisplayObjectContainer.prototype, 'width');

/**
 * The width of the shape, setting this will redraw the component.
 * (set invalidDimensions)
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Control.prototype, 'width', {
    get: function() {
        return this._width;
        //return originalWidth.get.call(this);
    },
    set: function(width) {
        this._width = width;
        //originalWidth.set.call(this, width);
        this.invalidDimensions = true;
    }
});

//var originalHeight = Object.getOwnPropertyDescriptor(PIXI.DisplayObjectContainer.prototype, 'height');

/**
 * The height of the shape, setting this will redraw the component.
 * (set invalidDimensions)
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Control.prototype, 'height', {
    get: function() {
        //return originalHeight.get.call(this);
        return this._height;
    },
    set: function(height) {
        //originalHeight.set.call(this, height);
        this._height = height;
        this.invalidDimensions = true;
    }
});
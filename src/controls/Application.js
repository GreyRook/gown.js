var Control = require('../core/Control');

/**
 * entry point for your application, makes some assumptions, (e.g. that you
 * always want fullscreen) and shortcuts some fancy stuff like a gradient
 * background.
 *
 * @class Application
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 * @param config {Object} - equals the renderer config for pixi with an
 *  exception: the backgroundColor is an Array a of colors it will drawn as
 *  vertical gradient
 *  (default: {backgroundColor: 0xffffff})
 * @param fullscreen {Boolean}
 *  (default: true)
 * @param width {Number} width of the canvas
 *  (default: 800)
 * @param height {Number} height of the canvas
 *  (default: 600)
 * @param renderer {WebGLRenderer|CanvasRenderer}
 *  (default: null - will create a new renderer)
 * @param stage {Stage}
 *  (default null - will use a new PIXI.Container)
 */
function Application(config, screenMode, parentId, width, height, renderer, stage) {
    screenMode = screenMode || Application.SCREEN_MODE_RESIZE;
    var fullscreen = false;
    var element = document.getElementById(parentId);
    if (screenMode === Application.SCREEN_MODE_RESIZE) {
        width = element.clientWidth;
        height = element.clientHeight;
    } else if (screenMode === Application.SCREEN_MODE_FULLSCREEN) {
        width = window.innerWidth;
        height = window.innerHeight;
        fullscreen = true;
    } else {
        width = width || 800;
        height = height || 600;
    }

    this.resizable = true;
    this.on('resize', this.onResize, this);

    if (!config) {
        config = {
            backgroundColor: 0xffffff
        };
    }

    var _background; // to store background if it is an array because we want
                     // to set the backgroundColor in config to a hex value
    if (!stage || !renderer) {
        stage = new PIXI.Container();
        if (config.backgroundColor && config.backgroundColor instanceof Array) {
            _background = config.backgroundColor;
            config.backgroundColor = 0xffffff;
        }
        this._background = config.backgroundColor;
        renderer = PIXI.autoDetectRenderer(width, height, config);
        renderer.plugins.resize.element = element;
        renderer.plugins.resize.fullscreen = fullscreen;
        if (element && !fullscreen) {
            element.appendChild(renderer.view);
        } else {
            document.body.appendChild(renderer.view);
        }
    }
    /* jshint ignore:start */
    this._stage = stage;
    this._renderer = renderer;
    /* jshint ignore:end */
    this._width = renderer.width;
    this._height = renderer.height;

    this.screenMode = screenMode;

    Control.call(this);
    stage.addChild(this);

    this.layoutInvalid = true;

    // you can set a layout to apply percentages on redraw etc.
    this.layout = this.layout || null;

    if (_background) {
        this.background = _background;
    }

    this.animate();
}

Application.prototype = Object.create( Control.prototype );
Application.prototype.constructor = Application;
module.exports = Application;

/**
 * use fixed width/height in pixel.
 */
Application.SCREEN_MODE_FIXED = 'screenModeFixed';

/**
 * use window.innerWidth/innerHeight to get the whole browser page width
 */
Application.SCREEN_MODE_FULLSCREEN = 'screenModeFullscreen';

/**
 * use resize to parent div width/height
 */
Application.SCREEN_MODE_RESIZE = 'screenModeResize';

/**
 * call requestAnimationFrame to render the application at max. FPS
 *
 * @method animate
 */
/* jshint ignore:start */
Application.prototype.animate = function() {
    var scope = this;
    var animate = function() {
        if (scope._stage) {
            scope._renderer.render(scope._stage);
            requestAnimationFrame(animate);
        }
    };
    requestAnimationFrame(animate);
};
/* jshint ignore:end */

/**
 * creates a gradient rect that can be used as background
 * (uses a separate canvas to create a new Texture)
 *
 * @method _createGradientRect
 * @private
 */
Application.prototype._createGradientRect = function(gradient, width, height) {
    var bgCanvas = document.createElement('canvas');
    bgCanvas.width = width || 256;
    bgCanvas.height = height || 256;
    var ctx = bgCanvas.getContext('2d');
    var linearGradient = ctx.createLinearGradient(0, 0, 0, bgCanvas.height);
    for (var i = 0; i < gradient.length; i++) {
        var color = gradient[i];
        if (typeof(color) === 'number') {
            color = '#' +  gradient[i].toString(16);
        }
        linearGradient.addColorStop(i, color);
    }
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    return PIXI.Texture.fromCanvas(bgCanvas);
};

/**
 * clean application: remove event listener, free memory
 * (can also remove the canvas from the DOM tree if wanted)
 *
 * @method destroy
 * @param [destroyChildren=false] {boolean} if set to true, all the children will have their destroy method called as well
 * @param [removeCanvas=true] {boolean} destroys the canvas and remove it from the dom tree
 */
Application.prototype.destroy = function(destroyChildren, removeCanvas) {
    removeCanvas = removeCanvas === undefined || removeCanvas;
    this._removeBackground();
    PIXI.Container.prototype.destroy.call(this, destroyChildren);
    if (removeCanvas) {
        document.body.removeChild(this._renderer.view);
    }
    this._stage = null;
    this._renderer = null;
};

/**
 * redraw scene, apply layout if required
 */
Application.prototype.redraw = function() {
    if (this.layoutInvalid && this.layout) {
        this.layout.layoutContainer(this);
    }
    this.layoutInvalid = false;
};

/**
 * called when the browser window / the application is resized
 * will set the dimensions of the canvas and layout children
 * (if it has a layout)
 *
 * @method resize
 */
Application.prototype.onResize = function(eventData) {
    this._width = eventData.data.width;
    this._height = eventData.data.height;
    this._renderer.resize(this._width, this._height);
    if (this.bg) {
        // TODO: add special layout for this and use percentWidth/Height of 100
        this.bg.width = this._width;
        this.bg.height = this._height;
    }
    this.layoutInvalid = true;
};

/**
 * allow layouting of children
 *
 * @property layout
 * @type PIXI.layout.Layout
 */
Object.defineProperty(Application.prototype, 'layout', {
    get: function() {
        return this._layout;
    },
    set: function(value) {
        if (value === this._layout) {
            return;
        }
        this._layout = value;
        this.layoutInvalid = true;
    }
});

/**
 * remove background
 * @method _removeBackground
 * @private
 */
Application.prototype._removeBackground = function() {
    if (this.bg) {
        this.removeChild(this.bg);
        this.bg = null;
    }
};

/**
 * set fullscreen and resize to screen size
 *
 * @property enabled
 * @type Boolean
 */
Object.defineProperty(Application.prototype, 'screenMode', {
    get: function() {
        return this._screenMode;
    },
    set: function(value) {
        if (value === Application.SCREEN_MODE_FULLSCREEN) {
            this._renderer.view.style.top = 0;
            this._renderer.view.style.left = 0;
            this._renderer.view.style.right = 0;
            this._renderer.view.style.bottom = 0;
            this._renderer.view.style.position = 'absolute';
        }
        this._screenMode = value;
    }
});

/**
 * set and draw background
 *
 * @property enabled
 * @type Boolean
 */
Object.defineProperty(Application.prototype, 'background', {
    get: function() {
        return this._background;
    },
    set: function(value) {
        if (value === this._background) {
            return;
        }
        this._removeBackground();
        if (value instanceof Array) {
            this.bg = new PIXI.Sprite(this._createGradientRect(value));
            this.bg.width = this._width;
            this.bg.height = this._height;
            this.addChildAt(this.bg, 0);
        } else {
            this._renderer.backgroundColor = value;
        }
        this._background = value;
    }
});

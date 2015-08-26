var Control = require('../Control');

/**
 * entry point for your application, makes some assumptions, (e.g. that you
 * always want fullscreen) and shortcuts some fancy stuff like a gradient
 * background.
 *
 * @class Application
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 * @param background {Number | Array} a background color or a list of colors
 *  that will be used as vertical gradient
 * @param fullscreen {Boolean}
 * @param renderer {WebGLRenderer|CanvasRenderer}
 * @param stage {Stage}
 */
function Application(background, fullscreen, renderer, stage) {
    if (!stage || !renderer) {
        stage = new PIXI.Container();
        var width = 800;
        var height = 600;
        if (fullscreen) {
            width = window.innerWidth;
            height = window.innerHeight;
        }
        renderer = PIXI.autoDetectRenderer(
            width, height, {backgroundColor : 0xffffff});
        document.body.appendChild(renderer.view);
    }
    /* jshint ignore:start */
    this._stage = stage;
    this._renderer = renderer;
    /* jshint ignore:end */
    this._width = renderer.width;
    this._height = renderer.height;

    Control.call(this);
    stage.addChild(this);
    this.animate();

    this.background = background;
    this.fullscreen = fullscreen || false;
}

Application.prototype = Object.create( Control.prototype );
Application.prototype.constructor = Application;
module.exports = Application;

/**
 * call requestAnimationFrame to render the application at max. FPS
 *
 * @method animate
 */
/* jshint ignore:start */
Application.prototype.animate = function() {
    var renderer = this._renderer;
    var stage = this._stage;
    var animate = function() {
        renderer.render(stage);
        requestAnimationFrame(animate);
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
        linearGradient.addColorStop(i, gradient[i]);
    }
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    return PIXI.Texture.fromCanvas(bgCanvas);
};

/**
 * clean application: remove event listener, free memory
 * (can also remove the canvas from the DOM tree if wanted)
 *
 * @method cleanup
 * @param removeCanvas destroys the canvas and remove it from the dom tree
 */
Application.prototype.cleanup = function(removeCanvas) {
    removeCanvas = removeCanvas || true;
    if (removeCanvas) {
        document.body.removeChild(this._renderer.view);
    }
    this._stage = null;
    this._renderer = null;
    this._removeBackground();
    this.fullscreen = false; // remove event listener
};

/**
 * called when the browser window / the application is resized
 *
 * @method onresize
 */
Application.prototype.onresize = function() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._renderer.resize(this._width, this._height);
    if (this.bg) {
        this.bg.width = this._width;
        this.bg.height = this._height;
    }
    for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        if (child.onresize) {
            child.onresize(this._width, this._height);
        }
    }
};

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
Object.defineProperty(Application.prototype, 'fullscreen', {
    get: function() {
        return this._fullscreen;
    },
    set: function(value) {
        if (this._fullscreen && !value) {
            window.removeEventListener('resize', this._onresize);
        } else if (!this._fullscreen && value) {
            this._onresize = this.onresize.bind(this);
            window.addEventListener('resize', this._onresize);
        }
        this._fullscreen = value;
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

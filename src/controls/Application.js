var Control = require('../core/Control');

/**
 * entry point for your application, makes some assumptions, (e.g. that you
 * always want fullscreen) and shortcuts some fancy stuff like a gradient
 * background.
 *
 * @class Application
 * @extends PIXI_UI.Control
 * @memberof PIXI_UI
 * @constructor
 * @param background {Number | Array} a background color or a list of colors
 *  that will be used as vertical gradient
 * @param fullscreen {Boolean}
 * @param renderer {WebGLRenderer|CanvasRenderer}
 * @param stage {Stage}
 */
function Application(background, fullscreen, renderer, stage) {
    if (!stage || !renderer) {
        stage = new PIXI.Stage(0xffffff);
        var width = 800;
        var height = 600;
        if (fullscreen) {
            width = window.innerWidth;
            height = window.innerHeight;
        }
        renderer = PIXI.autoDetectRenderer(width, height);
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
    this.fullscreen = fullscreen;
}

Application.prototype = Object.create( Control.prototype );
Application.prototype.constructor = Application;
module.exports = Application;

/* jshint ignore:start */
Application.prototype.animate = function() {
    var renderer = this._renderer;
    var stage = this._stage;
    var animate = function() {
        renderer.render(stage);
        requestAnimFrame(animate);
    };
    requestAnimFrame(animate);
};
/* jshint ignore:end */

/**
 * creates a gradient rect that can be used as background
 *
 * @method _createGradientRect
 * @private
 */
Application.prototype._createGradientRect = function(width, height, gradient) {
    var bgCanvas = document.createElement('canvas');
    bgCanvas.width = width;
    bgCanvas.height = height;
    var ctx = bgCanvas.getContext('2d');
    var linearGradient = ctx.createLinearGradient(0,0,0,height);
    for (var i = 0; i < gradient.length; i++) {
        linearGradient.addColorStop(i, gradient[i]);
    }
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0,0,width,height);
    return PIXI.Texture.fromCanvas(bgCanvas);
};

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
            window.removeEventListener('resize');
        } else if (!this._fullscreen && value) {
            window.addEventListener('resize', this.onresize.bind(this));
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
        if (this.bg) {
            this.removeChild(this.bg);
            this.bg = null;
        }
        if (value instanceof Array) {
            this.bg = new PIXI.Sprite(this._createGradientRect(256, 256, value));
            this.bg.width = this._width;
            this.bg.height = this._height;
            this.addChildAt(this.bg, 0);
        } else {
            this._stage.setBackgroundColor(value);
        }
        this._background = value;
    }
});

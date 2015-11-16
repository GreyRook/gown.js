var ScrollBar = require('./ScrollBar');
var Control = require('../Control');

/**
 * Allows horizontal and vertical scrolling of a view port.
 * Not meant to be used as a standalone container or component.
 * Generally meant to be the super class of another component that needs to
 * support scrolling.
 * To put components in a generic scrollable container (with optional layout),
 * see ScrollContainer. To scroll long passages of text, see ScrollText.
 *
 * @class Scroller
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 */
function Scroller(theme) {
    Control.call(this);
    this.setTheme(theme);
    this.interactive = true;
    this.sizeValid = true;
    this._clipContent = true;
    this._horizontalScrollBarFactory = this.defaultScrollBarFactory;
    this._verticalScrollBarFactory = this.defaultScrollBarFactory;
    this.createScrollBars();
}

Scroller.prototype = Object.create( Control.prototype );
Scroller.prototype.constructor = Scroller;
module.exports = Scroller;

/**
 * us a mask to clip content
 */
Object.defineProperty(Scroller.prototype, 'clipContent', {
    get: function() {
        return this._clipContent;
    },
    set: function(value) {
        if (this._clipContent === value) {
			return;
		}
		this._clipContent = value;
    }
});

Object.defineProperty(Scroller.prototype, 'viewPort', {
    get: function() {
        return this._viewPort;
    },
    set: function(value) {
        if (this._viewPort === value) {
			return;
		}
		if(this._viewPort) {
			//TODO: this._viewPort.off(FeathersEventType.RESIZE, viewPort_resizeHandler);
            this.removeChild(this._viewPort);
		}
		this._viewPort = value;
		if(this._viewPort) {
			//TODO: this._viewPort.addEventListener(FeathersEventType.RESIZE, viewPort_resizeHandler);
            this.addChildAt(this._viewPort, 0);
		}
		//this.invalidate(Control.INVALIDATION_FLAG_SIZE);
        this.sizeValid = false;
    }
});

// performance increase to avoid using call.. (10x faster)
Scroller.prototype.controlRedraw = Control.prototype.redraw;
/**
 * update before draw call
 *
 * @method redraw
 */
Scroller.prototype.redraw = function() {
    if(this.clippingInvalid) {
		this.refreshClipRect();
	}

    if (this._viewPort.updateRenderable) {
        this._viewPort.updateRenderable(
            -this._viewPort.x, -this._viewPort.y,
            this.width, this.height);
    }
    this.controlRedraw();
};

Scroller.prototype.refreshClipRect = function() {

    if (this.height && this.width && this._clipContent) {
        if (this.clipRect === undefined) {
            this.clipRect = new PIXI.Graphics();
        }
        //TODO: for scaling save scrollPosition!
        //TODO this.clipRect.x = this._horizontalScrollPosition;
        //TODO this.clipRect.y = this._verticalScrollPosition;

        // update clipRectDimensions in own draw-function
        this.drawClipRect();
    } else {
        if (this.clipRect) {
            this.clipRect.clear();
        }
        this.clipRect = undefined;
    }

    this.clippingInvalid = false;
};


/**
 * draw mask (can be overwritten, e.g. to show something above the
 * scroll area when using a vertical layout)
 * @private
 * @method drawMask
 */
Scroller.prototype.drawClipRect = function() {
    var pos = new PIXI.Point(0, 0);
    var global = this.toGlobal(pos);

    // TODO: viewportOffsets for width/height
    // (see Scroller.as refreshClipRect)
    //var clipWidth:Number = this.actualWidth - this._leftViewPortOffset - this._rightViewPortOffset;

    this.clipRect.clear()
        .beginFill('#fff', 1)
        .drawRect(global.x, global.y, this.width, this.height)
        .endFill();
    this.mask = this.clipRect;
    if (this.hitArea) {
        this.hitArea.width = this.width;
        this.hitArea.height = this.height;
    } else {
        this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    }
};


/**
 * Creates and adds the <code>horizontalScrollBar</code> and
 * <code>verticalScrollBar</code> sub-components and removes the old
 * instances, if they exist.
 *
 * <p>Meant for internal use, and subclasses may override this function
 * with a custom implementation.</p>
 *
 * @see #horizontalScrollBar
 * @see #verticalScrollBar
 * @see #horizontalScrollBarFactory
 * @see #verticalScrollBarFactory
 */
Scroller.prototype.createScrollBars = function() {
    this.horizontalScrollBar = this._horizontalScrollBarFactory();
    this.verticalScrollBar = this._verticalScrollBarFactory();
};

Scroller.prototype.defaultScrollBarFactory = function() {
    return new ScrollBar();
};


/**
 * The width of the Scroller (defines the viewport)
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Scroller.prototype, 'width', {
    get: function() {
        if (!this._width) {
            return this._viewPort.width;
        }
        return this._width;
    },
    set: function(width) {
        this._width = width;
        this.clippingInvalid = true;
    }
});

/**
 * The height of the Scroller (defines the viewport)
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Scroller.prototype, 'height', {
    get: function() {
        if (!this._height) {
            return this._viewPort.height;
        }
        return this._height;
    },
    set: function(height) {
        this._height = height;
        this.clippingInvalid = true;
    }
});

// TODO: elastic scrollSteps pageIndex updateVerticalScrollFromTouchPosition throwTo hideHorizontalScrollBar revealHorizontalScrollBar

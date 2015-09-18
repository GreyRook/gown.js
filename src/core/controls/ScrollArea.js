var Control = require('../Control'),
    LayoutAlignment = require('../layout/LayoutAlignment');

/**
 * The ScrollArea hosts some content that can be scrolled. The width/height
 * of the ScrollArea defines the viewport.
 *
 * @class ScrollArea
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 */
function ScrollArea(content, addListener, scrolldelta, bar) {
    this.addListener = addListener || true;
    this.bar = bar || null;
    Control.call(this);
    this.content = content || null;
    this.mask = undefined;
    this.enabled = true;
    this._useMask = true;

    this.scrolldirection = ScrollArea.SCROLL_AUTO;
    // # of pixel you scroll at a time (if the event delta is 1 / -1)
    this.scrolldelta = scrolldelta || 10;

    this.interactive = true;

    this.touchend = this.touchendoutside = this.mouseupoutside = this.mouseup;
    this.touchstart = this.mousedown;
    this.touchmove = this.mousemove;
}

ScrollArea.prototype = Object.create( Control.prototype );
ScrollArea.prototype.constructor = ScrollArea;
module.exports = ScrollArea;

// scrolls horizontal as default, but will change if a
// horizontal layout is set in the content
ScrollArea.SCROLL_AUTO = 'auto';
ScrollArea.SCROLL_VERTICAL = 'vertical';
ScrollArea.SCROLL_HORIZONTAL = 'horizontal';

/**
 * check, if the layout of the content is horizontally alligned
 *
 * * @method layoutHorizontalAlign
 */
ScrollArea.prototype.layoutHorizontalAlign = function() {
    return this.content.layout &&
        this.content.layout.alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT;
};

/**
 * test if content width bigger than this width but content height is
 * smaller than this height (so we allow scrolling in only one direction)
 *
 * @method upright
 */
ScrollArea.prototype.upright = function() {
    return this.content.height <= this.height &&
        this.content.width > this.width;
};

/**
 * get 1-dimensional scroll direction
 * dissolve "auto" into VERTICAL or HORIZONTAL
 *
 * @method direction
 * @returns {String}
 */
ScrollArea.prototype.direction = function() {
    var scrollAuto = this.scrolldirection === ScrollArea.SCROLL_AUTO;
    var scroll = ScrollArea.SCROLL_VERTICAL;
    // if the scroll direction is set to SCROLL_AUTO we check, if the
    // layout of the content is set to horizontal or the content
    // width is bigger than the current
    if (this.scrolldirection === ScrollArea.SCROLL_HORIZONTAL ||
        (scrollAuto && (this.layoutHorizontalAlign() || this.upright()) )) {
        scroll = ScrollArea.SCROLL_HORIZONTAL;
    }
    return scroll;
};

/**
 * move content
 *
 * @method _scrollContent
 */
ScrollArea.prototype._scrollContent = function(x, y) {
    // todo: press shift to switch direction
    var scroll = this.direction();
    var contentMoved = false;
    if (scroll === ScrollArea.SCROLL_HORIZONTAL) {
        if (this.content.width > this.width) {
            // assure we are within bounds
            x = Math.min(x, 0);
            if (this.content.width) {
                x = Math.max(x, -(this.content.width - this.width));
            }
            this.content.x = Math.floor(x);
            contentMoved = true;
        }
    }
    if (scroll === ScrollArea.SCROLL_VERTICAL) {
        if (this.content.height > this.height) {
            // assure we are within bounds
            y = Math.min(y, 0);
            if (this.content.height && this.content.y < 0) {
                y = Math.max(y, -(this.content.height - this.height));
            }
            this.content.y = Math.floor(y);
            contentMoved = true;
        }
    }
    return contentMoved;
};

// update ScrollBar progress/thumb position
ScrollArea.prototype.updateBar = function() {
    if (this.bar && this.bar.thumb && this.content) {
        var scroll = this.direction();
        if (scroll === ScrollArea.SCROLL_HORIZONTAL) {
            this.bar.thumb.x = Math.floor(-this.content.x /
                (this.content.width - this.width) *
                (this.bar.width - this.bar.thumb.width));
        }
        if (scroll === ScrollArea.SCROLL_VERTICAL) {
            this.bar.thumb.y = Math.floor(-this.content.y /
            (this.content.height - this.height) *
            (this.bar.height - this.bar.thumb.height));
        }
    }
};

/**
 * mouse button pressed / touch start
 *
 * @method mousedown
 */
ScrollArea.prototype.mousedown = function(mouseData) {
    var pos = mouseData.data.getLocalPosition(this);
    if (!this._start) {
        this._start = [
            pos.x - this.content.x,
            pos.y - this.content.y
        ];
    }
};

/**
 * mouse/finger moved
 *
 * @method mousemove
 */
ScrollArea.prototype.mousemove = function(mouseData) {
    if (this._start) {
        var pos = mouseData.data.getLocalPosition(this);
        if (this._scrollContent(
                pos.x - this._start[0],
                pos.y - this._start[1])) {
            this.updateBar();
        }
    }
};

/**
 * mouse up/touch end
 *
 * @method mouseup
 */
ScrollArea.prototype.mouseup = function() {
    this._start = null;
};


/**
 * do not remove children - we just have a content
 * override addChild to prevent the developer from adding more than one context
 * @param child
 */
/*
ScrollArea.prototype.removeChild = function(child) {
    throw new Error('use .content = null instead of removeChild(child)')
};

ScrollArea.prototype.addChild = function(child) {
    throw new Error('use .content = child instead of addChild(child)')
};
*/

/**
 * create a new mask or redraw it
 * @method updateMask
 */
ScrollArea.prototype.updateMask = function() {
    if (this.height && this.width && this._useMask) {
        if (this.mask === undefined) {
            this.mask = new PIXI.Graphics();
        }
        this.drawMask();
    } else {
        if (this.mask) {
            this.mask.clear();
        }
        this.mask = undefined;
    }
};

/**
 * draw mask (can be overwritten, e.g. to show something above the
 * scroll area when using a vertical layout)
 * @private
 * @method drawMask
 */
ScrollArea.prototype.drawMask = function() {
    var pos = new PIXI.Point(0, 0);
    var global = this.toGlobal(pos);
    this.mask.clear()
        .beginFill('#fff', 1)
        .drawRect(global.x, global.y, this.width, this.height)
        .endFill();
    if (this.hitArea) {
        this.hitArea.width = this.width;
        this.hitArea.height = this.height;
    } else {
        this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    }
};


/**
 * update mask as needed
 *
 * @method redraw
 */
ScrollArea.prototype.redraw = function() {
    if (this.content.updateRenderable) {
        this.content.updateRenderable(-this.content.x, -this.content.y, this.width, this.height);
    }

    if (this.invalid) {
        this.updateMask();
        this.invalid = false;
    }
};

/**
 * scroll content, that can have the scrollarea as viewport.
 * can be a PIXI.Texture or a ScrollContainer
 *
 * @property content
 */
Object.defineProperty(ScrollArea.prototype, 'content', {
    set: function(content) {
        if (this._content) {
            this.removeChild(content);
        }
        this._content = content;
        if (content) {
            this.addChild(content);
        }
    },
    get: function() {
        return this._content;
    }
});


/**
 * The width of the ScrollArea (defines the viewport)
 *
 * @property width
 * @type Number
 */
Object.defineProperty(ScrollArea.prototype, 'width', {
    get: function() {
        if (!this._width) {
            return this._content.width;
        }
        return this._width;
    },
    set: function(width) {
        this._width = width;
        this.invalid = true;
    }
});

/**
 * The height of the ScrollArea (defines the viewport)
 *
 * @property height
 * @type Number
 */
Object.defineProperty(ScrollArea.prototype, 'height', {
    get: function() {
        if (!this._height) {
            return this._content.height;
        }
        return this._height;
    },
    set: function(height) {
        this._height = height;
        this.invalid = true;
    }
});

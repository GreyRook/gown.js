var Control = require('../core/Control'),
    Tween = require('../utils/Tween'),
    Scrollable = require('./Scrollable'),
    ScrollBar = require('./ScrollBar');
// LayoutAlignment = require('../../external/pixi-layout/src/layout/LayoutAlignment');

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

    /**
     * use mask to clip content
     */
    this._clipContent = true;

    /**
     * offsets for the mask of the viewport
     * (see this._viewport.mask)
     */
    this._viewPortOffset = {left: 0, right: 0, top: 0, bottom: 0};

    /**
     * scroll policy for vertical and horizontal ScrollBar
     * (translates to x/y position of the viewport and scroll positions)
     */
    this._verticalScrollPolicy = Scroller.SCROLL_POLICY_AUTO;
    this._horizontalScrollPolicy = Scroller.SCROLL_POLICY_AUTO;

    // min/max horizontal and
    this._scrollBounds = new PIXI.Rectangle(0, 0, Infinity, Infinity);

    /**
     * the default interaction mode is drag-and-drop OR use the scrollbars
     */
    this._interactionMode = Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS;

    /**
     * start touch/mouse position
     * (changed on touchstart/mousedown)
     */
    this._startTouch = new PIXI.Point(0, 0);

    /**
     * calculated horizontal and vertical scroll positions
     */
    this._scrollPosition = new PIXI.Point(0, 0);

    /**
     * scroll positions at the start of an interaction
     * (changed on touchstart/mousedown)
     */
    this._startScrollPosition = new PIXI.Point(0, 0);

    // mouse/ouch has to be moved at least this many pixel to be a valid drag.
    this.minimumDragDistance = 3;

    /**
     * add events
     */
    this.refreshInteractionModeEvents();

    /**
     * scrollInvalid will force viewport to set its x/y position
     * according to horizontal/vertical Scroll Position next redraw
     */
    this.scrollInvalid = false;

    this.scrollBarInvalid = false;

    this.mask = undefined;
    this.enabled = true;
    this.horizontalScrollBarStyleName = Scroller.DEFAULT_CHILD_STYLE_NAME_HORIZONTAL_SCROLL_BAR;
    this.verticalScrollBarStyleName = Scroller.DEFAULT_CHILD_STYLE_NAME_VERTICAL_SCROLL_BAR;
    this._hasHorizontalScrollBar = false;
    this._hasVerticalScrollBar = false;
    this._touchPointID = -1;
    this._velocity = {x: 0, y: 0};
    this._previousVelocity = {x: [], y: []};
    this._pendingVelocityChange = false;
    this._hasViewPortBoundsChanged = false;
    this._isDraggingHorizontally = false;
    this._isDraggingVertically = false;
    this._measureViewPort = true;
    this._snapToPages = false;
    this._snapOnComplete = false;
    this._horizontalScrollBarFactory = this._verticalScrollBarFactory = this.defaultScrollBarFactory;
    this._horizontalScrollPosition = 0;
    this._minHorizontalScrollPosition = 0;
    this._maxHorizontalScrollPosition = 0;
    this._horizontalPageIndex = 0;
    this._minHorizontalPageIndex = 0;
    this._maxHorizontalPageIndex = 0;
    this.actualVerticalScrollStep = 1;
    this.explicitVerticalScrollStep = NaN;
    this._verticalMouseWheelScrollStep = NaN;
    this._verticalScrollPosition = 0;
    this._minVerticalScrollPosition = 0;
    this._maxVerticalScrollPosition = 0;
    this._verticalPageIndex = 0;
    this._minVerticalPageIndex = 0;
    this._maxVerticalPageIndex = 0;
    this.actualPageWidth = 0;
    this.explicitPageWidth = NaN;
    this.actualPageHeight = 0;
    this.explicitPageHeight = NaN;
    this._minimumPageThrowVelocity = 5;
    this._paddingTop = 0;
    this._elasticSnapDuration = 0.5;
    this._horizontalScrollBarIsScrolling = false;
    this._verticalScrollBarIsScrolling = false;
    this._isScrolling = false;
    this._isScrollingStopped = false;
    this.pendingHorizontalScrollPosition = NaN;
    this.pendingVerticalScrollPosition = NaN;
    this.hasPendingHorizontalPageIndex = false;
    this.hasPendingVerticalPageIndex = false;
    this.isScrollBarRevealPending = false;
    this._revealScrollBarsDuration = 1.0;
    this._isTopPullActive = false;
    this._topPullView = null;
    this._isRightPullActive = false;
    this._rightPullView = null;
    this._isBottomPullActive = false;
    this._bottomPullView = null;
    this._isLeftPullActive = false;
    this._leftPullView = null;
    this._hasElasticEdges = true;
    this._pageThrowDuration = 0.5;
    this._mouseWheelScrollDuration = 0.35;
    this._elasticity = 0.33;
    this._throwElasticity = 0.05;

    this.scrolldelta = 10;
}

Scroller.prototype = Object.create(Control.prototype);
Scroller.prototype.constructor = Scroller;
module.exports = Scroller;

/**
 * The scroller may scroll if the view port is larger than the
 * scroller's bounds. Only than the scroll bar will be visible.
 */
Scroller.SCROLL_POLICY_AUTO = 'auto';

/**
 * The scroller will always scroll, the scroll bar will always be visible.
 */
Scroller.SCROLL_POLICY_ON = 'on';

/**
 * The scroller does not scroll at all, the scroll bar will never be visible.
 */
Scroller.SCROLL_POLICY_OFF = 'off';

/**
 * The user may touch anywhere on the scroller and drag to scroll. The
 * scroll bars will be visual indicator of position, but they will not
 * be interactive.
 */
Scroller.INTERACTION_TOUCH = 'touch';

/**
 * Allow touch and use the Scrollbars
 */
Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS = 'touchAndScrollBars';

/**
 * The user may only interact with the scroll bars to scroll.
 */
Scroller.INTERACTION_MOUSE = Scroller.INTERACTION_SCROLL_BARS = 'scrollBars';

Scroller.HELPER_POINT = new PIXI.Point(0, 0);
Scroller.INVALIDATION_FLAG_SCROLL_BAR_RENDERER = 'scrollBarRenderer';
Scroller.INVALIDATION_FLAG_PENDING_SCROLL = 'pendingScroll';
Scroller.INVALIDATION_FLAG_PENDING_REVEAL_SCROLL_BARS = 'pendingRevealScrollBars';
Scroller.SCROLL_BAR_DISPLAY_MODE_FLOAT = 'float';
Scroller.SCROLL_BAR_DISPLAY_MODE_FIXED = 'fixed';
Scroller.SCROLL_BAR_DISPLAY_MODE_FIXED_FLOAT = 'fixedFloat';
Scroller.SCROLL_BAR_DISPLAY_MODE_NONE = 'none';
Scroller.VERTICAL_SCROLL_BAR_POSITION_RIGHT = 'right';
Scroller.VERTICAL_SCROLL_BAR_POSITION_LEFT = 'left';
Scroller.INTERACTION_MODE_TOUCH = 'touch';
Scroller.INTERACTION_MODE_MOUSE = 'mouse';
Scroller.INTERACTION_MODE_TOUCH_AND_SCROLL_BARS = 'touchAndScrollBars';
Scroller.MOUSE_WHEEL_SCROLL_DIRECTION_VERTICAL = 'vertical';
Scroller.MOUSE_WHEEL_SCROLL_DIRECTION_HORIZONTAL = 'horizontal';
Scroller.INVALIDATION_FLAG_CLIPPING = 'clipping';
Scroller.MINIMUM_VELOCITY = 0.02;
Scroller.CURRENT_VELOCITY_WEIGHT = 2.33;
Scroller.VELOCITY_WEIGHTS = [1, 1.33, 1.66, 2];
Scroller.MAXIMUM_SAVED_VELOCITY_COUNT = 4;
Scroller.DECELERATION_RATE_NORMAL = 0.998;
Scroller.DECELERATION_RATE_FAST = 0.99;
// Scroller.DEFAULT_CHILD_STYLE_NAME_HORIZONTAL_SCROLL_BAR = 'scroller-horizontal-scroll-bar';
// Scroller.DEFAULT_CHILD_STYLE_NAME_VERTICAL_SCROLL_BAR = 'scroller-vertical-scroll-bar';
Scroller.FUZZY_PAGE_SIZE_PADDING = 0.000001;
Scroller.PAGE_INDEX_EPSILON = 0.01;

/**
 * change horizontal scroll position.
 * (will update x position of viewport next redraw)
 */
Object.defineProperty(Scroller.prototype, 'horizontalScrollPosition', {
    get: function () {
        return this._scrollPosition.x;
    },
    set: function (value) {
        if (this._scrollPosition.x === value) {
            return;
        }
        this._scrollPosition.x = value;
        this.scrollInvalid = true;
    }
});

/**
 * change vertical scroll position.
 * (will update y position of viewport next redraw)
 */
Object.defineProperty(Scroller.prototype, 'verticalScrollPosition', {
    get: function () {
        return this._scrollPosition.y;
    },
    set: function (value) {
        if (this._scrollPosition.y === value) {
            return;
        }
        this._scrollPosition.y = value;
        this.scrollInvalid = true;
    }
});

/**
 * us a mask to clip content
 */
Object.defineProperty(Scroller.prototype, 'interactionMode', {
    get: function () {
        return this._interactionMode;
    },
    set: function (value) {
        if (this._interactionMode === value) {
            return;
        }
        this._interactionMode = value;
        this.refreshInteractionModeEvents();
    }
});

/**
 * us a mask to clip the content.
 */
Object.defineProperty(Scroller.prototype, 'clipContent', {
    get: function () {
        return this._clipContent;
    },
    set: function (value) {
        if (this._clipContent === value) {
            return;
        }
        this._clipContent = value;
        this.clippingInvalid = true;
    }
});

/**
 * set the viewport. This is the content you'd like to scroll.
 */
Object.defineProperty(Scroller.prototype, 'viewPort', {
    get: function () {
        return this._viewPort;
    },
    set: function (value) {
        if (this._viewPort === value) {
            return;
        }
        this._viewPort = value;
        if (this._viewPort) {
            this.addChildAt(this._viewPort, 0);
        }
        // position according to horizontal/vertical ScrollPosition
        this.scrollInvalid = true;
        // this.clippingInvalid = true;
        this.sizeInvalid = true;
    }
});

/**
 * change scrollbar factory
 */
Object.defineProperty(Scroller.prototype, 'horizontalScrollBarFactory', {
    get: function () {
        return this._horizontalScrollBarFactory;
    },
    set: function (value) {
        if (this._horizontalScrollBarFactory === value) {
            return;
        }
        this._horizontalScrollBarFactory = value;
        this.scrollBarInvalid = true;
    }
});

/**
 * change scrollbar factory
 */
Object.defineProperty(Scroller.prototype, 'verticalScrollBarFactory', {
    get: function () {
        return this._verticalScrollBarFactory;
    },
    set: function (value) {
        if (this._verticalScrollBarFactory === value) {
            return;
        }
        this._verticalScrollBarFactory = value;
        this.scrollBarInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'measureViewPort', {
    get: function () {
        return this._measureViewPort;
    },
    set: function (value) {
        if (this._measureViewPort === value) {
            return;
        }
        this._measureViewPort = value;
        this.sizeInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'snapToPages', {
    get: function () {
        return this._snapToPages;
    },
    set: function (value) {
        if (this._snapToPages === value) {
            return;
        }
        this._snapToPages = value;
        this.sizeInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'horizontalScrollStep', {
    get: function () {
        return this._horizontalScrollStep;
    },
    set: function (value) {
        if (this._horizontalScrollStep === value) {
            return;
        }
        this._horizontalScrollStep = value;
        this.scrollInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'horizontalPageIndex', {
    get: function () {
        if (this.hasPendingHorizontalPageIndex) {
            return this.pendingHorizontalPageIndex;
        }
        return this._horizontalPageIndex;
    }
});

Object.defineProperty(Scroller.prototype, 'horizontalScrollPolicy', {
    get: function () {
        return this._horizontalScrollPolicy;
    },
    set: function (value) {
        if (this._horizontalScrollPolicy === value) {
            return;
        }
        this._horizontalScrollPolicy = value;
        this.scrollInvalid = true;
        this.scrollBarInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'verticalScrollStep', {
    get: function () {
        return this.actualVerticalScrollStep;
    },
    set: function (value) {
        if (this.explicitVerticalScrollStep === value) {
            return;
        }
        this.explicitVerticalScrollStep = value;
        this.scrollInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'verticalMouseWheelScrollStep', {
    get: function () {
        return this._verticalMouseWheelScrollStep;
    },
    set: function (value) {
        if (this._verticalMouseWheelScrollStep === value) {
            return;
        }
        this._verticalMouseWheelScrollStep = value;
        this.scrollInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'verticalPageIndex', {
    get: function () {
        if (this.hasPendingVerticalPageIndex) {
            return this.pendingVerticalPageIndex;
        }
        return this._verticalPageIndex;
    }
});

Object.defineProperty(Scroller.prototype, 'verticalScrollPolicy', {
    get: function () {
        if (this.hasPendingVerticalPageIndex) {
            return this.pendingVerticalPageIndex;
        }
        return this._verticalPageIndex;
    },
    set: function (value) {
        if (this._verticalScrollPolicy === value) {
            return;
        }
        this._verticalScrollPolicy = value;
        this.scrollInvalid = true;
        this.scrollBarInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'pageWidth', {
    get: function () {
        return this.actualPageWidth;
    },
    set: function (value) {
        if (this.explicitPageWidth === value) {
            return;
        }
        var valueIsNaN = isNaN(value);
        if (valueIsNaN && this.explicitPageWidth !== this.explicitPageWidth) {
            return;
        }
        this.explicitPageWidth = value;
        if (valueIsNaN) {
            //we need to calculate this value during validation
            this.actualPageWidth = 0;
        } else {
            this.actualPageWidth = this.explicitPageWidth;
        }
    }
});

Object.defineProperty(Scroller.prototype, 'pageHeight', {
    get: function () {
        return this.actualPageHeight;
    },
    set: function (value) {
        if (this.explicitPageHeight === value) {
            return;
        }
        var valueIsNaN = isNaN(value);
        if (valueIsNaN && this.explicitPageHeight !== this.explicitPageHeight) {
            return;
        }
        this.explicitPageHeight = value;
        if (valueIsNaN) {
            //we need to calculate this value during validation
            this.actualPageHeight = 0;
        } else {
            this.actualPageHeight = this.explicitPageHeight;
        }
    }
});

Object.defineProperty(Scroller.prototype, 'padding', {
    get: function () {
        return this._paddingTop;
    },
    set: function (value) {
        this.paddingTop = value;
        this.paddingRight = value;
        this.paddingBottom = value;
        this.paddingLeft = value;
    }
});

Object.defineProperty(Scroller.prototype, 'hasElasticEdges', {
    get: function () {
        return this._hasElasticEdges;
    },
    set: function (value) {
        this._hasElasticEdges = value;
    }
});

Object.defineProperty(Scroller.prototype, 'pageThrowDuration', {
    get: function () {
        return this._pageThrowDuration;
    },
    set: function (value) {
        this._pageThrowDuration = value;
    }
});

Object.defineProperty(Scroller.prototype, 'mouseWheelScrollDuration', {
    get: function () {
        return this._mouseWheelScrollDuration;
    },
    set: function (value) {
        this._mouseWheelScrollDuration = value;
    }
});

Object.defineProperty(Scroller.prototype, 'elasticity', {
    get: function () {
        return this._elasticity;
    },
    set: function (value) {
        this._elasticity = value;
    }
});

Object.defineProperty(Scroller.prototype, 'throwElasticity', {
    get: function () {
        return this._throwElasticity;
    },
    set: function (value) {
        this._throwElasticity = value;
    }
});

Scroller.prototype.scrollToPageIndex = function (horizontalPageIndex, verticalPageIndex, animationDuration) {
    if (isNaN(animationDuration)) {
        animationDuration = this._pageThrowDuration;
    }
    //cancel any pending scroll to a specific scroll position. we can
    //have only one type of pending scroll at a time.
    this.pendingHorizontalScrollPosition = NaN;
    this.pendingVerticalScrollPosition = NaN;
    this.hasPendingHorizontalPageIndex = this._horizontalPageIndex !== horizontalPageIndex;
    this.hasPendingVerticalPageIndex = this._verticalPageIndex !== verticalPageIndex;
    if (!this.hasPendingHorizontalPageIndex && !this.hasPendingVerticalPageIndex) {
        return;
    }
    this.pendingHorizontalPageIndex = horizontalPageIndex;
    this.pendingVerticalPageIndex = verticalPageIndex;
    this.pendingScrollDuration = animationDuration;
};

Scroller.prototype.refreshInteractionModeEvents = function () {
    if (!this.startEventsAdded &&
        (this._interactionMode === Scroller.INTERACTION_TOUCH ||
        this._interactionMode === Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS)) {
        this.on('touchstart', this.onDown, this);
        this.on('mousedown', this.onDown, this);
        this.startEventsAdded = true;
    } else if (this.startEventsAdded &&
        this._interactionMode === Scroller.INTERACTION_SCROLL_BARS) {
        this.off('touchstart', this.onDown, this);
        this.off('mousedown', this.onDown, this);

        if (this.touchMoveEventsAdded) {
            this.off('touchend', this.onUp, this);
            this.off('mouseupoutside', this.onUp, this);
            this.off('mouseup', this.onUp, this);
            this.off('touchendoutside', this.onUp, this);

            // TODO: global move (add events to root element from pixi renderer?)
            this.off('touchmove', this.onMove, this);
            this.off('mousemove', this.onMove, this);
        }
        this.touchMoveEventsAdded = this.startEventsAdded = false;
    }
    // TODO: interactive scrollbars
};

Scroller.prototype.onDown = function (event) {
    this._startTouch = event.data.getLocalPosition(this);
    this._isScrollingStopped = false;

    if (!this.touchMoveEventsAdded) {
        this.on('touchend', this.onUp, this);
        this.on('mouseupoutside', this.onUp, this);
        this.on('mouseup', this.onUp, this);
        this.on('touchendoutside', this.onUp, this);

        this.on('touchmove', this.onMove, this);
        this.on('mousemove', this.onMove, this);
        this.touchMoveEventsAdded = true;
    }

    this._startScrollPosition.x = this._scrollPosition.x;
    this._startScrollPosition.y = this._scrollPosition.y;
};

Scroller.prototype.onUp = function () {
    this._isScrollingStopped = true;
};

Scroller.prototype.onMove = function (event) {
    var pos = event.data.getLocalPosition(this);
    this.checkForDrag(pos);
};

Scroller.prototype.checkForDrag = function (currentTouch) {
    if (this._isScrollingStopped) {
        return;
    }
    var horizontalMoved = Math.abs(currentTouch.x - this._startTouch.x);
    var verticalMoved = Math.abs(currentTouch.y - this._startTouch.y);

    if ((this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_ON ||
        this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_AUTO) &&
        !this._isDraggingHorizontally && horizontalMoved >= this.minimumDragDistance) {
        if (this.horizontalScrollBar) {
            this.revealHorizontalScrollBar();
        }
        this._startTouch.x = currentTouch.x;
        this._startScrollPosition.x = this._scrollPosition.x;
        this._isDraggingHorizontally = true;
        if (!this._isDraggingVertically) {
            this.startScroll();
        }

    }
    if ((this._verticalScrollPolicy === Scroller.SCROLL_POLICY_ON ||
        this._verticalScrollPolicy === Scroller.SCROLL_POLICY_AUTO) &&
        !this._isDraggingVertically && verticalMoved >= this.minimumDragDistance) {
        if (this.verticalScrollBar) {
            this.revealVerticalScrollBar();
        }
        this._startTouch.y = currentTouch.y;
        this._startScrollPosition.y = this._scrollPosition.y;
        this._isDraggingVertically = true;
        if (!this._isDraggingHorizontally) {
            this.startScroll();
        }
    }

    if (this._isDraggingHorizontally && !this._horizontalAutoScrollTween) {
        this.updateHorizontalScrollFromTouchPosition(currentTouch.x);
    }
    if (this._isDraggingVertically && !this._verticalAutoScrollTween) {
        this.updateVerticalScrollFromTouchPosition(currentTouch.y);
    }
};

// performance increase to avoid using call.. (10x faster)
Scroller.prototype.controlRedraw = Control.prototype.redraw;
/**
 * update before draw call
 *
 * @method redraw
 */
Scroller.prototype.redraw = function () {
    this.scrollBarInvalid = true;
    if (this.scrollBarInvalid) {
        this.createScrollBars();
    }
    if (this.clippingInvalid) {
        this.refreshMask();
    }

    if (this._viewPort && this._viewPort.updateRenderable) {
        this._viewPort.updateRenderable(
            -this._viewPort.x, -this._viewPort.y,
            this.width, this.height);
    }
    this.controlRedraw();
};

Scroller.prototype.updateHorizontalScrollFromTouchPosition = function (touchX, isScrollBar) {
    var offset;
    if (isScrollBar) {
        offset = this._startTouch.x - touchX;
    } else {
        offset = touchX - this._startTouch.x;
    }
    var position = this._startScrollPosition.x + offset;
    if (position < this._minHorizontalScrollPosition) {
        if (this.hasElasticEdges) {
            position -= (position - this._minHorizontalScrollPosition) * (1 - this.elasticity);
        } else {
            position = this._minHorizontalScrollPosition;
        }
    } else if (position > this._maxHorizontalScrollPosition) {
        if (this.hasElasticEdges) {
            position -= (position - this._maxHorizontalScrollPosition) * (1 - this.elasticity);
        } else {
            position = this._maxHorizontalScrollPosition;
        }
    }
    if (this.viewPort.width > this.width) {
        position = Math.min(position, 0);
        if (this.viewPort.width && this.viewPort.x < 0) {
            position = Math.max(position, -(this.viewPort.width - this.width));
        }
        this.viewPort.x = Math.floor(position);
    }
    this.horizontalScrollPosition = position;
};

Scroller.prototype.updateVerticalScrollFromTouchPosition = function (touchY, isScrollBar) {
    var offset;
    if (isScrollBar) {
        offset = this._startTouch.y - touchY;
    } else {
        offset = touchY - this._startTouch.y;
    }
    var position = this._startScrollPosition.y + offset;
    // var scroll = this.direction();
    if (position < this._minVerticalScrollPosition) {
        if (this.hasElasticEdges) {
            position -= (position - this._minVerticalScrollPosition) * (1 - this.elasticity);
        } else {
            position = this._minVerticalScrollPosition;
        }
    } else if (position > this._maxVerticalScrollPosition) {
        if (this.hasElasticEdges) {
            position -= (position - this._maxVerticalScrollPosition) * (1 - this.elasticity);
        } else {
            position = this._maxVerticalScrollPosition;
        }
    }
    if (this.viewPort.height > this.height) {
        position = Math.min(position, 0);
        if (this.viewPort.height && this.viewPort.y < 0) {
            position = Math.max(position, -(this.viewPort.height - this.height));
        }
        this.viewPort.y = Math.floor(position);
    }
    this.verticalScrollPosition = position;
};

Scroller.prototype.startScroll = function () {
    if (this._isScrolling) {
        return;
    }
    this._isScrolling = true;
};

// 3333
Scroller.prototype.stopScrolling = function () {
    if (this._horizontalAutoScrollTween) {
        this._horizontalAutoScrollTween.remove();
        this._horizontalAutoScrollTween = null;
    }
    if (this._verticalAutoScrollTween) {
        this._verticalAutoScrollTween.remove();
        this._verticalAutoScrollTween = null;
    }
    this._isScrollingStopped = true;
    this._velocity.x = 0;
    this._velocity.y = 0;
    this.hideHorizontalScrollBar();
    this.hideVerticalScrollBar();
};

Scroller.prototype.scrollToPosition = function (horizontalScrollPosition, verticalScrollPosition, animationDuration) {
    if (isNaN(animationDuration)) {
        if (this._useFixedThrowDuration) {
            animationDuration = this._fixedThrowDuration;
        } else {
            Scroller.HELPER_POINT.setTo(horizontalScrollPosition - this._horizontalScrollPosition, verticalScrollPosition - this._verticalScrollPosition);
            animationDuration = this.calculateDynamicThrowDuration(Scroller.HELPER_POINT.length * this._logDecelerationRate + Scroller.MINIMUM_VELOCITY);
        }
    }
    //cancel any pending scroll to a different page. we can have only
    //one type of pending scroll at a time.
    this.hasPendingHorizontalPageIndex = false;
    this.hasPendingVerticalPageIndex = false;
    if (this.pendingHorizontalScrollPosition === horizontalScrollPosition &&
        this.pendingVerticalScrollPosition === verticalScrollPosition &&
        this.pendingScrollDuration === animationDuration) {
        return;
    }
    this.pendingHorizontalScrollPosition = horizontalScrollPosition;
    this.pendingVerticalScrollPosition = verticalScrollPosition;
    this.pendingScrollDuration = animationDuration;
};

Scroller.prototype.handlePendingScroll = function () {
    if (!isNaN(this.pendingHorizontalScrollPosition) || !isNaN(this.pendingVerticalScrollPosition)) {
        this.throwTo(this.pendingHorizontalScrollPosition, this.pendingVerticalScrollPosition, this.pendingScrollDuration);
        this.pendingHorizontalScrollPosition = NaN;
        this.pendingVerticalScrollPosition = NaN;
    }
    if (this.hasPendingHorizontalPageIndex && this.hasPendingVerticalPageIndex) {
        //both
        this.throwToPage(this.pendingHorizontalPageIndex, this.pendingVerticalPageIndex, this.pendingScrollDuration);
    }
    else if (this.hasPendingHorizontalPageIndex) {
        //horizontal only
        this.throwToPage(this.pendingHorizontalPageIndex, this._verticalPageIndex, this.pendingScrollDuration);
    }
    else if (this.hasPendingVerticalPageIndex) {
        //vertical only
        this.throwToPage(this._horizontalPageIndex, this.pendingVerticalPageIndex, this.pendingScrollDuration);
    }
    this.hasPendingHorizontalPageIndex = false;
    this.hasPendingVerticalPageIndex = false;
};

Scroller.prototype.completeScroll = function () {
    if (!this._isScrolling || this._verticalAutoScrollTween || this._horizontalAutoScrollTween ||
        this._isDraggingHorizontally || this._isDraggingVertically ||
        this._horizontalScrollBarIsScrolling || this._verticalScrollBarIsScrolling) {
        return;
    }
    this._isScrolling = false;
    this.hideHorizontalScrollBar();
    this.hideVerticalScrollBar();
};

Scroller.prototype.revealScrollBars = function () {
    this.isScrollBarRevealPending = true;
};

Scroller.prototype.refreshEnabled = function () {
    if (this._viewPort) {
        this._viewPort.enabled = this.enabled;
    }
    if (this.horizontalScrollBar) {
        this.horizontalScrollBar.enabled = this.enabled;
    }
    if (this.verticalScrollBar) {
        this.verticalScrollBar.enabled = this.enabled;
    }
};

Scroller.prototype.refreshScrollValues = function () {
    this.refreshScrollSteps();

    var oldMaxHSP = this._maxHorizontalScrollPosition;
    var oldMaxVSP = this._maxVerticalScrollPosition;
    this.refreshMinAndMaxScrollPositions();
    var maximumPositionsChanged = this._maxHorizontalScrollPosition !== oldMaxHSP || this._maxVerticalScrollPosition !== oldMaxVSP;
    if (maximumPositionsChanged && this._touchPointID < 0) {
        this.clampScrollPositions();
    }

    this.refreshPageCount();
    this.refreshPageIndices();
};

Scroller.prototype.refreshPageCount = function () {
    if (this._snapToPages) {
        var horizontalScrollRange = this._maxHorizontalScrollPosition - this._minHorizontalScrollPosition;
        var roundedDownRange;
        if (horizontalScrollRange === Number.POSITIVE_INFINITY) {
            //trying to put positive infinity into an int results in 0
            //so we need a special case to provide a large int value.
            if (this._minHorizontalScrollPosition === Number.NEGATIVE_INFINITY) {
                this._minHorizontalPageIndex = Number.MIN_SAFE_INTEGER;
            } else {
                this._minHorizontalPageIndex = 0;
            }
            this._maxHorizontalPageIndex = Number.MAX_SAFE_INTEGER;
        } else {
            this._minHorizontalPageIndex = 0;
            //floating point errors could result in the max page index
            //being 1 larger than it should be.
            roundedDownRange =
                Math.floor(horizontalScrollRange / this.actualPageWidth) * this.actualPageWidth;
            if ((horizontalScrollRange - roundedDownRange) < Scroller.FUZZY_PAGE_SIZE_PADDING) {
                horizontalScrollRange = roundedDownRange;
            }
            this._maxHorizontalPageIndex = Math.ceil(horizontalScrollRange / this.actualPageWidth);
        }

        var verticalScrollRange = this._maxVerticalScrollPosition - this._minVerticalScrollPosition;
        if (verticalScrollRange === Number.POSITIVE_INFINITY) {
            //trying to put positive infinity into an int results in 0
            //so we need a special case to provide a large int value.
            if (this._minVerticalScrollPosition === Number.NEGATIVE_INFINITY) {
                this._minVerticalPageIndex = Number.MIN_SAFE_INTEGER;
            } else {
                this._minVerticalPageIndex = 0;
            }
            this._maxVerticalPageIndex = Number.MAX_SAFE_INTEGER;
        } else {
            this._minVerticalPageIndex = 0;
            //floating point errors could result in the max page index
            //being 1 larger than it should be.
            roundedDownRange =
                Math.floor(verticalScrollRange / this.actualPageHeight) * this.actualPageHeight;
            if ((verticalScrollRange - roundedDownRange) < Scroller.FUZZY_PAGE_SIZE_PADDING) {
                verticalScrollRange = roundedDownRange;
            }
            this._maxVerticalPageIndex = Math.ceil(verticalScrollRange / this.actualPageHeight);
        }
    } else {
        this._maxHorizontalPageIndex = 0;
        this._maxHorizontalPageIndex = 0;
        this._minVerticalPageIndex = 0;
        this._maxVerticalPageIndex = 0;
    }
};

Scroller.prototype.clampScrollPositions = function () {
    if (!this._horizontalAutoScrollTween) {
        var targetHorizontalScrollPosition = this._horizontalScrollPosition;
        if (targetHorizontalScrollPosition < this._minHorizontalScrollPosition) {
            targetHorizontalScrollPosition = this._minHorizontalScrollPosition;
        }
        else if (targetHorizontalScrollPosition > this._maxHorizontalScrollPosition) {
            targetHorizontalScrollPosition = this._maxHorizontalScrollPosition;
        }
        this.horizontalScrollPosition = targetHorizontalScrollPosition;
    }
};

Scroller.prototype.refreshScrollSteps = function () {
    if (this.explicitHorizontalScrollStep !== this.explicitHorizontalScrollStep) //isNaN
    {
        if (this._viewPort) {
            this.actualHorizontalScrollStep = this._viewPort.horizontalScrollStep;
        }
        else {
            this.actualHorizontalScrollStep = 1;
        }
    }
    else {
        this.actualHorizontalScrollStep = this.explicitHorizontalScrollStep;
    }
    if (this.explicitVerticalScrollStep !== this.explicitVerticalScrollStep) //isNaN
    {
        if (this._viewPort) {
            this.actualVerticalScrollStep = this._viewPort.verticalScrollStep;
        }
        else {
            this.actualVerticalScrollStep = 1;
        }
    }
    else {
        this.actualVerticalScrollStep = this.explicitVerticalScrollStep;
    }
};

Scroller.prototype.refreshMinAndMaxScrollPositions = function () {
    var visibleViewPortWidth = this.actualWidth - (this._viewPortOffset.left + this._viewPortOffset.right);
    var visibleViewPortHeight = this.actualHeight - (this._viewPortOffset.top + this._viewPortOffset.bottom);
    if (this.explicitPageWidth !== this.explicitPageWidth) { //isNaN
        this.actualPageWidth = visibleViewPortWidth;
    }
    if (this.explicitPageHeight !== this.explicitPageHeight) { //isNaN
        this.actualPageHeight = visibleViewPortHeight;
    }
    if (this._viewPort) {
        this._minHorizontalScrollPosition = this._viewPort.content.x;
        if (this._viewPort.width === Number.POSITIVE_INFINITY) {
            //we don't want to risk the possibility of negative infinity
            //being added to positive infinity. the result is NaN.
            this._maxHorizontalScrollPosition = Number.POSITIVE_INFINITY;
        } else {
            this._maxHorizontalScrollPosition = this._minHorizontalScrollPosition + this._viewPort.width - visibleViewPortWidth;
        }
        if (this._maxHorizontalScrollPosition < this._minHorizontalScrollPosition) {
            this._maxHorizontalScrollPosition = this._minHorizontalScrollPosition;
        }
        this._minVerticalScrollPosition = this._viewPort.content.y;
        if (this._viewPort.height === Number.POSITIVE_INFINITY) {
            //we don't want to risk the possibility of negative infinity
            //being added to positive infinity. the result is NaN.
            this._maxVerticalScrollPosition = Number.POSITIVE_INFINITY;
        } else {
            this._maxVerticalScrollPosition = this._minVerticalScrollPosition + this._viewPort.height - visibleViewPortHeight;
        }
        if (this._maxVerticalScrollPosition < this._minVerticalScrollPosition) {
            this._maxVerticalScrollPosition = this._minVerticalScrollPosition;
        }
    } else {
        this._minHorizontalScrollPosition = 0;
        this._minVerticalScrollPosition = 0;
        this._maxHorizontalScrollPosition = 0;
        this._maxVerticalScrollPosition = 0;
    }
};

Scroller.prototype.showOrHideChildren = function () {
    var childCount = this.numRawChildrenInternal;
    if (this._touchBlocker !== null && this._touchBlocker.parent !== null) {
        //keep scroll bars below the touch blocker, if it exists
        childCount--;
    }
    if (this.verticalScrollBar) {
        this.verticalScrollBar.visible = this._hasVerticalScrollBar;
        this.verticalScrollBar.touchable =
            this._hasVerticalScrollBar && this._interactionMode !== Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS;
        // this.setRawChildIndexInternal(DisplayObject(this.verticalScrollBar), childCount - 1);
    }
    if (this.horizontalScrollBar) {
        this.horizontalScrollBar.visible = this._hasHorizontalScrollBar;
        this.horizontalScrollBar.touchable =
            this._hasHorizontalScrollBar && this._interactionMode !== Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS;
        //     if(this.verticalScrollBar) {
        //         this.setRawChildIndexInternal(DisplayObject(this.horizontalScrollBar), childCount - 2);
        //     } else {
        //         this.setRawChildIndexInternal(DisplayObject(this.horizontalScrollBar), childCount - 1);
        //     }
    }

};

Scroller.prototype.calculateViewPortOffsetsForFixedVerticalScrollBar = function (forceScrollBars, useActualBounds) {
    forceScrollBars = forceScrollBars || false;
    useActualBounds = useActualBounds || false;
    if (this.verticalScrollBar && (this._measureViewPort || useActualBounds)) {
        var scrollerHeight = useActualBounds ? this.actualHeight : this._explicitHeight;
        var totalHeight = this._viewPort.height + this._viewPortOffset.top + this._viewPortOffset.bottom;
        this._hasVerticalScrollBar =
            forceScrollBars || this._verticalScrollPolicy === Scroller.SCROLL_POLICY_ON ||
            ((totalHeight > scrollerHeight || totalHeight > this._explicitMaxHeight) &&
            this._verticalScrollPolicy !== Scroller.SCROLL_POLICY_OFF);
    } else {
        this._hasVerticalScrollBar = false;
    }
};

Scroller.prototype.calculateViewPortOffsets = function (forceScrollBars, useActualBounds) {
    forceScrollBars = forceScrollBars || false;
    useActualBounds = useActualBounds || false;
    //in fixed mode, if we determine that scrolling is required, we
    //remember the offsets for later. if scrolling is not needed, then
    //we will ignore the offsets from here forward
    this._viewPortOffset.top = this._paddingTop;
    this._viewPortOffset.rigth = this._paddingRight;
    this._viewPortOffset.bottom = this._paddingBottom;
    this._viewPortOffset.left = this._paddingLeft;
    //we need to double check the horizontal scroll bar if the scroll
    //bars are fixed because adding a vertical scroll bar may require a
    //horizontal one too.
};

Scroller.prototype.throwToPage = function (targetHorizontalPageIndex, targetVerticalPageIndex, duration) {
    duration = duration || 0.5;
    var targetHorizontalScrollPosition = this._horizontalScrollPosition;
    if (targetHorizontalPageIndex >= this._minHorizontalPageIndex) {
        targetHorizontalScrollPosition = this.actualPageWidth * targetHorizontalPageIndex;
    }
    if (targetHorizontalScrollPosition < this._minHorizontalScrollPosition) {
        targetHorizontalScrollPosition = this._minHorizontalScrollPosition;
    }
    if (targetHorizontalScrollPosition > this._maxHorizontalScrollPosition) {
        targetHorizontalScrollPosition = this._maxHorizontalScrollPosition;
    }
    var targetVerticalScrollPosition = this._verticalScrollPosition;
    if (targetVerticalPageIndex >= this._minVerticalPageIndex) {
        targetVerticalScrollPosition = this.actualPageHeight * targetVerticalPageIndex;
    }
    if (targetVerticalScrollPosition < this._minVerticalScrollPosition) {
        targetVerticalScrollPosition = this._minVerticalScrollPosition;
    }
    if (targetVerticalScrollPosition > this._maxVerticalScrollPosition) {
        targetVerticalScrollPosition = this._maxVerticalScrollPosition;
    }
    if (duration > 0) {
        this.throwTo(targetHorizontalScrollPosition, targetVerticalScrollPosition, duration);
    } else {
        this.horizontalScrollPosition = targetHorizontalScrollPosition;
        this.verticalScrollPosition = targetVerticalScrollPosition;
    }
    if (targetHorizontalPageIndex >= this._minHorizontalPageIndex) {
        this._horizontalPageIndex = targetHorizontalPageIndex;
    }
    if (targetVerticalPageIndex >= this._minVerticalPageIndex) {
        this._verticalPageIndex = targetVerticalPageIndex;
    }
};

Scroller.prototype.horizontalScrollBarHideTweenOnComplete = function () {
    this._horizontalScrollBarHideTween = null;
};

Scroller.prototype.verticalScrollBarHideTweenOnComplete = function () {
    this._verticalScrollBarHideTween = null;
};

Scroller.prototype.scrollerEnterFrameHandler = function () {
    this.saveVelocity();
};

/**
 * update the rectangle that defines the clipping area
 */
Scroller.prototype.refreshMask = function () {
    if (!this._clipContent) {
        if (this._viewPort) {
            this._viewPort.mask = null;
        }
        return;
    }
    var clipWidth = this.width - this._viewPortOffset.left - this._viewPortOffset.right;
    if (clipWidth < 0 || isNaN(clipWidth)) {
        clipWidth = 0;
    }
    var clipHeight = this.height - this._viewPortOffset.top - this._viewPortOffset.bottom;
    if (clipHeight < 0 || isNaN(clipHeight)) {
        clipHeight = 0;
    }
    if (!this.mask) {
        this.mask = new PIXI.Graphics();
    }
    var global = this.toGlobal(new PIXI.Point(0, 0));
    this.mask.clear()
        .beginFill('#fff', 1)
        .drawRect(
            global.x,
            global.y,
            clipWidth,
            clipHeight)
        .endFill();
    this.clippingInvalid = false;
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
Scroller.prototype.createScrollBars = function () {
    if(this.horizontalScrollBar) {
        this.removeChild(this.horizontalScrollBar);
        this.horizontalScrollBar = null;
    }
    if(this.verticalScrollBar) {
        this.removeChild(this.verticalScrollBar);
        this.verticalScrollBar = null;
    }
    this.horizontalScrollBar = this._horizontalScrollBarFactory(Scrollable.HORIZONTAL);
    this.verticalScrollBar = this._verticalScrollBarFactory(Scrollable.VERTICAL);
};

Scroller.prototype.defaultScrollBarFactory = function (direction) {
    // TODO: SimpleScrollBar (like feathers?)
    var sb = new ScrollBar(direction, this.theme);
    if (direction === Scrollable.HORIZONTAL) {
        sb.skinName = this.horizontalScrollBarStyleName;
    } else {
        sb.skinName = this.verticalScrollBarStyleName;
    }
    return sb;
};

Scroller.prototype.revealHorizontalScrollBar = function () {
    if (this.horizontalScrollBar) {
        this.addChild(this.horizontalScrollBar);
    }
};

Scroller.prototype.revealVerticalScrollBar = function () {
    if (this.verticalScrollBar) {
        this.addChild(this.verticalScrollBar);
    }
};

Scroller.prototype.hideHorizontalScrollBar = function () {
    if (this.horizontalScrollBar) {
        this.removeChild(this.horizontalScrollBar);
    }
};

Scroller.prototype.hideVerticalScrollBar = function () {
    if (this.verticalScrollBar) {
        this.removeChild(this.verticalScrollBar);
    }
};

Scroller.prototype.throwHorizontally = function (pixelsPerMS) {
    var absPixelsPerMS = Math.abs(pixelsPerMS);
    if (absPixelsPerMS <= Scroller.MINIMUM_VELOCITY) {
        this.finishScrollingHorizontally();
        return;
    }

    var duration = this._fixedThrowDuration;
    if (!this._useFixedThrowDuration) {
        duration = this.calculateDynamicThrowDuration(pixelsPerMS);
    }
    this.throwTo(this._horizontalScrollPosition + this.calculateThrowDistance(pixelsPerMS), NaN, duration);
};

Scroller.prototype.throwVertically = function (pixelsPerMS) {
    var absPixelsPerMS = Math.abs(pixelsPerMS);
    if (absPixelsPerMS <= Scroller.MINIMUM_VELOCITY) {
        this.finishScrollingVertically();
        return;
    }

    var duration = this._fixedThrowDuration;
    if (!this._useFixedThrowDuration) {
        duration = this.calculateDynamicThrowDuration(pixelsPerMS);
    }
    this.throwTo(NaN, this._verticalScrollPosition + this.calculateThrowDistance(pixelsPerMS), duration);
};

/**
 * @private
 */
Scroller.prototype.calculateDynamicThrowDuration = function (pixelsPerMS) {
    return (Math.log(Scroller.MINIMUM_VELOCITY / Math.abs(pixelsPerMS)) / this._logDecelerationRate) / 1000;
};

/**
 * @private
 */
Scroller.prototype.calculateThrowDistance = function (pixelsPerMS) {
    return (pixelsPerMS - Scroller.MINIMUM_VELOCITY) / this._logDecelerationRate;
};

/**
 * @private
 */
Scroller.prototype.finishScrollingHorizontally = function () {
    var targetHorizontalScrollPosition = NaN;
    if (this._horizontalScrollPosition < this._minHorizontalScrollPosition) {
        targetHorizontalScrollPosition = this._minHorizontalScrollPosition;
    } else if (this._horizontalScrollPosition > this._maxHorizontalScrollPosition) {
        targetHorizontalScrollPosition = this._maxHorizontalScrollPosition;
    }

    this._isDraggingHorizontally = false;
    if (targetHorizontalScrollPosition !== targetHorizontalScrollPosition) { //isNaN
        this.completeScroll();
    } else if (Math.abs(targetHorizontalScrollPosition - this._horizontalScrollPosition) < 1) {
        //this distance is too small to animate. just finish now.
        this.horizontalScrollPosition = targetHorizontalScrollPosition;
        this.completeScroll();
    } else {
        this.throwTo(targetHorizontalScrollPosition, NaN, this._elasticSnapDuration);
    }
};

/**
 * @private
 */
Scroller.prototype.finishScrollingVertically = function () {
    var targetVerticalScrollPosition = NaN;
    if (this._verticalScrollPosition < this._minVerticalScrollPosition) {
        targetVerticalScrollPosition = this._minVerticalScrollPosition;
    } else if (this._verticalScrollPosition > this._maxVerticalScrollPosition) {
        targetVerticalScrollPosition = this._maxVerticalScrollPosition;
    }

    this._isDraggingVertically = false;
    if (targetVerticalScrollPosition !== targetVerticalScrollPosition) //isNaN
    {
        this.completeScroll();
    }
    else if (Math.abs(targetVerticalScrollPosition - this._verticalScrollPosition) < 1) {
        //this distance is too small to animate. just finish now.
        this.verticalScrollPosition = targetVerticalScrollPosition;
        this.completeScroll();
    }
    else {
        this.throwTo(NaN, targetVerticalScrollPosition, this._elasticSnapDuration);
    }
};

/**
 * manage tween to throw to horizontal or vertical position
 * call finishScrolling when tween reaches the end position
 *
 * @param targetPosition {number} target position in pixel
 * @param direction {String} direction ('horizontal' or 'vertical')
 * @param duration {number} time needed to reach target position (in ms)
 */
Scroller.prototype._throwToTween = function (targetPosition, direction, duration) {
    if (!this.tweens) {
        this.tweens = {};
    }
    // remove old tween
    var tween;
    if (this.tweens.hasOwnProperty(direction)) {
        tween = this.tweens[direction];
        tween.remove();
        delete this.tweens[direction];
    }

    tween = new Tween(this._viewport, duration);
    this.tween[direction] = tween;
    var to = {};
    to[direction + 'ScrollPosition'] = targetPosition;
    this.tween.to(to);

    return targetPosition;
};

/**
 * throw the scroller to the specified position
 * @param targetHorizontalScrollPosition as PIXI.Point
 * @param targetVerticalScrollPosition as PIXI.Point
 * @param duration
 */
//TODO: see https://github.com/BowlerHatLLC/feathers/blob/master/source/feathers/controls/Scroller.as#L4939
Scroller.prototype.throwTo = function (targetHorizontalScrollPosition, targetVerticalScrollPosition, duration) {
    duration = duration || 500;

    var verticalScrollPosition = this._throwToTween(targetHorizontalScrollPosition, 'horizontal');
    var horizontalScrollPosition = this._throwToTween(targetVerticalScrollPosition, 'vertical');
    var changedPosition = false;
    if (verticalScrollPosition !== this.verticalScrollPosition) {
        changedPosition = true;
        this.revealVerticalScrollBar();
        this.startScroll();
        // pass
        if (duration === 0) {
            this.verticalScrollPosition = targetVerticalScrollPosition;
        }
        // else {}
    } else {
        this.finishScrollingVertically();
    }
    if (horizontalScrollPosition !== this.horizontalScrollPosition) {
        changedPosition = true;
        this.revealHorizontalScrollBar();
        this.startScroll();
        // pass
        if (duration === 0) {
            this.horizontalScrollPosition = targetHorizontalScrollPosition;
        }
        // else {}
    } else {
        this.finishScrollingHorizontally();
    }


    if (changedPosition && duration === 0) {
        this.completeScroll();
    }
};

Scroller.prototype.direction = function () {
    var scrollAuto =
        this._verticalScrollPolicy === Scroller.SCROLL_POLICY_AUTO &&
        this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_AUTO;
    var scroll = 'vertical';
    var scrollVertical =
        this._verticalScrollPolicy === Scroller.SCROLL_POLICY_AUTO ||
        this._verticalScrollPolicy === Scroller.SCROLL_POLICY_ON;
    var scrollHorizontal =
        this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_AUTO ||
        this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_ON;


    // if the scroll direction is set to SCROLL_AUTO we check, if the
    // layout of the content is set to horizontal or the content
    // width is bigger than the current
    if (!scrollVertical || scrollHorizontal ||
        (scrollAuto && (this.layoutHorizontalAlign() || this.upright()) )) {
        scroll = 'horizontal';
    }
    return scroll;
};

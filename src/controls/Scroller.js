var Control = require('../core/Control');
var Tween = require('../utils/Tween');
var Scrollable = require('./Scrollable');
var ScrollBar = require('./ScrollBar');

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
    this.interactionMode = Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS;

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
}

Scroller.prototype = Object.create( Control.prototype );
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

/**
 * change horizontal scroll position.
 * (will update x position of viewport next redraw)
 */
Object.defineProperty(Scroller.prototype, 'horizontalScrollPosition', {
    get: function() {
        return this._scrollPosition.x;
    },
    set: function(value) {
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
    get: function() {
        return this._scrollPosition.y;
    },
    set: function(value) {
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
    get: function() {
        return this._interactionMode;
    },
    set: function(value) {
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
    get: function() {
        return this._clipContent;
    },
    set: function(value) {
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
    get: function() {
        return this._viewPort;
    },
    set: function(value) {
        if (this._viewPort === value) {
			return;
		}
		if(this._viewPort) {
            this.removeChild(this._viewPort);
		}
		this._viewPort = value;
		if(this._viewPort) {
            this.addChildAt(this._viewPort, 0);
		}
        // position according to horizontal/vertical ScrollPosition
        this.scrollInvalid = true;
        this.clippingInvalid = true;
    }
});

Scroller.prototype.refreshInteractionModeEvents = function() {
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

Scroller.prototype.onDown = function(event) {
    var pos = event.data.getLocalPosition(this);
    this._startTouch = pos;

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

Scroller.prototype.onMove = function(event) {
    var pos = event.data.getLocalPosition(this);
    this.checkForDrag(this._startTouch, pos);
};

Scroller.prototype.checkForDrag = function(startTouch, currentTouch) {
    var horizontalMoved = Math.abs(currentTouch.x - startTouch.x);
	var verticalMoved = Math.abs(currentTouch.x - startTouch.x);

    if((this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_ON ||
		this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_AUTO) &&
		!this._isDraggingHorizontally && horizontalMoved >= this.minimumDragDistance)
	{
		startTouch.x = currentTouch.x;
		this._startScrollPosition.x = this._scrollPosition.x;
		this._isDraggingHorizontally = true;
	}
	if((this._verticalScrollPolicy === Scroller.SCROLL_POLICY_ON ||
		this._verticalScrollPolicy === Scroller.SCROLL_POLICY_AUTO) &&
		!this._isDraggingVertically && verticalMoved >= this.minimumDragDistance)
	{
		this._startTouch.y = currentTouch.y;
		this._startScrollPosition.y = this._scrollPosition.y;
		this._isDraggingVertically = true;
	}
	if(this._isDraggingHorizontally && !this._horizontalAutoScrollTween) {
		this.updateHorizontalScrollFromTouchPosition(currentTouch.x);
	}
	if(this._isDraggingVertically && !this._verticalAutoScrollTween) {
		this.updateVerticalScrollFromTouchPosition(currentTouch.y);
	}
};

Scroller.prototype.onUp = function() {

    if (this.touchMoveEventsAdded) {
        this.off('touchend', this.onUp, this);
        this.off('mouseupoutside', this.onUp, this);
        this.off('mouseup', this.onUp, this);
        this.off('touchendoutside', this.onUp, this);

        this.off('touchmove', this.onMove, this);
        this.off('mousemove', this.onMove, this);
    }
    this.touchMoveEventsAdded = false;

    var isFinishingHorizontally = false;
	var isFinishingVertically = false;
	if(this._horizontalScrollPosition < this._scrollBounds.x ||
		this._horizontalScrollPosition > this._scrollBounds.width) {
		isFinishingHorizontally = true;
		this.finishScrollingHorizontally();
	}
	if(this._verticalScrollPosition < this._scrollBounds.y ||
		this._verticalScrollPosition > this._scrollBounds.height)	{
		isFinishingVertically = true;
		this.finishScrollingVertically();
	}

	if(isFinishingHorizontally && isFinishingVertically) {
		return;
	}

    var sum, velocityCount, totalWeight, i, weight;
	if(!isFinishingHorizontally && this._isDraggingHorizontally)
	{
		//take the average for more accuracy
		sum = this._velocity.x * Scroller.CURRENT_VELOCITY_WEIGHT;
		velocityCount = this._previousVelocityX.length;
		totalWeight = Scroller.CURRENT_VELOCITY_WEIGHT;
		for (i = 0; i < velocityCount; i++)
		{
			weight = Scroller.VELOCITY_WEIGHTS[i];
			sum += this._previousVelocityX.shift() * weight;
			totalWeight += weight;
		}
		this.throwHorizontally(sum / totalWeight);
	} else {
		this.hideHorizontalScrollBar();
	}

	if(!isFinishingVertically && this._isDraggingVertically)
	{
		sum = this._velocity.y * Scroller.CURRENT_VELOCITY_WEIGHT;
		velocityCount = this._previousVelocityY.length;
		totalWeight = Scroller.CURRENT_VELOCITY_WEIGHT;
		for(i = 0; i < velocityCount; i++)
		{
			weight = Scroller.VELOCITY_WEIGHTS[i];
			sum += this._previousVelocityY.shift() * weight;
			totalWeight += weight;
		}
		this.throwVertically(sum / totalWeight);
	} else {
		this.hideVerticalScrollBar();
	}
};

// performance increase to avoid using call.. (10x faster)
Scroller.prototype.controlRedraw = Control.prototype.redraw;
/**
 * update before draw call
 *
 * @method redraw
 */
Scroller.prototype.redraw = function() {
    if (this.scrollbarInvalid) {
        this.createScrollBars();
    }
    if(this.clippingInvalid) {
		this.refreshMask();
	}

    if (this._viewport && this._viewPort.updateRenderable) {
        this._viewPort.updateRenderable(
            -this._viewPort.x, -this._viewPort.y,
            this.width, this.height);
    }
    this.controlRedraw();
};

Scroller.prototype.updateHorizontalScrollFromTouchPosition = function(touchX) {
	var offset = this._startTouch.x - touchX;
	var position = this._startHorizontalScrollPosition + offset;
	if(position < this._minHorizontalScrollPosition)
	{
		if(this.hasElasticEdges)
		{
			position -= (position - this._minHorizontalScrollPosition) * (1 - this.elasticity);
		}
		else
		{
			position = this._minHorizontalScrollPosition;
		}
	}
	else if(position > this._maxHorizontalScrollPosition)
	{
		if(this.hasElasticEdges)
		{
			position -= (position - this._maxHorizontalScrollPosition) * (1 - this.elasticity);
		}
		else
		{
			position = this._maxHorizontalScrollPosition;
		}
	}
	this.horizontalScrollPosition = position;
};

Scroller.prototype.updateVerticalScrollFromTouchPosition = function(touchY) {
	var offset = this._startTouch.y - touchY;
	var position = this._startVerticalScrollPosition + offset;
	if(position < this._minVerticalScrollPosition)
	{
		if(this.hasElasticEdges)
		{
			position -= (position - this._minVerticalScrollPosition) * (1 - this.elasticity);
		}
		else
		{
			position = this._minVerticalScrollPosition;
		}
	}
	else if(position > this._maxVerticalScrollPosition)
	{
		if(this.hasElasticEdges)
		{
			position -= (position - this._maxVerticalScrollPosition) * (1 - this.elasticity);
		}
		else
		{
			position = this._maxVerticalScrollPosition;
		}
	}
	this.verticalScrollPosition = position;
};












Scroller.prototype.startScroll = function() {
	if (this._isScrolling) {
		return;
	}
	this._isScrolling = true;
};

// 3333
Scroller.prototype.stopScrolling = function() {
    if(this._horizontalAutoScrollTween) {
		this._horizontalAutoScrollTween.remove();
		this._horizontalAutoScrollTween = null;
	}
	if(this._verticalAutoScrollTween) {
        this._verticalAutoScrollTween.remove();
		this._verticalAutoScrollTween = null;
	}
	this._isScrollingStopped = true;
	this._velocity.x = 0;
	this._velocity.y = 0;
	this.hideHorizontalScrollBar();
	this.hideVerticalScrollBar();
};

Scroller.prototype.completeScroll = function() {
    if (!this._isScrolling || this._verticalAutoScrollTween || this._horizontalAutoScrollTween ||
        this._isDraggingHorizontally || this._isDraggingVertically ||
        this._horizontalScrollBarIsScrolling || this._verticalScrollBarIsScrolling) {
        return;
    }
    this._isScrolling = false;
    this.hideHorizontalScrollBar();
    this.hideVerticalScrollBar();
};

Scroller.prototype.revealScrollBars = function() {
    this.isScrollBarRevealPending = true;
};

/**
 * update the rectangle that defines the cliping area
 */
Scroller.prototype.refreshMask = function() {
    if(!this._clipContent) {
        if (this._viewPort) {
            this._viewPort.mask = null;
        }
		return;
	}
    var clipWidth = this.width - this._viewPortOffset.left - this._viewPortOffset.right;
	if(clipWidth < 0 || isNaN(clipWidth)) {
		clipWidth = 0;
	}
	var clipHeight = this.height - this._viewPortOffset.top - this._viewPortOffset.bottom;
	if(clipHeight < 0 || isNaN(clipHeight)) {
		clipHeight = 0;
	}
	if(!this.mask) {
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
Scroller.prototype.createScrollBars = function() {

    this.horizontalScrollBar = this._horizontalScrollBarFactory(Scrollable.HORIZONTAL);
    this.verticalScrollBar = this._verticalScrollBarFactory(Scrollable.VERTICAL);
};

Scroller.prototype.defaultScrollBarFactory = function(direction) {
    // TODO: SimpleScrollBar (like feathers?)
    var sb = new ScrollBar(direction, this.theme);
    if (direction === Scrollable.HORIZONTAL) {
        sb.skinName = this.horizontalScrollBarStyleName;
    } else {
        sb.skinName = this.verticalScrollBarStyleName;
    }
    return sb;
};

Scroller.prototype.revealHorizontalScrollBar = function() {
    //TODO: implement me!
};

Scroller.prototype.revealVerticalScrollBar = function() {
    //TODO: implement me!
};

Scroller.prototype.hideHorizontalScrollBar = function() {
    //TODO: implement me!
};

Scroller.prototype.hideVerticalScrollBar = function() {
    //TODO: implement me!
};

Scroller.prototype.throwHorizontally = function(pixelsPerMS) {
    var absPixelsPerMS = Math.abs(pixelsPerMS);
	if(absPixelsPerMS <= Scroller.MINIMUM_VELOCITY) {
		this.finishScrollingHorizontally();
		return;
	}

	var duration = this._fixedThrowDuration;
	if(!this._useFixedThrowDuration)
	{
		duration = this.calculateDynamicThrowDuration(pixelsPerMS);
	}
	this.throwTo(this._horizontalScrollPosition + this.calculateThrowDistance(pixelsPerMS), NaN, duration);
};

Scroller.prototype.throwVertically = function(pixelsPerMS) {
    var absPixelsPerMS = Math.abs(pixelsPerMS);
	if (absPixelsPerMS <= Scroller.MINIMUM_VELOCITY) {
		this.finishScrollingVertically();
		return;
	}

	var duration = this._fixedThrowDuration;
	if(!this._useFixedThrowDuration)
	{
		duration = this.calculateDynamicThrowDuration(pixelsPerMS);
	}
	this.throwTo(NaN, this._verticalScrollPosition + this.calculateThrowDistance(pixelsPerMS), duration);
};

/**
 * @private
 */
Scroller.prototype.calculateDynamicThrowDuration = function(pixelsPerMS) {
	return (Math.log(Scroller.MINIMUM_VELOCITY / Math.abs(pixelsPerMS)) / this._logDecelerationRate) / 1000;
};

/**
 * @private
 */
Scroller.prototype.calculateThrowDistance = function(pixelsPerMS) {
	return (pixelsPerMS - Scroller.MINIMUM_VELOCITY) / this._logDecelerationRate;
};

/**
 * @private
 */
Scroller.prototype.finishScrollingHorizontally = function() {
	var targetHorizontalScrollPosition = NaN;
	if(this._horizontalScrollPosition < this._minHorizontalScrollPosition)
	{
		targetHorizontalScrollPosition = this._minHorizontalScrollPosition;
	}
	else if(this._horizontalScrollPosition > this._maxHorizontalScrollPosition)
	{
		targetHorizontalScrollPosition = this._maxHorizontalScrollPosition;
	}

	this._isDraggingHorizontally = false;
	if(targetHorizontalScrollPosition !== targetHorizontalScrollPosition) //isNaN
	{
		this.completeScroll();
	}
	else if(Math.abs(targetHorizontalScrollPosition - this._horizontalScrollPosition) < 1)
	{
		//this distance is too small to animate. just finish now.
		this.horizontalScrollPosition = targetHorizontalScrollPosition;
		this.completeScroll();
	}
	else
	{
		this.throwTo(targetHorizontalScrollPosition, NaN, this._elasticSnapDuration);
	}
};

/**
 * @private
 */
Scroller.prototype.finishScrollingVertically = function() {
	var targetVerticalScrollPosition = NaN;
	if(this._verticalScrollPosition < this._minVerticalScrollPosition)
	{
		targetVerticalScrollPosition = this._minVerticalScrollPosition;
	}
	else if(this._verticalScrollPosition > this._maxVerticalScrollPosition)
	{
		targetVerticalScrollPosition = this._maxVerticalScrollPosition;
	}

	this._isDraggingVertically = false;
	if(targetVerticalScrollPosition !== targetVerticalScrollPosition) //isNaN
	{
		this.completeScroll();
	}
	else if(Math.abs(targetVerticalScrollPosition - this._verticalScrollPosition) < 1)
	{
		//this distance is too small to animate. just finish now.
		this.verticalScrollPosition = targetVerticalScrollPosition;
		this.completeScroll();
	}
	else
	{
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
 * @param finishScrolling {function} function called when
 */
Scroller.prototype._throwToTween = function(targetPosition, direction, duration) {
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
 * @param position as PIXI.Point
 */
//TODO: see https://github.com/BowlerHatLLC/feathers/blob/master/source/feathers/controls/Scroller.as#L4939
Scroller.prototype.throwTo = function(targetHorizontalScrollPosition, targetVerticalScrollPosition, duration) {
    duration = duration || 500;

    var verticalScrollPosition = this._throwToTween(
        targetHorizontalScrollPosition,
        'horizontal');
    var horizontalScrollPosition = this._throwToTween(
        targetVerticalScrollPosition,
        'vertical'
    );
    var changedPosition = false;
    if (verticalScrollPosition !== this.verticalScrollPosition) {
        changedPosition = true;
        // pass
    }
    if (horizontalScrollPosition !== this.horizontalScrollPosition) {
        changedPosition = true;
        // pass
    }

    if (changedPosition && duration === 0) {
        this.completeScroll();
	}
};

/**
 * change scrollbar factory
 */
Object.defineProperty(Scroller.prototype, 'horizontalScrollBarFactory', {
    get: function() {
        return this._horizontalScrollBarFactory;
    },
    set: function(value) {
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
    get: function() {
        return this._verticalScrollBarFactory;
    },
    set: function(value) {
        if (this._verticalScrollBarFactory === value) {
			return;
		}
        this._verticalScrollBarFactory = value;
        this.scrollBarInvalid = true;
    }
});

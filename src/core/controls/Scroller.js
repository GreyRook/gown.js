var Control = require('../Control');

/**
 * The Scroller hosts some content that can be scrolled. The width/height
 * of the Scroller defines the viewport.
 *
 * @class Scroller
 * @extends PIXI_UI.Control
 * @memberof PIXI_UI
 * @constructor
 */
function Scroller() {
    Control.call(this);
}

Scroller.prototype = Object.create( Control.prototype );
Scroller.prototype.constructor = Scroller;
module.exports = Scroller;

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
};

// TODO: scrollSteps pageIndex updateVerticalScrollFromTouchPosition throwTo hideHorizontalScrollBar revealHorizontalScrollBar

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
    Control.call(this, theme);
    this.createScrollBars();
    this._horizontalScrollBarFactory = this.defaultScrollBarFactory;
    this._verticalScrollBarFactory = this.defaultScrollBarFactory;
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
    this.horizontalScrollBar = this._horizontalScrollBarFactory();
    this.verticalScrollBar = this._varticalScrollBarFactory();
};

Scroller.prototype.defaultScrollBarFactory = function() {
    return new ScrollBar();
};

// TODO: elastic scrollSteps pageIndex updateVerticalScrollFromTouchPosition throwTo hideHorizontalScrollBar revealHorizontalScrollBar

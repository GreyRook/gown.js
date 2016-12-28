var Scrollable = require('./Scrollable');

// TODO: decrement/increment Button
// TODO: thumbFactory?
// TODO: this.showButtons

/**
 * scroll bar with thumb
 * hosting some Viewport (e.g. a ScrollContainer or a Texture)
 *
 * @class ScrollBar
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 */
function ScrollBar(direction, theme) {
    this.skinName = this.skinName || ScrollBar.SKIN_NAME;

    // this.viewPort = container;

    this.direction = direction === undefined ?
        Scrollable.HORIZONTAL : direction;

    // if (container) {
    //     // move thumb when viewPort moves
    //     container[this.direction + '_bar'] = this;
    // }
    Scrollable.call(this, theme);
}

ScrollBar.prototype = Object.create( Scrollable.prototype );
ScrollBar.prototype.constructor = ScrollBar;
module.exports = ScrollBar;

ScrollBar.prototype.minThumbWidth = 20;
ScrollBar.prototype.minThumbHeight = 20;

ScrollBar.SKIN_NAME = 'scroll_bar';

ScrollBar.prototype.scrollableredraw = Scrollable.prototype.redraw;
/**
 * recalculate scroll thumb width/height
 * @method redraw
 */
ScrollBar.prototype.redraw = function() {
    if (this.invalidTrack) {
        if (this.container && this.thumb) {
            if (this.direction === Scrollable.HORIZONTAL) {
                this.thumb.width = Math.max(this.minThumbWidth,
                    this.container.width /
                    (this.container.viewPort.width / this.container.width));
            } else {
                this.thumb.height = Math.max(this.minThumbHeight,
                    this.container.height /
                    (this.container.viewPort.height / this.container.height));
            }
        }
        this.scrollableredraw(this);
    }
};

/**
 * thumb has been moved - scroll content to position
 * @param x x-position to scroll to (ignored when vertical)
 * @param y y-position to scroll to (ignored when horizontal)
 * @method thumbMoved
 */
ScrollBar.prototype.thumbMoved = function(x, y) {
    if (this.container && this.container.viewPort) {
        if (this._direction === Scrollable.HORIZONTAL) {
            this.container._scrollContent(
                -(this.container.viewPort.width - this.container.width) *
                    (x / (this.container.width - this.thumb.width)),
                0);
        } else if (this._direction === Scrollable.VERTICAL) {
            this.container._scrollContent(
                0,
                -(this.container.viewPort.height - this.container.height) *
                    (y / (this.container.height - this.thumb.height)));
        }
    }
};

/**
 * Determines if the scroll bar's thumb can be dragged horizontally or
 * vertically.
 *
 * @property direction
 * @type String
 */
Object.defineProperty(ScrollBar.prototype, 'direction', {
    get: function() {
        return this._direction;
    },
    set: function(direction) {
        this._direction = direction;
        this.invalid = true;
    }
});

/**
 * value of the scrollbar
 * TODO: put in Scrollable
 *
 * @property value
 * @type Number
 */
Object.defineProperty(ScrollBar.prototype, 'value', {
    get: function() {
        return this._value;
    },
    set: function(value) {
        this._value = value;
    }
});

var Scrollable = require('./Scrollable');

// TODO: decreement/increment Button
// TODO: thumbFactory?
// TODO: this.showButtons

/**
 * scoll bar with thumb
 * hosting some Viewport (e.g. a ScrollContainer or a Texture)
 *
 * @class ScrollBar
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 */
function ScrollBar(direction, theme) {
    this.skinName = this.skinName || ScrollBar.SKIN_NAME;

    this.direction = direction;
    if (this.direction === undefined) {
        this.direction = Scrollable.HORIZONTAL;
    }
    Scrollable.call(this, theme);
}

ScrollBar.prototype = Object.create( Scrollable.prototype );
ScrollBar.prototype.constructor = ScrollBar;
module.exports = ScrollBar;


ScrollBar.SKIN_NAME = 'scroll_bar';

ScrollBar.prototype.scrollableredraw = Scrollable.prototype.redraw;
/**
 * recalculate scroll thumb width/height
 * @method redraw
 */
ScrollBar.prototype.redraw = function() {
    if (this.invalidTrack) {
        if (this.scrollArea && this.thumb) {
            if (this.direction === Scrollable.HORIZONTAL) {
                this.thumb.width = Math.max(20, this.scrollArea.width /
                    (this.scrollArea.content.width / this.scrollArea.width));
            } else {
                this.thumb.height = Math.max(20, this.scrollArea.height /
                    (this.scrollArea.content.height / this.scrollArea.height));
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
    if (this.scrollArea && this.scrollArea.content) {

        if (this._direction === Scrollable.HORIZONTAL) {
            this.scrollArea._scrollContent(
                -(this.scrollArea.content.width - this.scrollArea.width) *
                    (x / (this.scrollArea.width - this.thumb.width)),
                0);
        } else {
            this.scrollArea._scrollContent(
                0,
                -(this.scrollArea.content.height - this.scrollArea.height) *
                    (y / (this.scrollArea.height - this.thumb.height)));
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

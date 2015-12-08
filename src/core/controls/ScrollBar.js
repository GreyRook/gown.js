var Scrollable = require('./Scrollable'),
    LayoutAlignment = require('../layout/LayoutAlignment');

/**
 * scoll bar with thumb
 * hosting some Viewport (e.g. a ScrollArea or a Texture)
 *
 * @class ScrollArea
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 */
function ScrollBar(scrollArea, thumb, theme, skinName) {
    this.scrollArea = scrollArea;
    this.skinName = skinName || ScrollBar.SKIN_NAME;

    if (this.orientation === undefined) {
        this.orientation = Scrollable.HORIZONTAL;
        if (scrollArea && scrollArea.content &&
            scrollArea.content.layout.alignment ===
                LayoutAlignment.VERTICAL_ALIGNMENT) {
            this.orientation = Scrollable.VERTICAL;
        }
    }
    if (scrollArea) {
        //scrollArea
        // move thumb when scrollarea moves
        scrollArea.bar = this;
    }
    Scrollable.call(this, thumb, theme);
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
            if (this.orientation === Scrollable.HORIZONTAL) {
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

        if (this.orientation === Scrollable.HORIZONTAL) {
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

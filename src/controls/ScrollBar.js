/**
 * authors: Björn Friedrichs, Andreas Bresser
 */

PIXI_UI.ScrollBar = function(scrollArea, thumb, theme) {
    this.scrollArea = scrollArea;
    this.skinName = this.skinName || PIXI_UI.ScrollBar.SKIN_NAME;

    if (this.orientation === undefined) {
        this.orientation = PIXI_UI.Scrollable.HORIZONTAL;
        if (scrollArea && scrollArea.content &&
            scrollArea.content.layout.alignment ===
                PIXI_UI.LayoutAlignment.VERTICAL_ALIGNMENT) {
            this.orientation = PIXI_UI.Scrollable.VERTICAL;
        }
    }
    PIXI_UI.Scrollable.call(this, thumb, theme);
};

PIXI_UI.ScrollBar.prototype = Object.create( PIXI_UI.Scrollable.prototype );
PIXI_UI.ScrollBar.prototype.constructor = PIXI_UI.ScrollBar;

PIXI_UI.ScrollBar.SKIN_NAME = 'scroll_bar';

PIXI_UI.ScrollBar.prototype.scrollableredraw = PIXI_UI.Scrollable.prototype.redraw;
PIXI_UI.ScrollBar.prototype.redraw = function() {
    if (this.invalidTrack) {
        if (this.scrollArea && this.thumb) {
            if (this.orientation === PIXI_UI.Scrollable.HORIZONTAL) {
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
 */
PIXI_UI.ScrollBar.prototype.thumbMoved = function(x, y) {
    if (this.scrollArea && this.scrollArea.content) {

        if (this.orientation === PIXI_UI.Scrollable.HORIZONTAL) {
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

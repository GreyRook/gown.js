/**
 * @author Andreas Bresser
 */

/**
 * HorizontalLayout - just set alignment to
 * LayoutAlignment.HORIZONTAL_ALIGNMENT
 *
 * @class HorizontalLayout
 * @constructor
 */
PIXI_UI.HorizontalLayout = function() {
    PIXI_UI.LayoutAlignment.call(this);
    this.alignment = PIXI_UI.LayoutAlignment.HORIZONTAL_ALIGNMENT;
};

PIXI_UI.HorizontalLayout.prototype = Object.create( PIXI_UI.LayoutAlignment.prototype );
PIXI_UI.HorizontalLayout.prototype.constructor = PIXI_UI.HorizontalLayout;

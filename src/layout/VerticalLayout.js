/**
 * @author Andreas Bresser
 */

/**
 * VerticalLayout - just set alignment to
 * LayoutAlignment.VERTICAL_ALIGNMENT
 *
 * @class VerticalLayout
 * @constructor
 */
PIXI_UI.VerticalLayout = function() {
    PIXI_UI.LayoutAlignment.call(this);
    this.alignment = PIXI_UI.LayoutAlignment.VERTICAL_ALIGNMENT;
};

PIXI_UI.VerticalLayout.prototype = Object.create( PIXI_UI.LayoutAlignment.prototype );
PIXI_UI.VerticalLayout.prototype.constructor = PIXI_UI.VerticalLayout;

var LayoutAlignment = require('./LayoutAlignment');

/**
 * VerticalLayout - just set alignment to
 * LayoutAlignment.VERTICAL_ALIGNMENT
 *
 * @class VerticalLayout
 * @extends GOWN.layout.LayoutAlignment
 * @memberof GOWN.layout
 * @constructor
 */
function VerticalLayout() {
    LayoutAlignment.call(this);
    this.alignment = LayoutAlignment.VERTICAL_ALIGNMENT;
}

VerticalLayout.prototype = Object.create( LayoutAlignment.prototype );
VerticalLayout.prototype.constructor = VerticalLayout;
module.exports = VerticalLayout;

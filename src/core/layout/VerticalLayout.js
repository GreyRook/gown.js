var LayoutAlignment = require('./LayoutAlignment');

/**
 * VerticalLayout - just set alignment to
 * LayoutAlignment.VERTICAL_ALIGNMENT
 *
 * @class VerticalLayout
 * @extends GOWN.LayoutAlignment
 * @memberof GOWN
 * @constructor
 */
function VerticalLayout() {
    LayoutAlignment.call(this);
    this.alignment = LayoutAlignment.VERTICAL_ALIGNMENT;
}

VerticalLayout.prototype = Object.create( LayoutAlignment.prototype );
VerticalLayout.prototype.constructor = VerticalLayout;
module.exports = VerticalLayout;

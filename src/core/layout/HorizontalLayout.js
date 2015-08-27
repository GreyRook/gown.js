var LayoutAlignment = require('./LayoutAlignment');

/**
 * HorizontalLayout - just set alignment to
 * LayoutAlignment.HORIZONTAL_ALIGNMENT
 *
 * @class HorizontalLayout
 * @extends GOWN.LayoutAlignment
 * @memberof GOWN
 * @constructor
 */
function HorizontalLayout() {
    LayoutAlignment.call(this);
    this.alignment = LayoutAlignment.HORIZONTAL_ALIGNMENT;
}

HorizontalLayout.prototype = Object.create( LayoutAlignment.prototype );
HorizontalLayout.prototype.constructor = HorizontalLayout;
module.exports = HorizontalLayout;

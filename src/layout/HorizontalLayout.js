var LayoutAlignment = require('./LayoutAlignment');

/**
 * HorizontalLayout - just sets the alignment to
 * LayoutAlignment.HORIZONTAL_ALIGNMENT
 *
 * @class HorizontalLayout
 * @extends GOWN.layout.LayoutAlignment
 * @memberof GOWN.layout
 * @constructor
 */
function HorizontalLayout() {
    LayoutAlignment.call(this);

    /**
     * The alignment of the layout
     *
     * @type String
     * @default LayoutAlignment.HORIZONTAL_ALIGNMENT
     */
    this.alignment = LayoutAlignment.HORIZONTAL_ALIGNMENT;
}

HorizontalLayout.prototype = Object.create( LayoutAlignment.prototype );
HorizontalLayout.prototype.constructor = HorizontalLayout;
module.exports = HorizontalLayout;

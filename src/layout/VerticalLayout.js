var LayoutAlignment = require('./LayoutAlignment');

/**
 * VerticalLayout - just sets the alignment to
 * LayoutAlignment.VERTICAL_ALIGNMENT
 *
 * @class VerticalLayout
 * @extends GOWN.layout.LayoutAlignment
 * @memberof GOWN.layout
 * @constructor
 */
function VerticalLayout() {
    LayoutAlignment.call(this);

    /**
     * The alignment of the layout
     *
     * @type String
     * @default LayoutAlignment.VERTICAL_ALIGNMENT
     */
    this.alignment = LayoutAlignment.VERTICAL_ALIGNMENT;
}

VerticalLayout.prototype = Object.create( LayoutAlignment.prototype );
VerticalLayout.prototype.constructor = VerticalLayout;
module.exports = VerticalLayout;

/**
 * define viewport dimensions
 *
 * @class HorizontalLayout
 * @memberof GOWN
 * @constructor
 */
function ViewPortBounds() {
    /**
     * The explicit width of the view port, in pixels. If <code>NaN</code>,
     * there is no explicit width value.
     *
     * @property explicitWidth
     */
    this.explicitWidth = NaN;

    /**
     * The explicit height of the view port, in pixels. If <code>NaN</code>,
     * there is no explicit height value.
     *
     * @property explicitHeight
     */
    this.explicitHeight = NaN;

    /**
     * x-position
     *
     * @property x
     */
    this.x = 0;

    /**
     * y-position
     *
     * @property y
     */
    this.y = 0;
}

module.exports = ViewPortBounds;
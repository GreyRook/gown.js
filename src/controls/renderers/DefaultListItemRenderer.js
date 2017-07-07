var ToggleButton = require('../ToggleButton');
var Button = require('../Button');

/**
 * The default list item renderer.
 *
 * @class DefaultListItemRenderer
 * @extends GOWN.ToggleButton
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the DefaultListItemRenderer {GOWN.Theme}
 */
function DefaultListItemRenderer(theme) {
    ToggleButton.call(this, theme);

    /**
     * A key in the item data that will be shown as label for the item.
     * e.g. 'text' for item.text.
     * will be ignored if labelFunction is set.
     *
     * the item will be shown directly (using toString) if
     * labelField and labelFunction are not set.
     *
     * @type String
     * @default 'text'
     */
    this.labelField = 'text';

    /**
	 * A function used to generate label text for a specific item. If this
	 * function is not null, then the <code>labelField</code> will be
	 * ignored.
	 *
	 * <p>In the following example, the label function is customized:</p>
	 * renderer.labelFunction = function( item ) {
	 *    return item.firstName + " " + item.lastName;
	 * };</listing>
	 *
     * @type function
	 * @default null
	 *
	 * @see #labelField
	 */
    this.labelFunction = null;

    /**
     * The list item data
     *
     * @private
     * @default null
     */
    this._data = null;

    /**
     * Overwrite data values before next draw call.
     *
     * @private
     * @type bool
     * @default false
     */
    this.dataInvalid = false;


    // TODO: use min/max and/or default values instead, because percentages
    // have higher priority, so this forces the user to remove the percentage
    // before he can set pixel values.
    /**
     * Percent width
     *
     * @private
     * @type Number
     * @default 100
     */
    this.percentWidth = 100;

    /**
     * Percent height
     *
     * @private
     * @type Number
     * @default 100
     */
    this.percentHeight = 100;
}

DefaultListItemRenderer.prototype = Object.create( ToggleButton.prototype );
DefaultListItemRenderer.prototype.constructor = DefaultListItemRenderer;
module.exports = DefaultListItemRenderer;

// performance increase to avoid using call.. (10x faster)
DefaultListItemRenderer.prototype.redrawButton = Button.prototype.redraw;

/**
 * Update button text before draw call
 */
DefaultListItemRenderer.prototype.redraw = function() {
    if (this.dataInvalid) {
        this.commitData();
    }
    this.redrawButton();
};

/**
 * Updates the renderer to display the item's data. Override this
 * function to pass data to sub-components and react to data changes.
 *
 * <p>Don't forget to handle the case where the data is <code>null</code>.</p>
 */
DefaultListItemRenderer.prototype.commitData = function() {
    if(this._data) {
        this.label = this.itemToLabel(this._data);
    }
    this.dataInvalid = false;
};

/**
 * Using <code>labelField</code> and <code>labelFunction</code>,
 * generates a label from the item.
 *
 * <p>All of the label fields and functions, ordered by priority:</p>
 * <ol>
 *     <li><code>labelFunction</code></li>
 *     <li><code>labelField</code></li>
 * </ol>
 *
 * @param item the item that gets converted to a label
 */
DefaultListItemRenderer.prototype.itemToLabel = function(item) {
	if (this.labelFunction) {
		return this.labelFunction(item).toString();
	}
	else if (this.labelField && item && item.hasOwnProperty(this.labelField)) {
		return item[this.labelField].toString();
	}
	else if(item) {
		return item.toString();
	}
	return '';
};

/**
 * Data
 *
 * @name GOWN.DefaultListItemRenderer#data
 */
Object.defineProperty(DefaultListItemRenderer.prototype, 'data', {
    set: function(data) {
        this._data = data;
        this.dataInvalid = true;
    },
    get: function() {
        return this._data;
    }
});

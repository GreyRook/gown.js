var ToggleButton = require('../ToggleButton');
var Button = require('../Button');

function DefaultListItemRenderer(theme) {
    //this._skinName = DefaultListItemRenderer.SKIN_NAME;
    ToggleButton.call(this, theme);

    /**
     * A key in the item data that will be shown as label for the item.
     * e.g. 'text' for item.text.
     * will be ignored if labelFunction is set.
     *
     * the item will be shown directly (using toString) if
     * labelField and labelFunction are not set.
     *
     * @default 'text'
     */
    this.labelField = 'text';

    /**
	 * A function used to generate label text for a specific item. If this
	 * function is not null, then the <code>labelField</code> will be
	 * ignored.
	 *
	 * <p>The function is expected to have the following signature:</p>
	 * <pre>function( item )</pre> and return a string
	 *
	 * <p>In the following example, the label function is customized:</p>
	 * renderer.labelFunction = function( item ) {
	 *    return item.firstName + " " + item.lastName;
	 * };</listing>
	 *
	 * @default null
	 *
	 * @see #labelField
	 */
    this.labelFunction = null;

    this._data = null;
    this.dataInvalid = false;
}

DefaultListItemRenderer.prototype = Object.create( ToggleButton.prototype );
DefaultListItemRenderer.prototype.constructor = DefaultListItemRenderer;
module.exports = DefaultListItemRenderer;

//DefaultListItemRenderer.STYLE_NAME = "default_item_renderer";

// performance increase to avoid using call.. (10x faster)
DefaultListItemRenderer.prototype.redrawButton = Button.prototype.redraw;

/**
 * update before draw call update button text
 *
 * @method redraw
 */
DefaultListItemRenderer.prototype.redraw = function() {
    if (this.dataInvalid) {
        this.commitData();
    }
    this.redrawButton();
};

Object.defineProperty(DefaultListItemRenderer.prototype, 'data', {
    set: function(data) {
        this._data = data;
        this.dataInvalid = true;
    },
    get: function() {
        return this._data;
    }
});

/**
 * Updates the renderer to display the item's data. Override this
 * function to pass data to sub-components and react to data changes.
 *
 * <p>Don't forget to handle the case where the data is <code>null</code>.</p>
 *
 * @method commitData
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
 * @method itemToLabel
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

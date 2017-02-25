var Layout = require('./Layout');
var itemDimensions = require('./utils/itemDimensions');

/**
 * basic layout
 *
 * @class LayoutAlignment
 * @extends GOWN.layout.Layout
 * @memberof GOWN.layout
 * @constructor
 */
function LayoutAlignment() {
    Layout.call(this);
}

LayoutAlignment.prototype = Object.create( Layout.prototype );
LayoutAlignment.prototype.constructor = LayoutAlignment;
module.exports = LayoutAlignment;

LayoutAlignment.VERTICAL_ALIGNMENT = 'vertical';
LayoutAlignment.HORIZONTAL_ALIGNMENT = 'horizontal';

/**
* apply percentage width/height to items.
* this will use the explicit width/height and apply it to all items
* according to its percentages
*
* percentages have higher priorities than fixed values.
* So if you set a width higher than 0 but also percentWidth,
* the width will be recalculated according to percentWidth.
*
* @method inheritPercent
* @param items
* @param explicit space we have for the components
 */
LayoutAlignment.prototype.applyFixedPercent = function(items, explicit, alignment) {
    var itemCount = items.length;
    var i, item, itemPercent;
    for (i = 0; i < itemCount; i++) {
        item = items[i];
        // note: this is the opposide of what we normally want
        itemPercent = 0;
        if (alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT) {
            itemPercent = item.percentWidth;
        } else {
            itemPercent = item.percentHeight;
        }
        if (itemPercent > 0) {
            if (alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT) {
                item.width = explicit * itemPercent / 100;
            } else {
                item.height = explicit * itemPercent / 100;
            }
        }
    }
};

/**
 * apply percentage width/height to items.
 * this will stack items on top/aside of each other
 *
 * percentages have higher priorities than fixed values.
 * So if you set a width higher than 0 but also percentWidth,
 * the width will be recalculated according to percentWidth.
 *
 * @method applyPercent
 * @param items
 * @param explicit space we have for the components
 * (this function will handle padding and gap, so the explicitWidth is
 *  for the whole available width)
 */
LayoutAlignment.prototype.applyPercent = function(items, explicit) {
    var _hor = (this.alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT);

    var itemCount = items.length;
    var remaining = explicit;
    var totalExplicit = 0;
    var totalPercent = 0;

    var i, itemPercent, item;
    // sum up width/height required for all items
    for (i = 0; i < itemCount; i++) {
        item = items[i];
        var itemSpace;

        var dimensions = itemDimensions(item);

        itemPercent = _hor ? item.percentWidth : item.percentHeight;
        itemSpace = _hor ? dimensions[0] : dimensions[1];

        if (!isNaN(itemPercent) && itemPercent !== undefined &&
            itemPercent !== null) {
            totalPercent += itemPercent;
        } else if (!isNaN(itemSpace)) {
            // no percentWidth/percentHeight set for this item
            totalExplicit += itemSpace;
        }
    }

    // add space for all gaps
    totalExplicit += this._firstGap > 0 ? this._firstGap : this._gap;
    totalExplicit += (this._gap * (itemCount - 3));
    totalExplicit += this._lastGap > 0 ? this._lastGap : this._gap;

    var padding = _hor ?
        this._paddingLeft + this._paddingRight :
        this._paddingTop + this._paddingBottom;
    totalExplicit += padding;

    // use whole available space - if we do not sum up to 100 we will
    // stretch the items
    if(totalPercent < 100) {
        totalPercent = 100;
    }

    var percentToPixels = (remaining - totalExplicit) / totalPercent;
    // claculate width/height for each item based on remaining width/height
    this.applyFixedPercent(items, percentToPixels * 100, this.alignment);
};

/**
 * get current gap (includes first and last gap)
 *
 * @method _currentGap
 * @private
 * @param i current item position
 * @param items list of items (to determine if we are at the last gap)
 */
LayoutAlignment.prototype._currentGap = function(i, items) {
    if(!isNaN(this._firstGap) && i === 0)
    {
        return this._firstGap;
    }
    else if(!isNaN(this._lastGap) && i > 0 && i === items.length - 2)
    {
        return this._lastGap;
    }
    return this._gap;
};

/**
 * calculate layout for container (and its children)
 */
LayoutAlignment.prototype.layoutContainer = function(container) {
    var dimensions = itemDimensions(container);
    return this.layout(container.children, dimensions[0], dimensions[1]);

};

/**
 * Position (and possibly resizes) the supplied items.
 *
 * @method layout
 * @param items items that will be layouted {Array}
 * @param maxWidth max. width for the items {Number}
 * @param maxWidth max. height for the items {Number}
 */
LayoutAlignment.prototype.layout = function(items, maxWidth, maxHeight) {
    var _hor = (this.alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT);

    // width/height the current layout takes
    var width = 0;
    var height = 0;
    var paddingStart = _hor ? this._paddingLeft : this._paddingTop;

    // recalculate width/height for items with percentages
    this.applyPercent(items, _hor ? maxWidth : maxHeight);
    this.applyFixedPercent(items, _hor ? maxHeight : maxWidth,
        _hor ?
            LayoutAlignment.VERTICAL_ALIGNMENT :
            LayoutAlignment.HORIZONTAL_ALIGNMENT);

    var position = paddingStart;
    var itemSpace, itemWidth, itemHeight;
    var dimensions;
    // calculate item position (x/y coordinates)
    for(var i = 0; i < items.length; i++)
    {
        var item = items[i];

        dimensions = itemDimensions(item);
        itemWidth = dimensions[0];
        itemHeight = dimensions[1];

        // move item to position calculated in previous loop
        if (_hor) {
            item.x = Math.floor(position);
            // set height of highest item
            height = Math.max(itemHeight, height);
        } else {
            item.y = Math.floor(position);
            // set width of widest item
            width = Math.max(itemWidth, width);
        }
        itemSpace = _hor ? itemWidth : itemHeight;
        // calculate position for next item
        position += itemSpace + this._currentGap(i, items);

        // if the item has a layout and children, layout the children
        if (this.layoutChildren && item.children &&
            item.layout && item.layout.layout) {
            item.layout.layout(item.children, itemWidth, itemHeight);
        }
    }
    if (_hor) {
        width = position;
    } else {
        height = position;
    }
    this._needUpdate = false;

    return [width, height];
};

/**
 * The space between the first and second element
 *
 * @property firstGap
 * @type String
 */
Object.defineProperty(LayoutAlignment.prototype, 'firstGap', {
    set: function(value) {
        if (value === this._firstGap) {
            return;
        }
        this._firstGap = value;
        this._needUpdate = true;
    },
    get: function() {
        return this._firstGap;
    }
});

/**
 * The space between the last and second-to-last element
 *
 * @property firstGap
 * @type String
 */
Object.defineProperty(LayoutAlignment.prototype, 'lastGap', {
    set: function(value) {
        if (value === this._lastGap) {
            return;
        }
        this._lastGap = value;
        this._needUpdate = true;
    },
    get: function() {
        return this._lastGap;
    }
});

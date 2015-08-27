var Layout = require('./Layout');

/**
 * basic layout
 *
 * @class LayoutAlignment
 * @extends GOWN.Layout
 * @memberof GOWN
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
 * percentages have higher priorities than fixed with.
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
        itemPercent = _hor ? item.percentWidth : item.percentHeight;
        itemSpace = _hor ? item.width : item.height;

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

    remaining -= totalExplicit;
    var percentToPixels = remaining / totalPercent;
    // claculate width/height for each item based on remaining width/height
    for(i = 0; i < itemCount; i++) {
        item = items[i];
        itemPercent = _hor ? item.percentWidth : item.percentHeight;
        if (itemPercent > 0) {
            if (_hor) {
                item.width = percentToPixels * itemPercent;
            } else {
                item.height = percentToPixels * itemPercent;
            }
        }
    }
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
 * Position (and possibly resizes) the supplied items.
 *
 * @method layout
 * @param items items that will be layouted {Array}
 * @param viewPortBounds {ViewPortBounds}
 */
LayoutAlignment.prototype.layout = function(items, viewPortBounds) {
    var _hor = (this.alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT);

    // get max. dimensions from viewport bounds
    var explicitWidth = viewPortBounds ? viewPortBounds.explicitWidth : NaN;
    var explicitHeight = viewPortBounds ? viewPortBounds.explicitHeight : NaN;

    var explicitSpace = _hor ? explicitWidth : explicitHeight;
    var paddingStart = _hor ? this._paddingLeft : this._paddingTop;

    // recalculate width/height
    this.applyPercent(items, explicitSpace);

    var position = paddingStart;

    // calculate item position (x/y coordinates)
    for(var i = 0; i < items.length; i++)
    {
        var item = items[i];

        // move item to position calculated in previous loop
        if (_hor) {
            item.x = Math.floor(position);
        } else {
            item.y = Math.floor(position);
        }
        var itemSpace = _hor ? item.width : item.height;
        // calculate position for next item
        position += itemSpace + this._currentGap(i, items);
    }
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
var Layout = require('./Layout');
var itemDimensions = require('./utils/itemDimensions');

/**
 * A layout for tiled rows/columns
 *
 * @class TiledLayout
 * @extends GOWN.layout.Layout
 * @memberof GOWN.layout
 * @constructor
 */
function TiledLayout() {
    Layout.call(this);

    /**
     * Use square tiles
     *
     * @private
     * @type bool
     * @default false
     */
    this._useSquareTiles = false;

    /**
     * The size of the horizontal gap between tiles
     *
     * @private
     * @type Number
     * @default 0
     */
    this._horizontalGap = 0;

    /**
     * The size of the vertical gap between tiles
     *
     * @private
     * @type Number
     * @default 0
     */
    this._verticalGap = 0;

    /**
     * Horizontal alignment of the tiles
     *
     * @private
     * @type String
     * @default TiledLayout.TILE_HORIZONTAL_ALIGN_CENTER
     */
    this._tileHorizontalAlign = TiledLayout.TILE_HORIZONTAL_ALIGN_CENTER;

    /**
     * Vertical alignment of the tiles
     *
     * @private
     * @type String
     * @default TiledLayout.TILE_VERTICAL_ALIGN_MIDDLE
     */
    this._tileVerticalAlign = TiledLayout.TILE_VERTICAL_ALIGN_MIDDLE;

    /**
     * Paging mode
     *
     * @private
     * @type String
     * @default TiledLayout.TiledLayout.PAGING_NONE
     */
    this._paging = TiledLayout.PAGING_NONE;

    /**
     * Orientation mode
     *
     * @private
     * @type String
     * @default TiledLayout.ORIENTATION_ROWS
     */
    this._orientation = TiledLayout.ORIENTATION_ROWS;

    /**
     * Invalidate the layout so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this._needUpdate = true;
}

TiledLayout.prototype = Object.create( Layout.prototype );
TiledLayout.prototype.constructor = TiledLayout;
module.exports = TiledLayout;

/**
 * Orientation by rows
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.ORIENTATION_ROWS = 'rows';

/**
 * Orientation by columns
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.ORIENTATION_COLUMNS = 'columns';

/**
 * If an item height is smaller than the height of a tile, the item will
 * be aligned to the top edge of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_VERTICAL_ALIGN_TOP = 'top';

/**
 * If an item height is smaller than the height of a tile, the item will
 * be aligned to the middle of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_VERTICAL_ALIGN_MIDDLE = 'middle';

/**
 * If an item height is smaller than the height of a tile, the item will
 * be aligned to the bottom edge of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_VERTICAL_ALIGN_BOTTOM = 'bottom';

/**
 * The item will be resized to fit the height of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_VERTICAL_ALIGN_JUSTIFY = 'justify';

/**
 * If an item width is smaller than the width of a tile, the item will
 * be aligned to the left edge of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_LEFT = 'left';

/**
 * If an item width is smaller than the width of a tile, the item will
 * be aligned to the center of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_CENTER = 'center';

/**
 * If an item width is smaller than the width of a tile, the item will
 * be aligned to the right edge of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_RIGHT = 'right';

/**
 * The item will be resized to fit the width of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_JUSTIFY = 'justify';

/**
 * The items will be positioned in pages horizontally from left to right.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.PAGING_HORIZONTAL = 'horizontal';

/**
 * The items will be positioned in pages vertically from top to bottom.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.PAGING_VERTICAL = 'vertical';

/**
 * The items will not be positioned in pages.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.PAGING_NONE = 'none';

/**
 * Calculate the layout for a container (and its children)
 *
 * @param container The container to calculate the layout for
 * @return Number[] The width and height
 */
TiledLayout.prototype.layoutContainer = function(container) {
    var dimensions = itemDimensions(container);
    return this.layout(container.children, dimensions[0], dimensions[1]);
};

/**
 * Position (and possibly resize) the supplied items.
 *
 * @param items The items that will be layouted {Array}
 * @param maxWidth The maximum width for the items {Number}
 * @param maxHeight The maximum height for the items {Number}
 * @return Number[] The width and height
 */
TiledLayout.prototype.layout = function (items, maxWidth, maxHeight) {
    var _rows = this._orientation === TiledLayout.ORIENTATION_ROWS;
    if(items.length === 0) {
        return [0, 0];
    }

    maxWidth = maxWidth || NaN;
    maxHeight = maxHeight || NaN;

    // width/height the current layout takes
    var width = 0;
    var height = 0;

    var i, item;
    var tileWidth = 0;
    var tileHeight = 0;

    var dimensions;
    // get size for tiles by saving the highest/widest tile.
    for(i = 0; i < items.length; i++) {
        item = items[i];
        if(!item) {
            continue;
        }

        dimensions = itemDimensions(item);
        tileWidth = Math.max(tileWidth, dimensions[0]);
        tileHeight = Math.max(tileHeight, dimensions[1]);
    }

    // make tiles square
    if (this._useSquareTiles) {
        if (tileWidth > tileHeight) {
            tileHeight = tileWidth;
        } else if (tileHeight > tileWidth) {
            tileWidth = tileHeight;
        }
    }

    // calculate tiles needed (and their width/height)
    var availableWidth = NaN;
    var availableHeight = NaN;

    var horizontalTileCount = _rows ? items.length : 1;

    if(!isNaN(maxWidth)) {
        availableWidth = maxWidth;
        horizontalTileCount = (maxWidth -
            this._paddingLeft - this._paddingRight +
            this._horizontalGap) / (tileWidth + this._horizontalGap);
    }
    horizontalTileCount = Math.floor(Math.max(horizontalTileCount, 1));

    var verticalTileCount = _rows ? 1 : items.length;
    if(!isNaN(maxHeight)) {
        availableHeight = maxHeight;
        verticalTileCount = (maxHeight -
            this._paddingTop - this._paddingBottom +
            this._verticalGap) / (tileHeight + this._verticalGap);
    }
    verticalTileCount = Math.floor(Math.max(verticalTileCount, 1));

    var startX = this._paddingLeft;
    var startY = this._paddingTop;

    var perPage = horizontalTileCount * verticalTileCount;
    var pageIndex = 0;
    var nextPageStartIndex = perPage;
    var pageStart = _rows ? startX : startY;
    var positionX = startX;
    var positionY = startY;
    var itemIndex = 0;
    for (i = 0; i < items.length; i++) {
        item = items[i];
        if (_rows) {
            if(itemIndex !== 0 && itemIndex % horizontalTileCount === 0)
            {
                positionX = pageStart;
                positionY += tileHeight + this._verticalGap;
            }
        } else { // columns
            if(itemIndex !== 0 && i % verticalTileCount === 0)
            {
                positionX += tileWidth + this._horizontalGap;
                positionY = pageStart;
            }
        }
        if(itemIndex === nextPageStartIndex) {
            pageIndex++;
            nextPageStartIndex += perPage;

            //we can use availableWidth and availableHeight here without
            //checking if they're NaN because we will never reach a
            //new page without them already being calculated.
            if (_rows) {
                if(this._paging === TiledLayout.PAGING_HORIZONTAL)
                {
                    positionX = pageStart === startX + availableWidth * pageIndex;
                    positionY = startY;
                } else if(this._paging === TiledLayout.PAGING_VERTICAL) {
                    positionY = startY + availableHeight * pageIndex;
                }
            } else { // columns
                if(this._paging === TiledLayout.PAGING_HORIZONTAL) {
                    positionX = startX + availableWidth * pageIndex;
                } else if(this._paging === TiledLayout.PAGING_VERTICAL) {
                    positionX = startX;
                    positionY = pageStart = startY + availableHeight * pageIndex;
                }
            }
        }
        if(item) {
            switch(this._tileHorizontalAlign) {
                case TiledLayout.TILE_HORIZONTAL_ALIGN_JUSTIFY:
                    item.x = positionX;
                    item.width = tileWidth;
                    break;
                case TiledLayout.TILE_HORIZONTAL_ALIGN_LEFT:
                    item.x = positionX;
                    break;
                case TiledLayout.TILE_HORIZONTAL_ALIGN_RIGHT:
                    item.x = positionX + tileWidth - item.width;
                    break;
                default: //center or unknown
                    item.x = positionX + (tileWidth - item.width) / 2;
            }
            switch(this._tileVerticalAlign) {
                case TiledLayout.TILE_VERTICAL_ALIGN_JUSTIFY:
                    item.y = positionY;
                    item.height = tileHeight;
                    break;
                case TiledLayout.TILE_VERTICAL_ALIGN_TOP:
                    item.y = positionY;
                    break;
                case TiledLayout.TILE_VERTICAL_ALIGN_BOTTOM:
                    item.y = positionY + tileHeight - item.height;
                    break;
                default: //middle or unknown
                    item.y = positionY + (tileHeight - item.height) / 2;
            }

            // if the item has a layout and children, layout the children
            if (this.layoutChildren && item.children &&
                item.layout && item.layout.layout) {
                dimensions = itemDimensions(item);
                item.layout.layout(item.children, dimensions[0], dimensions[1]);
            }
        }
        if (_rows) {
            positionX += tileWidth + this._horizontalGap;
        } else { // columns
            positionY += tileHeight + this._verticalGap;
        }
        itemIndex++;
    }

    this._needUpdate = false;
    return [width, height];
};

/**
 * Use the same width and height for tiles (calculated by biggest square)
 *
 * @name GOWN.layout.TiledLayout#useSquareTiles
 * @type bool
 * @default false
 */
Object.defineProperty(TiledLayout.prototype, 'useSquareTiles', {
    set: function(useSquareTiles) {
        this._useSquareTiles = useSquareTiles;
        this._needUpdate = true;
    },
    get: function() {
        return this._useSquareTiles;
    }
});

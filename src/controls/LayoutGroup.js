var Control = require('../core/Control');

/**
 * The LayoutGroup allows you to add PIXI.js children that will be positioned
 *
 * @class LayoutGroup
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 * @param layout The layout for the layout group {GOWN.LayoutAlignment}
 * @param [maxWidth=Infinity] The maximum width of the layout group {Number}
 * @param [maxHeight=Infinity] The maximum height of the layout group {Number}
 */
function LayoutGroup(layout, maxWidth, maxHeight) {
    /**
     * The layout for the layout group
     *
     * @type GOWN.LayoutAlignment
     */
    this.layout = layout;

    /**
     * The percentage width of the positioned children
     *
     * @type Number
     */
    this.percentWidth = this.percentWidth ;

    /**
     * The percentage height of the positioned children
     *
     * @type Number
     */
    this.percentHeight = this.percentHeight;

    /**
     * The maximum width of the layout group
     *
     * @type Number
     * @default Infinity
     */
    this.maxWidth = maxWidth || Infinity;

    /**
     * The maximum height of the layout group
     *
     * @type Number
     * @default Infinity
     */
    this.maxHeight = maxHeight || Infinity;

    Control.call(this);

    /**
     * Indicates if the layout group has changed
     *
     * @private
     * @type bool
     * @default true
     */
    this._needUpdate = true;

    /**
     * The layout group is resizable
     *
     * @private
     * @type bool
     * @default true
     */
    this.resizable = true;

    this.on('resize', this.onResize, this);
}

LayoutGroup.prototype = Object.create( Control.prototype );
LayoutGroup.prototype.constructor = LayoutGroup;
module.exports = LayoutGroup;

/**
 * Update before draw call (position label)
 * (called from Control.prototype.updateTransform every frame)
 *
 * @protected
 */
LayoutGroup.prototype.redraw = function() {
    var dimensionChanged = false;
    if (this._width && this.maxWidth !== this._width) {
        this._width = Math.min(this._width, this.maxWidth);
        dimensionChanged = true;
    }
    if (this._height && this.maxHeight !== this._height) {
        this._height = Math.min(this._height, this.maxHeight);
        dimensionChanged = true;
    }
    if (this.layout &&
        (this._needUpdate || dimensionChanged || this.layout.needUpdate)) {
        this.layout.layoutContainer(this);
        this._needUpdate = false;
    }
};

/**
 * onResize callback
 *
 * @protected
 */
LayoutGroup.prototype.onResize = function() {
    this._needUpdate = true;
};

/* istanbul ignore next */

/**
 * Adds one or more children to the container.
 *
 * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
 *
 * @param {...PIXI.DisplayObject} child - The DisplayObject(s) to add to the container
 * @return {PIXI.DisplayObject} The first child that was added.
 */
LayoutGroup.prototype.addChild = function(child) {
    var re = Control.prototype.addChild.call(this, child);
    this._needUpdate = true;
    return re;
};

/* istanbul ignore next */

/**
 * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
 *
 * @param {PIXI.DisplayObject} child - The child to add
 * @param {number} index - The index to place the child in
 * @return {PIXI.DisplayObject} The child that was added.
 */
LayoutGroup.prototype.addChildAt = function(child, pos) {
    var re = Control.prototype.addChildAt.call(this, child, pos);
    this._needUpdate = true;
    return re;
};

/**
 * Add some space between children
 *
 * @param space Space between children {Number}
 */
LayoutGroup.prototype.addSpacer = function(space) {
    var spacer = new Control();
    spacer.width = spacer.height = space;
    this.addChild(spacer);
};

/**
 * Indicates if the given child is inside the viewport (only used for scrolling)
 *
 * @param child One child with set coordinates and dimensions {PIXI.DisplayObject}
 * @param x X-position on the scroll-container {Number}
 * @param y Y-position on the scroll-container {Number}
 * @param width Width of the viewport {Number}
 * @param height Height of the viewport {Number}
 * @returns {boolean}
 */
LayoutGroup.prototype.childIsRenderAble = function(child, x, y, width, height) {
    return child.x < width + x &&
        child.y < height + y &&
        child.x > x - child.width &&
        child.y > y - child.height;
};

/**
 * Update renderable (culling of non visible objects)
 *
 * @param x X-position on the scroll-container {Number}
 * @param y Y-position on the scroll-container {Number}
 * @param width width of the viewport {Number}
 * @param height height of the viewport {Number}
 */
LayoutGroup.prototype.updateRenderable = function(x, y, width, height) {
    for(var i=0, j=this.children.length; i<j; i++) {
        var child = this.children[i];
        child.renderable = this.childIsRenderAble(child, x, y, width, height);
    }
};

/**
 * The width of the group, will get the position and the width of the right child.
 *
 * @name GOWN.LayoutGroup#width
 * @type Number
 */
Object.defineProperty(LayoutGroup.prototype, 'width', {
    set: function(width) {
        this._width = width;
    },
    get: function() {
        if (this._width > 0) {
            return this._width;
        }
        var width = 0;
        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.getChildAt(i);
                width = Math.max(width, child.x+child.width);
            }
        }
        return width;
    }
});

/**
 * The height of the group, will get the position and the height of the bottom child.
 *
 * @name GOWN.LayoutGroup#height
 * @type Number
 */
Object.defineProperty(LayoutGroup.prototype, 'height', {
    set: function(height) {
        this._height = height;
    },
    get: function() {
        if (this._height > 0) {
            return this._height;
        }
        var height = 0;
        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.getChildAt(i);
                height = Math.max(height, child.y+child.height);
            }
        }
        return height;
    }
});

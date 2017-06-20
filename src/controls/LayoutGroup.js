var Control = require('../core/Control');

/**
 * The LayoutGroup allows you to add PIXI.js children that will be positioned
 *
 * @class LayoutGroup
 * @extends GOWN.Layout
 * @memberof GOWN
 * @constructor
 */
function LayoutGroup(layout, maxWidth, maxHeight) {
    this.layout = layout;
    this.percentWidth = this.percentWidth ;
    this.percentHeight = this.percentHeight;
    this.maxWidth = maxWidth || Infinity;
    this.maxHeight = maxHeight || Infinity;
    Control.call(this);
    this._needUpdate = true;
    this.resizable = true;
    this.on('resize', this.onResize, this);
}

LayoutGroup.prototype = Object.create( Control.prototype );
LayoutGroup.prototype.constructor = LayoutGroup;
module.exports = LayoutGroup;

/**
 * update before draw call (position label)
 *
 * (called from Control.prototype.updateTransform every frame)
 *

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

LayoutGroup.prototype.onResize = function() {
    this._needUpdate = true;
};

/* istanbul ignore next */
LayoutGroup.prototype.addChild = function(child) {
    var re = Control.prototype.addChild.call(this, child);
    this._needUpdate = true;
    return re;
};

/* istanbul ignore next */
LayoutGroup.prototype.addChildAt = function(child, pos) {
    var re = Control.prototype.addChildAt.call(this, child, pos);
    this._needUpdate = true;
    return re;
};

/**
 * add some space between children
 *
 * @param space {Number}
 */
LayoutGroup.prototype.addSpacer = function(space) {
    var spacer = new Control();
    spacer.width = spacer.height = space;
    this.addChild(spacer);
};

/**
 * Indicates if the given child is inside the viewport (only used for scrolling)
 *

 * @type boolean
 * @param child one child with set coordinates and dimensions
 * @param x X-position on the scroll-container
 * @param y Y-position on the scroll-container
 * @param width width of the viewport
 * @param height height of the viewport
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

 * @param x X-position on the scroll-container
 * @param y Y-position on the scroll-container
 * @param width width of the viewport
 * @param height height of the viewport
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
 * @property width
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
 * @property width
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

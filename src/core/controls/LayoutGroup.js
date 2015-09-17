var Control = require('../Control'),
    ViewPortBounds = require('../layout/ViewPortBounds');

/**
 * The LayoutGroup allows you to add PIXI.js children that will be positioned
 *
 * @class LayoutGroup
 * @extends GOWN.Layout
 * @memberof GOWN
 * @constructor
 */
function LayoutGroup() {
    this.percentWidth = this.percentWidth || null;
    this.percentHeight = this.percentHeight || null;
    Control.call(this);
    this._viewPortBounds = new ViewPortBounds();
    this._needUpdate = true;
}

LayoutGroup.prototype = Object.create( Control.prototype );
LayoutGroup.prototype.constructor = LayoutGroup;
module.exports = LayoutGroup;

/**
 * update before draw call (position label)
 *
 * @method redraw
 */
LayoutGroup.prototype.redraw = function() {
    var dimensionChanged = false;
    if (this._width && this._viewPortBounds.explicitWidth !== this._width) {
        // width set - change viewport boundaries
        this._viewPortBounds.explicitWidth = this._width;
        dimensionChanged = true;
    }
    if (this._height && this._viewPortBounds.explicitHeight !== this._height) {
        // height set - change viewport boundaries
        this._viewPortBounds.explicitHeight = this._height;
        dimensionChanged = true;
    }
    if (this.layout &&
        (this._needUpdate || dimensionChanged || this.layout.needUpdate)) {
        this.layout.layout(this.children, this._viewPortBounds);
        this._needUpdate = false;
        this.layout._needUpdate = false;
    }
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
 * @method childIsRenderAble
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
 * @method updateRenderable
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

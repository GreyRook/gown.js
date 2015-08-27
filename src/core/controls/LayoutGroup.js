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
 * only render specific area
 * @method renderAreaWebGL
 * @param renderSession
 * @param x
 * @param y
 * @param width
 * @param height
 * @returns {boolean}
 */
/* istanbul ignore next */
LayoutGroup.prototype.renderAreaWebGL = function(renderer, x, y, width, height) {
    this.redraw();

    // if the object is not visible or the alpha is 0 then no need to render this element
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable)
    {
        return;
    }

    var i, j, child;

    // do a quick check to see if this element has a mask or a filter.
    if(this._mask || this._filters)
    {
        renderer.currentRenderer.flush();

        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if (this._filters)
        {
            renderer.filterManager.pushFilter(this, this._filters);
        }

        if (this._mask)
        {
            renderer.maskManager.pushMask(this, this._mask);
        }

        renderer.currentRenderer.start();

        // add this object to the batch, only rendered if it has a texture.
        this._renderWebGL(renderer);

        // simple render children!
        for(i=0, j=this.children.length; i<j; i++)
        {
            // only render children if they are visible
            child = this.children[i];
            if (this.childIsRenderAble(child, x, y, width, height)) {
                child.renderWebGL(renderer);
            }
        }

        renderer.currentRenderer.flush();

        if (this._mask)
        {
            renderer.maskManager.popMask(this, this._mask);
        }

        if (this._filters)
        {
            renderer.filterManager.popFilter();
        }
        renderer.currentRenderer.start();
    }
    else
    {
        this._renderWebGL(renderer);

        // simple render children!
        for(i=0, j=this.children.length; i<j; i++)
        {
            // only render children if they are visible
            child = this.children[i];
            if (this.childIsRenderAble(child, x, y, width, height)) {
                child.renderWebGL(renderer);
            }
        }
    }
};

/**
 * only render specific area
 * @method renderAreaWebCanvas
 * @param renderSession
 * @param x
 * @param y
 * @param width
 * @param height
 * @returns {boolean}
 */
/* istanbul ignore next */
LayoutGroup.prototype.renderAreaCanvas = function(renderer, x, y, width, height) {
    this.redraw();

    // if not visible or the alpha is 0 then no need to render this
    if (!this.visible || this.alpha <= 0 || !this.renderable)
    {
        return;
    }

    if (this._mask)
    {
        renderer.maskManager.pushMask(this._mask, renderer);
    }

    this._renderCanvas(renderer);
    for (var i = 0, j = this.children.length; i < j; ++i)
    {
        // only render children if they are visible
        var child = this.children[i];
        if (this.childIsRenderAble(child, x, y, width, height)) {
            child._renderCanvas(renderer);
        }
    }

    if (this._mask)
    {
        renderer.maskManager.popMask(renderer);
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
/**
 * @author Andreas Bresser
 */

/**
 * The LayoutGroup allows you to add PIXI.js children that will be positioned
 *
 * @class LayoutGroup
 * @constructor
 */
PIXI_UI.LayoutGroup = function() {
    this.percentWidth = this.percentWidth || null;
    this.percentHeight = this.percentHeight || null;
    PIXI_UI.Control.call(this);
    this._viewPortBounds = new PIXI_UI.ViewPortBounds();
    this._needUpdate = true;
};

PIXI_UI.LayoutGroup.prototype = Object.create( PIXI_UI.Control.prototype );
PIXI_UI.LayoutGroup.prototype.constructor = PIXI_UI.LayoutGroup;

/**
 * update before draw call (position label)
 *
 * @method redraw
 */
PIXI_UI.LayoutGroup.prototype.redraw = function() {
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
PIXI_UI.LayoutGroup.prototype.addChild = function(child) {
    var re = PIXI_UI.Control.prototype.addChild.call(this, child);
    this._needUpdate = true;
    return re;
};

/* istanbul ignore next */
PIXI_UI.LayoutGroup.prototype.addChildAt = function(child, pos) {
    var re = PIXI_UI.Control.prototype.addChildAt.call(this, child, pos);
    this._needUpdate = true;
    return re;
};

/**
 * add some space between children
 *
 * @param space {Number}
 */
PIXI_UI.LayoutGroup.prototype.addSpacer = function(space) {
    var spacer = new PIXI_UI.Control();
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
PIXI_UI.LayoutGroup.prototype.childIsRenderAble = function(child, x, y, width, height) {
    return child.x < width + x &&
        child.y < height + y &&
        child.x > x - child.width &&
        child.y > y - child.height;
};

/**
 * only render specific area
 * @param renderSession
 * @param x
 * @param y
 * @param width
 * @param height
 * @returns {boolean}
 */
/* istanbul ignore next */
PIXI_UI.LayoutGroup.prototype._renderAreaWebGL = function(renderSession, x, y, width, height) {
    this.redraw();

    if(!this.visible || this.alpha <= 0)return;

    if(this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }

    var i, j,child;

    if(this._mask || this._filters)
    {

        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if(this._filters)
        {
            renderSession.spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        if(this._mask)
        {
            renderSession.spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            renderSession.spriteBatch.start();
        }

        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            child = this.children[i];
            if (this.childIsRenderAble(child, x, y, width, height)) {
                child._renderWebGL(renderSession);
            }
        }

        renderSession.spriteBatch.stop();

        if(this._mask)renderSession.maskManager.popMask(this._mask, renderSession);
        if(this._filters)renderSession.filterManager.popFilter();

        renderSession.spriteBatch.start();
    }
    else
    {
        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            child = this.children[i];
            if (this.childIsRenderAble(child, x, y, width, height)) {
                child._renderWebGL(renderSession);
            }
        }
    }
};

/* istanbul ignore next */
PIXI_UI.LayoutGroup.prototype._renderAreaCanvas = function(renderSession, x, y, width, height) {
    this.redraw();
    if(this.visible === false || this.alpha === 0)return;

    if(this._cacheAsBitmap)
    {

        this._renderCachedSprite(renderSession);
        return;
    }

    if(this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession);
    }

    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        if (this.childIsRenderAble(child, x, y, width, height)) {
            child._renderCanvas(renderSession);
        }
    }

    if(this._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }
};

/**
 * The width of the group, will get the position and the width of the right child.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI_UI.LayoutGroup.prototype, 'width', {
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
Object.defineProperty(PIXI_UI.LayoutGroup.prototype, 'height', {
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
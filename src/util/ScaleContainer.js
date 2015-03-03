/**
 * @author Andreas Bresser
 */
/**
 * Scale 9 Container.
 * e.g. useful for scalable buttons.
 *
 * @class ScaleContainer
 * @constructor
 */

PIXI_UI.ScaleContainer = function(texture, rect) {
    PIXI.DisplayObjectContainer.call( this );

    this.rect = rect;
    this.baseTexture = texture.baseTexture;
    this.frame = texture.frame;

    this._width = this.frame.width;
    this._height = this.frame.height;
    
    // left / middle / right width
    var lw = rect.x;
    var mw = rect.width;
    var rw = this.frame.width - (mw + lw);

    // top / center / bottom height
    var th = rect.y;
    var ch = rect.height;
    var bh = this.frame.height - (ch + th);

    // top
    this.tl = this._getTexture(0, 0, lw, th);
    this.tm = this._getTexture(lw, 0, mw, th);
    this.tr = this._getTexture(lw+mw, 0, rw, th);

    // center
    this.cl = this._getTexture(0, th, lw, ch);
    this.cm = this._getTexture(lw, th, mw, ch);
    this.cr = this._getTexture(lw+mw, th, rw, ch);

    // bottom
    this.bl = this._getTexture(0, th+ch, lw, bh);
    this.bm = this._getTexture(lw, th+ch, mw, bh);
    this.br = this._getTexture(lw+mw, th+ch, rw, bh);

    this.cl.y = this.cm.y = this.cr.y = th;
    this.tm.x = this.cm.x = this.bm.x = lw;

    this.addChild(this.tl);
    this.addChild(this.tm);
    this.addChild(this.tr);

    this.addChild(this.cl);
    this.addChild(this.cm);
    this.addChild(this.cr);

    this.addChild(this.bl);
    this.addChild(this.bm);
    this.addChild(this.br);
};

// constructor
PIXI_UI.ScaleContainer.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI_UI.ScaleContainer.prototype.constructor = PIXI_UI.ScaleContainer;

/**
 * create a new texture from a base-texture by given dimensions
 *
 * @method _getTexture
 * @private
 */
PIXI_UI.ScaleContainer.prototype._getTexture = function(x, y, w, h) {
    var frame = new PIXI.Rectangle(this.frame.x+x, this.frame.y+y, w, h);
    var t = new PIXI.Texture(this.baseTexture, frame, frame.clone(), null);
    return new PIXI.Sprite(t);
};

/**
 * The width of the container, setting this will redraw the component.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI_UI.ScaleContainer.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        if (this._width !== value) {
            this._width = value;
            this.invalid = true;
        }
    }
});

/**
 * The height of the container, setting this will redraw the component.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI_UI.ScaleContainer.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        if (this._height !== value) {
            this._height = value;
            this.invalid = true;
        }
    }
});

/**
 * update before draw call (reposition textures)
 *
 * @method redraw
 */
PIXI_UI.ScaleContainer.prototype.redraw = function() {
    if (this.invalid) {
        this._positionTilable();
        this.invalid = false;
    }
};

/**
 * recalculate the position of the tiles (every time width/height changes)
 *
 * @method _positionTilable
 * @private
 */
PIXI_UI.ScaleContainer.prototype._positionTilable = function() {
    // left / middle / right width
    var lw = this.rect.x;
    var mw = this.rect.width;
    var rw = this.frame.width - (mw + lw);

    // top / center / bottom height
    var th = this.rect.y;
    var ch = this.rect.height;
    var bh = this.frame.height - (ch + th);

    this.cr.x = this.br.x = this.tr.x = this._width - rw;
    this.cm.width = this.bm.width = this.tm.width = this._width - (lw + rw);

    this.cl.height = this.cm.height = this.cr.height = this._height - (th + bh);
    this.br.y = this.bm.y = this.bl.y = this._height - bh;
};

/**
 *
 * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
 * The frame ids are created when a Texture packer file has been loaded
 *
 * @method fromFrame
 * @static
 * @param frameId {String} The frame Id of the texture in the cache
 * @param rect {Rectangle} defines tilable area
 * @return {ScaleTexture} A new Scalable Texture (e.g. a button) using a texture from the texture cache matching the frameId
 */
PIXI_UI.ScaleContainer.fromFrame = function(frameId, rect) {
    var texture = PIXI.TextureCache[frameId];
    if(!texture) {
        throw new Error('The frameId "' + frameId + '" does not exist ' +
                        'in the texture cache');
    }
    return new PIXI_UI.ScaleContainer(texture, rect);
};

/**
 * Renders the object using the WebGL renderer
 *
 * @method _renderWebGL
 * @param renderSession {RenderSession}
 * @private
 */
/* istanbul ignore next */
PIXI_UI.ScaleContainer.prototype._renderWebGL = function(renderSession) {
    this.redraw();
    return PIXI.DisplayObjectContainer.prototype._renderWebGL.call(this, renderSession);
};

/**
 * Renders the object using the Canvas renderer
 *
 * @method _renderWebGL
 * @param renderSession {RenderSession}
 * @private
 */
/* istanbul ignore next */
PIXI_UI.ScaleContainer.prototype._renderCanvas = function(renderSession) {
    this.redraw();
    return PIXI.DisplayObjectContainer.prototype._renderCanvas.call(this, renderSession);
};
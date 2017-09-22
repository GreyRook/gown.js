/**
 * Scale 9 Container.
 * e.g. useful for scalable buttons.
 *
 * @class ScaleContainer
 * @extends PIXI.Container
 * @memberof GOWN
 * @constructor
 * @param texture The PIXI texture {PIXI.Texture}
 * @param rect The rectangle with position and dimensions of the center piece.
 * Will be used to calculate positions of all other pieces {PIXI.Rectangle}
 * @param [middleWidth] The alternative width to crop the center piece
 * (only needed if we want to scale the image smaller than the original) {Number}
 * @param [centerHeight] The alternative height to crop the center piece
 * (only needed if we want to scale the image smaller than the original) {Number}
 */
function ScaleContainer(texture, rect, middleWidth, centerHeight) {
    PIXI.Container.call( this );

    /**
     * The rectangle with position and dimensions of the center piece.
     * Will be used to calculate positions of all other pieces.
     *
     * @type PIXI.Rectangle
     */
    this.rect = rect;

    /**
     * The base texture of the scale container
     *
     * @type PIXI.BaseTexture
     */
    this.baseTexture = texture.baseTexture;

    /**
     * The frame of the scale container
     *
     * @type PIXI.Rectangle
     */
    this.frame = texture.frame;

    /**
     * The width of the scale container
     *
     * @private
     * @type Number
     */
    this._width = this.frame.width;

    /**
     * The height of the scale container
     *
     * @private
     * @type Number
     */
    this._height = this.frame.height;

    // left / middle / right width
    var lw = rect.x;
    var mw = rect.width;
    var rw = this.frame.width - (mw + lw);

    // top / center / bottom height
    var th = rect.y;
    var ch = rect.height;
    var bh = this.frame.height - (ch + th);

    middleWidth = middleWidth || mw;
    centerHeight = centerHeight || ch;

    /**
     * Calculated min. width based on tile sizes in pixel without scaling
     *
     * @type Number
     */
    this.minWidth = lw + rw;

    /**
     * Calculated min. height based on tile sizes in pixel without scaling
     *
     * @type Number
     */
    this.minHeight = th + bh;

    if (lw > 0 && th > 0) {
        /**
         * The top left sprite
         *
         * @type {PIXI.Sprite}
         */
        this.tl = this._getTexture(0, 0, lw, th);
        this.addChild(this.tl);
    }

    if (mw > 0 && th > 0) {
        /**
         * The top middle sprite
         *
         * @type {PIXI.Sprite}
         */
        this.tm = this._getTexture(lw, 0, middleWidth, th);
        this.addChild(this.tm);
        this.tm.x = lw;
    }

    if (rw > 0 && th > 0) {
        /**
         * The top right sprite
         *
         * @type {PIXI.Sprite}
         */
        this.tr = this._getTexture(lw + mw, 0, rw, th);
        this.addChild(this.tr);
    }

    if (lw > 0 && ch > 0) {
        /**
         * The center left sprite
         *
         * @type {PIXI.Sprite}
         */
        this.cl = this._getTexture(0, th, lw, centerHeight);
        this.addChild(this.cl);
        this.cl.y = th;
    }

    if (mw > 0 && ch > 0) {
        /**
         * The center middle sprite
         *
         * @type {PIXI.Sprite}
         */
        this.cm = this._getTexture(lw, th, middleWidth, centerHeight);
        this.addChild(this.cm);
        this.cm.y = th;
        this.cm.x = lw;
    }

    if (rw > 0 && ch > 0) {
        /**
         * The center right sprite
         *
         * @type {PIXI.Sprite}
         */
        this.cr = this._getTexture(lw + mw, th, rw, centerHeight);
        this.addChild(this.cr);
        this.cr.y = th;
    }

    if (lw > 0 && bh > 0) {
        /**
         * The bottom left sprite
         *
         * @type {PIXI.Sprite}
         */
        this.bl = this._getTexture(0, th + ch, lw, bh);
        this.addChild(this.bl);
    }

    if (mw > 0 && bh > 0) {
        /**
         * The bottom middle sprite
         *
         * @type {PIXI.Sprite}
         */
        this.bm = this._getTexture(lw, th + ch, middleWidth, bh);
        this.addChild(this.bm);
        this.bm.x = lw;
    }

    if (rw > 0 && bh > 0) {
        /**
         * The bottom right sprite
         *
         * @type {PIXI.Sprite}
         */
        this.br = this._getTexture(lw + mw, th + ch, rw, bh);
        this.addChild(this.br);
    }
}

ScaleContainer.prototype = Object.create( PIXI.Container.prototype );
ScaleContainer.prototype.constructor = ScaleContainer;
module.exports = ScaleContainer;

/**
 * Set the scaling width and height
 *
 * @private
 */
ScaleContainer.prototype._updateScales = function() {
    this._positionTilable();

    var scaleOriginals = this.scaleOriginals = {};

    var scaleOriginal = function(name, elem) {
        if (elem && elem.width && elem.height) {
            scaleOriginals[name] = {
                width: elem.width,
                height: elem.height
            };
        }
    };

    scaleOriginal('tl', this.tl);
    scaleOriginal('tm', this.tm);
    scaleOriginal('tr', this.tr);

    scaleOriginal('cl', this.cl);
    scaleOriginal('cm', this.cm);
    scaleOriginal('cr', this.cr);

    scaleOriginal('bl', this.bl);
    scaleOriginal('bm', this.bm);
    scaleOriginal('br', this.br);
};

/**
 * Create a new texture from a base-texture by a given dimensions
 *
 * @param x The x-position {Number}
 * @param y The y-position {Number}
 * @param w The width {Number}
 * @param h The height {Number}
 * @return {PIXI.Sprite} The sprite with the created texture
 * @private
 */
ScaleContainer.prototype._getTexture = function(x, y, w, h) {
    var frame = new PIXI.Rectangle(this.frame.x+x, this.frame.y+y, w, h);
    var t = new PIXI.Texture(this.baseTexture, frame, frame.clone(), null);
    return new PIXI.Sprite(t);
};

/**
 * The width of the container. Setting this will redraw the component.
 *
 * @name GOWN.ScaleContainer#width
 * @type Number
 */
Object.defineProperty(ScaleContainer.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        if (this._width !== value) {
            if (this.minWidth && this.minWidth > 0 &&
                value < this.minWidth) {
                value = this.minWidth;
            }
            this._width = value;
            this.invalid = true;
            this._updateScales();
        }
    }
});

/**
 * The height of the container. Setting this will redraw the component.
 *
 * @name GOWN.ScaleContainer#height
 * @type Number
 */
Object.defineProperty(ScaleContainer.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        if (this._height !== value) {
            if (this.minHeight && this.minHeight > 0 &&
                value < this.minHeight) {
                value = this.minHeight;
            }
            this._height = value;
            this.invalid = true;
            this._updateScales();
        }
    }
});

/**
 * Update before draw call (reposition textures)
 *
 * @private
 */
ScaleContainer.prototype.redraw = function() {
    if (this.invalid) {
        this._positionTilable();
        this.invalid = false;
    }
};

/**
 * Recalculate the position of the tiles (every time the width/height changes)
 *
 * @private
 */
ScaleContainer.prototype._positionTilable = function() {
    // left / middle / right width
    var lw = this.rect.x;
    var mw = this.rect.width;
    var rw = this.frame.width - (mw + lw);

    // top / center / bottom height
    var th = this.rect.y;
    var ch = this.rect.height;
    var bh = this.frame.height - (ch + th);

    var rightX = this._width - rw;
    var bottomY = this._height - bh;
    if (this.cr) {
        this.cr.x = rightX;
    }
    if (this.br) {
        this.br.x = rightX;
        this.br.y = bottomY;
    }
    if (this.tr) {
        this.tr.x = rightX;
    }

    var middleWidth = this._width - (lw + rw);
    var centerHeight = this._height - (th + bh);
    if (this.cm) {
        this.cm.width = middleWidth;
        this.cm.height = centerHeight;
    }
    if (this.bm) {
        this.bm.width = middleWidth;
        this.bm.y = bottomY;
    }
    if (this.tm) {
        this.tm.width = middleWidth;
    }
    if (this.cl) {
        this.cl.height = centerHeight;
    }
    if (this.cr) {
        this.cr.height = centerHeight;
    }

    if (this.bl) {
        this.bl.y = bottomY;
    }
};

/**
 * Helper function that creates a sprite that will contain a texture from
 * the TextureCache based on the frameId.
 * The frame ids are created when a Texture packer file has been loaded
 *
 * @param frameId The frame id of the texture in the cache {String}
 * @param rect Defines the tilable area {Rectangle}
 * @return {GOWN.ScaleContainer} A new scalable container (e.g. a button)
 * using a texture from the texture cache matching the frameId
 */
ScaleContainer.fromFrame = function(frameId, rect) {
    var texture = PIXI.utils.TextureCache[frameId];
    if(!texture) {
        throw new Error('The frameId "' + frameId + '" does not exist ' +
                        'in the texture cache');
    }
    return new ScaleContainer(texture, rect);
};

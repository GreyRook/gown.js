/**
 * scroll bar or slider
 */

PIXI_UI.Scrollable = function(theme) {
    this.mode = this.mode || PIXI_UI.Scrollable.DESKTOP_MODE;

    PIXI_UI.Skinable.call(this, theme);

    this.orientation = this.orientation || PIXI_UI.Scrollable.HORIZONTAL;

    this.thumb = new PIXI_UI.ScrollThumb(this, theme);
    this.addChild(this.thumb);

    this.invalidTrack = true;
    this._inverse = false;
    this._start = null;

    // # of pixel you scroll at a time (if the event delta is 1 / -1)
    this.scrolldelta = 10;
};

PIXI_UI.Scrollable.prototype = Object.create( PIXI_UI.Skinable.prototype );
PIXI_UI.Scrollable.prototype.constructor = PIXI_UI.Scrollable;

PIXI_UI.Scrollable.DESKTOP_MODE = 'desktop';
PIXI_UI.Scrollable.MOBILE_MODE = 'mobile';

PIXI_UI.Scrollable.HORIZONTAL = 'horizontal';
PIXI_UI.Scrollable.VERTICAL = 'vertical';

PIXI_UI.Scrollable.prototype.handleDown = function(mouseData) {
    var local = mouseData.getLocalPosition(this);
    this._start = [local.x, local.y];
};

PIXI_UI.Scrollable.prototype.handleUp = function() {
    this._start = null;
};

/**
 * handle mouse move: move thumb
 * @param mouseData
 */
PIXI_UI.Scrollable.prototype.handleMove = function(mouseData) {
    if (this._start) {
        var local = mouseData.getLocalPosition(this);
        var x = this.thumb.x + local.x - this._start[0];
        var y = this.thumb.y + local.y - this._start[1];
        if (this.moveThumb(x, y)) {
            // do not override localX/localY in start
            // if we do not move the thumb
            this.thumbMoved(x, y);
            this._start[0] = local.x;
            this._start[1] = local.y;
        }
    }
};


PIXI_UI.Scrollable.prototype.handleWheel = function (event) {
    var x = this.thumb.x - event.delta * this.scrolldelta;
    var y = this.thumb.y - event.delta * this.scrolldelta;
    if (this.moveThumb(x, y)) {
        this.thumbMoved(x, y);
    }
};

/**
 * thumb has new x/y position
 * @param x x-position that has been scrolled to (ignored when vertical)
 * @param y y-position that has been scrolled to (ignored when horizontal)
 */
/* jshint unused: false */
PIXI_UI.Scrollable.prototype.thumbMoved = function(x, y) {
};

PIXI_UI.Scrollable.prototype._updateProgressSkin = function() {
    if (!this.progressSkin) {
        return;
    }
    if(this.orientation === PIXI_UI.Scrollable.HORIZONTAL) {
        if (this.inverse) {
            this.progressSkin.x = this.thumb.x + this.thumb.width / 2;
            this.progressSkin.width = this.width - this.thumb.x;
            this.progressSkin.height = this.skin.height;
        } else {
            this.progressSkin.width = this.thumb.x + this.thumb.width / 2;
            this.progressSkin.height = this.skin.height;
        }
    } else {
        if (this.inverse) {
            this.progressSkin.y = this.thumb.y + this.thumb.height / 2;
            this.progressSkin.height = this.height - this.thumb.y;
            this.progressSkin.width = this.skin.width;
        } else {
            this.progressSkin.height = this.thumb.y + this.thumb.height / 2;
            this.progressSkin.width = this.skin.width;
        }
    }
};

/**
 * move the thumb on the scroll bar within its bounds
 * @param x new calculated x position of the thumb
 * @param y new calculated y position of the thumb
 * @returns {boolean} returns true if the position of the thumb has been
 * moved
 */
PIXI_UI.Scrollable.prototype.moveThumb = function(x, y) {
    if(this.orientation === PIXI_UI.Scrollable.HORIZONTAL) {
        if (isNaN(x)) {
            return false;
        }
        x = Math.min(x, this.width - this.thumb.width);
        x = Math.max(x, 0);
        if (x !== this.thumb.x) {
            this.thumb.x = x;
            this._updateProgressSkin();
            return true;
        }
    } else {
        if (isNaN(y)) {
            return false;
        }
        y = Math.min(y, this.height - this.thumb.height);
        y = Math.max(y, 0);
        if (y !== this.thumb.y) {
            this.thumb.y = y;
            this._updateProgressSkin();
            return true;
        }
    }
    return false;
};

PIXI_UI.Scrollable.prototype.showTrack = function(skin) {
    if (this.skin !== skin) {
        if(this.skin) {
            this.removeChild(this.skin);
        }

        this.addChildAt(skin, 0);
        this.skin = skin;
        if (this.progressSkin) {
            this._updateProgressSkin();
        }
    }
};

PIXI_UI.Scrollable.prototype.showProgress = function(skin) {
    if (this.progressSkin !== skin) {
        if(this.progressSkin) {
            this.removeChild(this.progressSkin);
        }
        skin.width = skin.height = 0;
        this.addChildAt(skin, 0);
        this.progressSkin = skin;
        if (this.skin) {
            this._updateProgressSkin();
        }
    }
};

PIXI_UI.Scrollable.prototype.redraw = function() {
    if (this.invalidTrack && this.thumb) {
        this.fromSkin(this.orientation+'_progress', this.showProgress);
        this.fromSkin(this.orientation+'_track', this.showTrack);
        if (this.skin) {
            if (this.orientation === PIXI_UI.Scrollable.HORIZONTAL) {
                this.skin.width = this.width;
            } else {
                this.skin.height = this.height;
            }
            this.invalidTrack = false;
        }
    }
};


/**
 * The width of the Scrollable, setting this will redraw the track and thumb.
 * (set invalidDimensions)
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI_UI.Scrollable.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(width) {
        this._width = width;
        this.invalidTrack = true;
        if (this.thumb) {
            this.thumb.invalidTrack = true;
        }
    }
});

/**
 * Inverse the progress bar
 *
 * @property inverse
 * @type Boolean
 */
Object.defineProperty(PIXI_UI.Scrollable.prototype, 'inverse', {
    get: function() {
        return this._inverse;
    },
    set: function(inverse) {
        if (inverse !== this._inverse) {
            this._inverse = inverse;

            if (this.orientation === PIXI_UI.Scrollable.HORIZONTAL) {
                this.moveThumb(0, this.width - this.thumb.x);
            } else {
                this.moveThumb(0, this.height - this.thumb.y);
            }

            this.invalidTrack = true;
            if (this.thumb) {
                this.thumb.invalidTrack = true;
            }
        }
    }
});

/**
 * The height of the Scrollable, setting this will redraw the track and thumb.
 * (set invalidDimensions)
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI_UI.Scrollable.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(height) {
        this._height = height;
        this.invalidTrack = true;
        if (this.thumb) {
            this.thumb.invalidTrack = true;
        }
    }
});

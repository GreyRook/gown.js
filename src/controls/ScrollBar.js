/**
 * authors: Björn Friedrichs, Andreas Bresser
 */

PIXI_UI.ScrollBar = function(scrollArea, theme) {
    this.scrollArea = scrollArea;
    this.skinName = this.skinName || PIXI_UI.ScrollBar.SKIN_NAME;
    this.mode = PIXI_UI.ScrollBar.DESKTOP_MODE;

    if (this.orientation === undefined) {
        this.orientation = PIXI_UI.ScrollBar.HORIZONTAL;
        if (scrollArea && scrollArea.content &&
            scrollArea.content.layout.alignment ===
                PIXI_UI.LayoutAlignment.VERTICAL_ALIGNMENT) {
            this.orientation = PIXI_UI.ScrollBar.VERTICAL;
        }
    }

    PIXI_UI.Skinable.call(this, theme);

    this.thumb = new PIXI_UI.ScrollThumb(this.orientation, theme);
    this.thumb.width = 20;
    this.thumb.height = 20;
    this.addChild(this.thumb);

    var scope = this;
    var down = this.thumb.mousedown;
    this.thumb.touchstart = this.thumb.mousedown = function (mouseData) {
        scope.handleDown(mouseData);
        down(mouseData);
    };
    this.thumb.touchmove = this.thumb.mousemove = function (mouseData) {
        scope.handleMove(mouseData);
    };
    var up = this.thumb.mouseup;
    this.thumb.touchend = this.thumb.touchendoutside =
        /* jshint unused: false */
        this.thumb.mouseup = this.thumb.mouseupoutside = function (mouseData) {
        scope.handleUp();
        up();
    };
    /*
    this.on('mousewheel', this.handleWheel, this);
    */

    this.invalidTrack = true;
    this._start = null;

    // # of pixel you scroll at a time (if the event delta is 1 / -1)
    this.scrolldelta = 10;

    this.thumb.touchmove = this.thumb.mousemove;
};

PIXI_UI.ScrollBar.prototype = Object.create( PIXI_UI.Skinable.prototype );
PIXI_UI.ScrollBar.prototype.constructor = PIXI_UI.ScrollBar;

PIXI_UI.ScrollBar.SKIN_NAME = 'scroll_bar';

PIXI_UI.ScrollBar.DESKTOP_MODE = 'desktop';
PIXI_UI.ScrollBar.MOBILE_MODE = 'mobile';

PIXI_UI.ScrollBar.HORIZONTAL = 'horizontal';
PIXI_UI.ScrollBar.VERTICAL = 'vertical';

PIXI_UI.ScrollBar.prototype.handleMove = function(mouseData) {
    if (this._start) {
        var local = mouseData.getLocalPosition(this);
        var x = this.thumb.x + local.x - this._start[0];
        var y = this.thumb.y + local.y - this._start[1];
        if (this.moveThumb(x, y)) {
            // do not override localX/localY in start
            // if we do not move the thumb
            this.scrollContent(x, y);
            this._start[0] = local.x;
            this._start[1] = local.y;
        }
    }
};

PIXI_UI.ScrollBar.prototype.handleDown = function(mouseData) {
    var local = mouseData.getLocalPosition(this);
    this._start = [local.x, local.y];
};
PIXI_UI.ScrollBar.prototype.handleUp = function() {
    this._start = null;
};

/**
 * scroll content to position
 */
PIXI_UI.ScrollBar.prototype.scrollContent = function(x, y) {
    if (this.scrollArea && this.scrollArea.content) {
        if (this.orientation === PIXI_UI.ScrollBar.HORIZONTAL) {
            this.scrollArea._scrollContent(
                -(this.scrollArea.content.width - this.scrollArea.width) *
                    (x / (this.scrollArea.width - this.thumb.width)),
                0);
        } else {
            this.scrollArea._scrollContent(
                0,
                -(this.scrollArea.content.height - this.scrollArea.height) *
                    (y / (this.scrollArea.height - this.thumb.height)));
        }
    }
};

PIXI_UI.ScrollBar.prototype.handleWheel = function (event) {
    var x = this.thumb.x - event.delta * this.scrolldelta;
    var y = this.thumb.y - event.delta * this.scrolldelta;
    if (this.moveThumb(x, y)) {
        this.scrollContent(x, y);
    }
};

/**
 * move the thumb on the scroll bar within its bounds
 * @param x new calculated x position of the thumb
 * @param y new calculated y position of the thumb
 * @returns {boolean} returns true if the position of the thumb has been
 * moved
 */
PIXI_UI.ScrollBar.prototype.moveThumb = function(x, y) {
    if(this.orientation === PIXI_UI.ScrollBar.HORIZONTAL) {
        x = Math.min(x, this.width - this.thumb.width);
        x = Math.max(x, 0);
        if (x !== this.thumb.x) {
            if (this.progressSkin) {
                this.progressSkin.width = x;
                this.progressSkin.height = this.skin.height;
            }
            this.thumb.x = x;
            return true;
        }
    } else {
        y = Math.min(y, this.height - this.thumb.height);
        y = Math.max(y, 0);
        if (y !== this.thumb.y) {
            this.thumb.y = y;
            if (this.progressSkin) {
                this.progressSkin.height = y;
                this.progressSkin.width = this.skin.width;
            }
            return true;
        }
    }
    return false;
};

PIXI_UI.ScrollBar.prototype.showTrack = function(skin) {
    if (this.skin !== skin) {
        if(this.skin) {
            this.removeChild(this.skin);
        }

        this.addChildAt(skin, 0);
        this.skin = skin;
    }
};

PIXI_UI.ScrollBar.prototype.showProgress = function(skin) {
    if (this.progressSkin !== skin) {
        if(this.progressSkin) {
            this.removeChild(this.progressSkin);
        }
        skin.width = skin.height = 0;
        this.addChildAt(skin, 1);
        this.progressSkin = skin;
    }
};

PIXI_UI.ScrollBar.prototype.redraw = function() {
    if (this.invalidTrack && this.thumb) {
        this.fromSkin('horizontal_progress', this.showProgress);
        this.fromSkin(this.orientation+'_track', this.showTrack);
        if (this.scrollArea) {
            if (this.orientation === PIXI_UI.ScrollBar.HORIZONTAL) {
                this.thumb.width = Math.max(20, this.scrollArea.width / (this.scrollArea.content.width / this.scrollArea.width));
            } else {
                this.thumb.height = Math.max(20, this.scrollArea.height / (this.scrollArea.content.height / this.scrollArea.height));
            }
        }
        if (this.orientation === PIXI_UI.ScrollBar.HORIZONTAL) {
            this.skin.width = this.width;
        } else {
            this.skin.height = this.height;
        }

        this.invalidTrack = false;
    }
};


/**
 * The width of the ScrollBar, setting this will redraw the track and thumb.
 * (set invalidDimensions)
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI_UI.ScrollBar.prototype, 'width', {
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
 * The height of the ScrollBar, setting this will redraw the track and thumb.
 * (set invalidDimensions)
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI_UI.ScrollBar.prototype, 'height', {
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

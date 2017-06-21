var Skinable = require('../core/Skinable'),
    ScrollThumb = require('./ScrollThumb'),
    SliderData = require('../utils/SliderData');

/**
 * A scrollabe control provides a thumb that can be be moved along a fixed track.
 * This is the common ground for ScrollBar and Slider
 *
 * @class Scrollable
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the radio button {GOWN.Theme}
 */
// TODO: remove setting value (value manipulation is for Slider only)
function Scrollable(theme) {
    /**
     * The scrollable mode
     *
     * @type String
     * @default Scrollable.DESKTOP_MODE
     */
    this.mode = this.mode || Scrollable.DESKTOP_MODE;

    Skinable.call(this, theme);

    /**
     * The scrollable direction
     *
     * @type String
     * @default Scrollable.HORIZONTAL
     */
    this.direction = this.direction || Scrollable.HORIZONTAL;

    /**
     * Invalidate track so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidTrack = true;

    /**
     * Inverse the progress bar
     *
     * @private
     * @type bool
     * @default false
     */
    this._inverse = false;

    /**
     * Point where the mouse hit the scrollable
     *
     * @private
     * @type Number[]
     * @default null
     */
    this._start = null;

    /**
     * The minimum
     *
     * @private
     * @type Number
     * @default 0
     */
    this._minimum = this._minimum || 0;

    /**
     * The maximum
     *
     * @private
     * @type Number
     * @default 100
     */
    this._maximum = this._maximum || 100;

    /**
     * Step size (not implemented yet)
     *
     * @private
     * @type Number
     * @default 1
     */
    this.step = this.step || 1; //TODO: implement me!

    /**
     * Pagination jump (not implemented yet)
     *
     * @private
     * @type Number
     * @default 10
     */
    this.page = this.page || 10; //TODO: implement me!

    /**
     * Value
     *
     * @private
     * @type Number
     * @default 0
     */
    this._value = this.minimum;

    /**
     * Number of pixels you scroll at a time (if the event delta is 1 / -1)
     *
     * @type Number
     * @default 10
     */
    this.scrolldelta = 10;

    this.on('touchstart', this.handleDown, this);
    this.on('mousedown', this.handleDown, this);

    this.on('touchend', this.handleUp, this);
    this.on('touchendoutside', this.handleUp, this);
    this.on('mouseupoutside', this.handleUp, this);
    this.on('mouseup', this.handleUp, this);

    /**
     * Invalidate thumb factory so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.thumbFactoryInvalid = true;
}

Scrollable.prototype = Object.create( Skinable.prototype );
Scrollable.prototype.constructor = Scrollable;
module.exports = Scrollable;

/**
 * In desktop mode mouse wheel support is added (default)
 *
 * @static
 * @final
 * @type String
 */
Scrollable.DESKTOP_MODE = 'desktop';

/**
 * In mobile mode mouse wheel support is disabled
 *
 * @static
 * @final
 * @type String
 */
Scrollable.MOBILE_MODE = 'mobile';

/**
 * Show horizontal scrollbar/slider
 *
 * @static
 * @final
 * @type String
 */
Scrollable.HORIZONTAL = 'horizontal';

/**
 * Show vertical scrollbar/slider
 *
 * @static
 * @final
 * @type String
 */
Scrollable.VERTICAL = 'vertical';

/**
 * Create the thumb
 *
 * @private
 */
Scrollable.prototype.createThumb = function() {
    this._thumbFactory = this._thumbFactory || this.defaultThumbFactory;
    this.thumb = this._thumbFactory();
    this.addChild(this.thumb);
    this.positionThumb(this.value);
};

/**
 * A function that is expected to return a new GOWN.ScrollThumb
 *
 * @returns {ScrollThumb}
 * @private
 */
Scrollable.prototype.defaultThumbFactory = function() {
    return new ScrollThumb(this, this.theme);
};

/**
 * Scroll to a specific position (not implemented yet)
 */
Scrollable.prototype.scrollToPosition = function() {
};

/**
 * Handle mouse down/touch start.
 * Move scroll thumb.
 *
 * @param mouseData mouse data provided by PIXI
 * @protected
 */
Scrollable.prototype.handleDown = function(mouseData) {
    var local = mouseData.data.getLocalPosition(this);
    var center = {
        x: local.x - this.thumb.width / 2,
        y: local.y - this.thumb.height / 2
    };
    if (mouseData.target === this &&
        this.moveThumb(center.x, center.y)) {
        this._start = [local.x, local.y];
        this.thumbMoved(center.x, center.y);
    }
};

/**
 * @private
 */
Scrollable.prototype.decrement = function() {
  this.value -= this._step;
};

/**
 * @private
 */
Scrollable.prototype.increment = function() {
  this.value += this._step;
};

/**
 * Handle mouse up/touch end
 *
 * @protected
 */
Scrollable.prototype.handleUp = function() {
    this._start = null;
};

/**
 * Handle mouse move. Moves the thumb.
 *
 * @param mouseData mouse data provided by PIXI
 * @protected
 */
Scrollable.prototype.handleMove = function(mouseData) {
    if (this._start) {
        var local = mouseData.data.getLocalPosition(this);
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

/**
 * Handle mouse wheel. Moves thumb on track.
 *
 * @param event mouse wheel event from browser
 * @protected
 */
Scrollable.prototype.handleWheel = function (event) {
    var x = this.thumb.x - event.delta * this.scrolldelta;
    var y = this.thumb.y - event.delta * this.scrolldelta;
    if (this.moveThumb(x, y)) {
        this.thumbMoved(x, y);
    }
};

/**
 * Thumb has new x/y position
 *
 * @param x x-position that has been scrolled to (ignored when vertical) {Number}
 * @param y y-position that has been scrolled to (ignored when horizontal) {Number}
 */
Scrollable.prototype.thumbMoved = function(x, y) {
    var pos = this.direction === Scrollable.HORIZONTAL ? x : y;
    this.value = this.pixelToValue(pos);
};

/**
 * Show the progress skin from the start/end of the scroll track to the current
 * position of the thumb.
 *
 * @private
 */
Scrollable.prototype._updateProgressSkin = function() {
    if (!this.progressSkin) {
        return;
    }
    if(this.direction === Scrollable.HORIZONTAL) {
        var progressPosX = this.thumb.x + this.thumb.width / 2;
        if (this.inverse) {
            this.progressSkin.x = progressPosX;
            this.progressSkin.width = this.width - progressPosX;
            this.progressSkin.height = this.skin.height;
        } else {
            this.progressSkin.x = 0;
            this.progressSkin.width = progressPosX;
            this.progressSkin.height = this.skin.height;
        }
    } else {
        var progressPosY = this.thumb.y + this.thumb.height / 2;
        if (this.inverse) {
            this.progressSkin.y = progressPosY;
            this.progressSkin.height = this.height - progressPosY;
            this.progressSkin.width = this.skin.width;
        } else {
            this.progressSkin.y = 0;
            this.progressSkin.height =progressPosY;
            this.progressSkin.width = this.skin.width;
        }
    }
};

/**
 * Returns the max. width in pixel
 * (normally this.width - thumb width)
 *
 * @returns {Number}
 */
Scrollable.prototype.maxWidth = function() {
    return this.width - this.thumb.width;
};

/**
 * Returns the max. height in pixel
 * (normally this.height - thumb height)
 *
 * @returns {Number}
 */
Scrollable.prototype.maxHeight = function() {
    return this.height - this.thumb.height;
};

/**
 * Move the thumb on the scroll bar within its bounds
 *
 * @param x New x position of the thumb {Number}
 * @param y New y position of the thumb {Number}
 * @returns {boolean} Returns true if the position of the thumb has been
 * moved
 */
Scrollable.prototype.moveThumb = function(x, y) {
    if (this.thumb.move(x, y)) {
        this._updateProgressSkin();
        return true;
    }
    return false;
};

/**
 * Show scroll track
 *
 * @param skin The track skin {PIXI.DisplayObject}
 * @private
 */
Scrollable.prototype.showTrack = function(skin) {
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

/**
 * Show progress on track (from the start/end of the track to the
 * current position of the thumb)
 *
 * @param skin The progress skin {PIXI.DisplayObject}
 * @private
 */
Scrollable.prototype.showProgress = function(skin) {
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

/**
 * Update before draw call. Redraw track and progressbar and create thumb.
 *
 * @protected
 */
Scrollable.prototype.redraw = function() {
    if (this.thumbFactoryInvalid) {
        this.createThumb();
        this.thumbFactoryInvalid = false;
    }
    if (this.invalidTrack) {
        this.fromSkin(this.direction+'_progress', this.showProgress);
        this.fromSkin(this.direction+'_track', this.showTrack);
        if (this.skin) {
            if (this.direction === Scrollable.HORIZONTAL) {
                this.skin.width = this.width;
            } else {
                this.skin.height = this.height;
            }
            this.invalidTrack = false;
        }
    }
};

/**
 * Calculate value of slider based on the current pixel position of the thumb
 *
 * @param position current pixel position of the thumb {Number}
 * @returns {Number} Value between minimum and maximum
 */
Scrollable.prototype.pixelToValue = function(position) {
    var max = 0;
    if (this.direction === Scrollable.HORIZONTAL) {
        max = this.maxWidth();
    } else {
        max = this.maxHeight();
    }
    if (this._inverse) {
        position = max - position;
    }
    return position / max * (this.maximum - this.minimum) + this.minimum;
};

/**
 * Calculate current pixel position of thumb based on given value
 *
 * @param value The value of the thumb position {Number}
 * @returns {Number} Position of the scroll thumb in pixel
 */
Scrollable.prototype.valueToPixel = function(value) {
    var max = 0;
    if (this.direction === Scrollable.HORIZONTAL) {
        max = this.maxWidth();
    } else {
        max = this.maxHeight();
    }
    var position = (value - this.minimum) / (this.maximum - this.minimum) * max;
    if (this._inverse) {
        position = max - position;
    }
    return position;
};

/**
 * Position the thumb to a given value
 *
 * @param value The value to which the thumb gets moved {Number}
 */
Scrollable.prototype.positionThumb = function(value) {
    if (this.thumb) {
        var pos = this.valueToPixel(value);
        if (this.direction === Scrollable.HORIZONTAL) {
            this.moveThumb(pos, 0);
        } else {
            this.moveThumb(0, pos);
        }
    }
};

/**
 * The width of the Scrollable, setting this will redraw the track and thumb.
 *
 * @name GOWN.Scrollable#width
 * @type Number
 */
Object.defineProperty(Scrollable.prototype, 'width', {
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
 * @name GOWN.Scrollable#inverse
 * @type Boolean
 */
Object.defineProperty(Scrollable.prototype, 'inverse', {
    get: function() {
        return this._inverse;
    },
    set: function(inverse) {
        if (inverse !== this._inverse) {
            this._inverse = inverse;

            if (this.direction === Scrollable.HORIZONTAL) {
                this.moveThumb(this.width - this.thumb.x, 0);
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
 *
 * @name GOWN.Scrollable#height
 * @type Number
 */
Object.defineProperty(Scrollable.prototype, 'height', {
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

/**
 * Set value (between minimum and maximum)
 *
 * @name GOWN.Scrollable#value
 * @type Number
 * @default 0
 */
Object.defineProperty(Scrollable.prototype, 'value', {
    get: function() {
        return this._value;
    },
    set: function(value) {
        if (isNaN(value)) {
            return;
        }
        value = Math.min(value, this.maximum);
        value = Math.max(value, this.minimum);
        if (this._value === value) {
            return;
        }

        // inform system that value has been changed
        var sliderData = new SliderData();
        sliderData.value = value;
        sliderData.target = this;
        if (this.change) {
            this.change(sliderData);
        }
        this.emit('change', sliderData, this);

        // move thumb
        this.positionThumb(value);

        this._value = value;
    }
});

/**
 * Set minimum and update value if necessary
 *
 * @name GOWN.Scrollable#minimum
 * @type Number
 * @default 0
 */
Object.defineProperty(Scrollable.prototype, 'minimum', {
    get: function() {
        return this._minimum;
    },
    set: function(minimum) {
        if(!isNaN(minimum) && this.minimum !== minimum && minimum < this.maximum) {
            this._minimum = minimum;
        }
        if (this._value < this.minimum) {
            this.value = this._value;
        }
    }
});

/**
 * Set maximum and update value if necessary
 *
 * @name GOWN.Scrollable#maximum
 * @type Number
 * @default 100
 */
Object.defineProperty(Scrollable.prototype, 'maximum', {
    get: function() {
        return this._maximum;
    },
    set: function(maximum) {
        if(!isNaN(maximum) && this.maximum !== maximum && maximum > this.minimum) {
            this._maximum = maximum;
        }
        if (this._value > this.maximum) {
            this.value = maximum;
        }
    }
});

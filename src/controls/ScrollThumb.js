var Button = require('./Button');

/**
 * Thumb button that can be moved on the scrollbar
 *
 * @class ScrollThumb
 * @extends GOWN.Button
 * @memberof GOWN
 * @constructor
 * @param scrollable The scrollable that the scroll thumb belongs to {GOWN.Scrollable}
 * @param [theme] theme for the scroll thumb {GOWN.Theme}
 * @param [skinName=ScrollThumb.SKIN_NAME] name of the scroll thumb skin {String}
 */
function ScrollThumb(scrollable, theme, skinName) {
    /**
     * The scrollable that the scroll thumb belongs to
     *
     * @type GOWN.Scrollable
     */
    this.scrollable = scrollable;

    var defaultSkin = ScrollThumb.SKIN_NAME;
    if (!theme.thumbSkin) {
        defaultSkin = Button.SKIN_NAME;
    }

    /**
     * The skin name
     *
     * @type String
     * @default ScrollThumb.SKIN_NAME
     */
    this.skinName = skinName || defaultSkin;

    if (theme.thumbSkin) {
        /**
         * The valid scroll thumb states
         *
         * @private
         * @type String[]
         * @default ScrollThumb.THUMB_STATES
         */
        this._validStates = ScrollThumb.THUMB_STATES;
    }
    if (theme.thumbWidth) {
        /**
         * The width of the scroll thumb
         *
         * @type Number
         */
        this.width = theme.thumbWidth;
    }
    if (theme.thumbHeight) {
        /**
         * The height of the scroll thumb
         *
         * @type Number
         */
        this.height = theme.thumbHeight;
    }

    Button.call(this, theme, this.skinName);

    /**
     * Invalidate track so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidTrack = true;

    this.on('touchmove', this.handleMove, this);
    this.on('mousemove', this.handleMove, this);

    /* jshint unused: false */
    this.on('touchdown', this.handleDown, this);
    this.on('mousedown', this.handleDown, this);
    /* jshint unused: false */

    this.on('mouseup', this.handleUp, this);
    this.on('touchend', this.handleUp, this);
    this.on('touchendoutside', this.handleUp, this);
}

ScrollThumb.prototype = Object.create( Button.prototype );
ScrollThumb.prototype.constructor = ScrollThumb;
module.exports = ScrollThumb;

/**
 * Default scroll thumb skin name
 *
 * @static
 * @final
 * @type String
 */
ScrollThumb.SKIN_NAME = 'scroll_thumb';

/**
 * Names of possible states for a scroll thumb
 *
 * @static
 * @final
 * @type String[]
 * @private
 */
ScrollThumb.THUMB_STATES = [
    'horizontal_up', 'vertical_up',
    'horizontal_down', 'vertical_down',
    'horizontal_hover', 'vertical_hover'
];

var originalCurrentState = Object.getOwnPropertyDescriptor(Button.prototype, 'currentState');

/**
 * The current state (one of _validStates)
 *
 * @name GOWN.ScrollThumb#currentState
 * @type String
 */
Object.defineProperty(ScrollThumb.prototype, 'currentState',{
    set: function(value) {
        if (this.theme.thumbSkin) {
            // use skin including direction instead of default skin
            value = this.scrollable.direction + '_' + value;
        }
        originalCurrentState.set.call(this, value);
    }
});

ScrollThumb.prototype.handleDown = function(mouseData) {
    var local = mouseData.data.getLocalPosition(this.scrollable);
    this.scrollable._start = [local.x, local.y];
    //this.scrollable.handleDown(mouseData);
    mouseData.stopPropagation();
};

/**
 * onMove callback
 *
 * @protected
 */
ScrollThumb.prototype.handleMove = function (mouseData) {
    this.scrollable.handleMove(mouseData);
};

/**
 * onUp callback
 *
 * @protected
 */
ScrollThumb.prototype.handleUp = function (mouseData) {
    this.scrollable.handleUp(mouseData);
};

/**
 * Show track icon on thumb
 *
 * @param skin The new scroll thumb skin name {String}
 */
ScrollThumb.prototype.showTrack = function(skin) {
    if (this.skin !== skin) {
        if(this.skin) {
            this.removeChild(this.skin);
        }

        this.addChild(skin);
        this.skin = skin;
    }
    skin.x = Math.floor((this.width - skin.getBounds().width )/ 2);
    skin.y = Math.floor((this.height - skin.getBounds().height )/ 2);
    this.invalidTrack = false;
};

/**
 * Redraw the skin
 *
 * @private
 */
ScrollThumb.prototype.redraw = function() {
    if (this.invalidTrack && this.theme.thumbSkin) {
        this.fromSkin(this.scrollable.direction+'_thumb', this.showTrack);
    }
};

/**
 * Move the thumb on the scroll bar within its bounds
 *
 * @param x New calculated x position of the thumb {Number}
 * @param y New calculated y position of the thumb {Number}
 * @returns {boolean} returns true if the position of the thumb has been
 * moved
 */
ScrollThumb.prototype.move = function(x, y) {
    if (this.scrollable.direction === GOWN.Scrollable.HORIZONTAL) {
        if (isNaN(x)) {
            return false;
        }
        x = Math.min(x, this.scrollable.maxWidth());
        x = Math.max(x, 0);
        if (x !== this.x) {
            this.x = x;
            return true;
        }
    } else {
        if (isNaN(y)) {
            return false;
        }
        y = Math.min(y, this.scrollable.maxHeight());
        y = Math.max(y, 0);
        if (y !== this.y) {
            this.y = y;
            return true;
        }
    }
    return false;
};

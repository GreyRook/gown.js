var Button = require('./Button');

/**
 * thumb button that can be moved on the scrollbar
 *
 * @class ScrollThumb
 * @extends GOWN.Button
 * @memberof GOWN
 * @constructor
 */
function ScrollThumb(scrollable, theme, skinName) {
    this.scrollable = scrollable;
    var defaultSkin = ScrollThumb.SKIN_NAME;
    if (!theme.thumbSkin) {
        defaultSkin = Button.SKIN_NAME;
    }
    this.skinName = skinName || defaultSkin;
    if (theme.thumbSkin) {
        this._validStates = ScrollThumb.THUMB_STATES;
    }
    if (theme.thumbWidth) {
        this.width = theme.thumbWidth;
    }
    if (theme.thumbHeight) {
        this.height = theme.thumbHeight;
    }
    Button.call(this, theme, this.skinName);
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


ScrollThumb.SKIN_NAME = 'scroll_thumb';

ScrollThumb.THUMB_STATES = [
    'horizontal_up', 'vertical_up',
    'horizontal_down', 'vertical_down',
    'horizontal_hover', 'vertical_hover'
];

var originalCurrentState = Object.getOwnPropertyDescriptor(Button.prototype, 'currentState');

/**
 * The current state (one of _validStates)
 *
 * @property currentState
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

ScrollThumb.prototype.handleMove = function (mouseData) {
    this.scrollable.handleMove(mouseData);
};

ScrollThumb.prototype.handleUp = function (mouseData) {
    this.scrollable.handleUp(mouseData);
};

/**
 * show track icon on thumb
 *
 * @method showTrack
 * @param skin
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
 * redraw the skin
 *
 * @method redraw
 */
ScrollThumb.prototype.redraw = function() {
    if (this.invalidTrack && this.theme.thumbSkin) {
        this.fromSkin(this.scrollable.direction+'_thumb', this.showTrack);
    }
};


/**
 * move the thumb on the scroll bar within its bounds
 *
 * @param x new calculated x position of the thumb
 * @param y new calculated y position of the thumb
 * @returns {boolean} returns true if the position of the thumb has been
 * moved
 * @method move
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

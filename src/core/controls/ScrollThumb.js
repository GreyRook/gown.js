var Button = require('./Button');

/**
 * thumb button that can be moved on the scrollbar
 *
 * @class ScrollThumb
 * @extends PIXI_UI.Button
 * @memberof PIXI_UI
 * @constructor
 */
function ScrollThumb(scrollable, theme) {
    this.scrollable = scrollable;
    this.skinName = this.skinName || ScrollThumb.SKIN_NAME;
    this._validStates = [
        'horizontal_up', 'vertical_up',
        'horizontal_down', 'vertical_down',
        'horizontal_hover', 'vertical_hover'];
    Button.call(this, theme);
    this.invalidTrack = true;
    this.width = 20;
    this.height = 20;

    this.touchmove = this.mousemove;
    /* jshint unused: false */
    this.touchdown = this.mousedown;
    /* jshint unused: false */
    this.touchend = this.touchendoutside = this.mouseup;
}

ScrollThumb.prototype = Object.create( Button.prototype );
ScrollThumb.prototype.constructor = ScrollThumb;
module.exports = ScrollThumb;


ScrollThumb.SKIN_NAME = 'scroll_thumb';

var originalCurrentState = Object.getOwnPropertyDescriptor(Button.prototype, 'currentState');

/**
 * The current state (one of _validStates)
 *
 * @property currentState
 * @type String
 */
Object.defineProperty(ScrollThumb.prototype, 'currentState',{
    set: function(value) {
        value = this.scrollable.orientation + '_' + value;
        originalCurrentState.set.call(this, value);
    }
});

ScrollThumb.prototype.buttonmousedown = Button.prototype.mousedown;
ScrollThumb.prototype.mousedown = function(mouseData) {
    this.buttonmousedown(mouseData);
    this.scrollable.handleDown(mouseData);
};

ScrollThumb.prototype.buttonmousemove = Button.prototype.mousemove;
ScrollThumb.prototype.mousemove = function (mouseData) {
    this.buttonmousemove(mouseData);
    this.scrollable.handleMove(mouseData);
};

ScrollThumb.prototype.buttonmouseup = Button.prototype.mouseup;
ScrollThumb.prototype.mouseup = function (mouseData) {
    this.buttonmouseup(mouseData);
    this.scrollable.handleUp();
};

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

ScrollThumb.prototype.redraw = function() {
    this.redrawSkinable();
    if (this.invalidTrack) {
        this.fromSkin(this.scrollable.orientation+'_thumb', this.showTrack);
    }
};

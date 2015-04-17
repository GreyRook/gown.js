/**
 * authors: Björn Friedrichs, Andreas Bresser
 */

PIXI_UI.ScrollThumb = function(scrollable, theme) {
    this.scrollable = scrollable;
    this.skinName = this.skinName || PIXI_UI.ScrollThumb.SKIN_NAME;
    this._validStates = ['horizontal_up', 'vertical_up', 'horizontal_down', 'vertical_down', 'horizontal_hover', 'vertical_hover'];
    PIXI_UI.Button.call(this, theme);
    this.invalidTrack = true;
    this.width = 20;
    this.height = 20;

    this.touchmove = this.mousemove;
    /* jshint unused: false */
    this.touchdown = this.mousedown;
    /* jshint unused: false */
    this.touchend = this.touchendoutside = this.mouseup;
};

PIXI_UI.ScrollThumb.prototype = Object.create( PIXI_UI.Button.prototype );
PIXI_UI.ScrollThumb.prototype.constructor = PIXI_UI.ScrollThumb;

PIXI_UI.ScrollThumb.SKIN_NAME = 'scroll_thumb';

var originalCurrentState = Object.getOwnPropertyDescriptor(PIXI_UI.Button.prototype, 'currentState');

/**
 * The current state (one of _validStates)
 *
 * @property currentState
 * @type String
 */
Object.defineProperty(PIXI_UI.ScrollThumb.prototype, 'currentState',{
    set: function(value) {
        value = this.scrollable.orientation + '_' + value;
        originalCurrentState.set.call(this, value);
    }
});

PIXI_UI.ScrollThumb.prototype.buttonmousedown = PIXI_UI.Button.prototype.mousedown;
PIXI_UI.ScrollThumb.prototype.mousedown = function(mouseData) {
    this.buttonmousedown(mouseData);
    this.scrollable.handleDown(mouseData);
};

PIXI_UI.ScrollThumb.prototype.buttonmousemove = PIXI_UI.Button.prototype.mousemove;
PIXI_UI.ScrollThumb.prototype.mousemove = function (mouseData) {
    this.buttonmousemove(mouseData);
    this.scrollable.handleMove(mouseData);
};

PIXI_UI.ScrollThumb.prototype.buttonmouseup = PIXI_UI.Button.prototype.mousemove;
PIXI_UI.ScrollThumb.prototype.mouseup = function (mouseData) {
    this.buttonmouseup(mouseData);
    this.scrollable.handleUp();
};

PIXI_UI.ScrollThumb.prototype.showTrack = function(skin) {
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

PIXI_UI.ScrollThumb.prototype.redraw = function() {
    this.redrawSkinable();
    if (this.invalidTrack) {
        this.fromSkin(this.scrollable.orientation+'_thumb', this.showTrack);
    }
};

PIXI_UI.ScrollThumb = function(orientation, theme) {
    this.orientation = orientation || PIXI_UI.ScrollBar.HORIZONTAL;
    this.skinName = this.skinName || PIXI_UI.ScrollThumb.SKIN_NAME;
    this._validStates = ['horizontal_up', 'vertical_up', 'horizontal_down', 'vertical_down', 'horizontal_hover', 'vertical_hover'];
    PIXI_UI.Button.call(this, theme);
    this.invalidTrack = true;
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
        value = this.orientation + '_' + value;

        originalCurrentState.set.call(this, value);
    }
});

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
    this.redrawControl();
    if (this.invalidTrack) {
        this.fromSkin(this.orientation+'_thumb', this.showTrack);
    }
};
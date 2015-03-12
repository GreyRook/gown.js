/**
 * @author Andreas Bresser
 */

/**
 * Control that requires a theme (e.g. a button)
 *
 * @class Skinable
 * @constructor
 */
PIXI_UI.Skinable = function (theme) {
    PIXI_UI.Control.call(this);
    this.skinCache = {};
    this.setTheme(theme || PIXI_UI.theme);

    if (this.theme === undefined) {
        throw new Error("you need to define a theme first");
    }

    // invalidate state so the control will be redrawn next time
    this.invalidState = true; // draw for the first time
    this.invalidDimensions = true;
};

PIXI_UI.Skinable.prototype = Object.create( PIXI_UI.Control.prototype );
PIXI_UI.Skinable.prototype.constructor = PIXI_UI.Skinable;

PIXI_UI.Skinable.prototype.controlSetTheme = PIXI_UI.Control.prototype.setTheme;
/**
 * change the theme
 *
 * @method setTheme
 * @param theme the new theme {Theme}
 */
PIXI_UI.Skinable.prototype.setTheme = function(theme) {
    if (theme === this.theme && theme) {
        return;
    }

    this.controlSetTheme(theme);
    this.preloadSkins();
    // force states to redraw
    this.invalidState = true;
};

/**
 * remove old skin and add new one
 *
 * @method changeState
 * @param skin {DisplayObject}
 */
PIXI_UI.Skinable.prototype.changeState = function(skin) {
    if (this._currentSkin !== skin) {
        this._lastSkin = this._currentSkin;
        this.addChildAt(skin, 0);
        skin.alpha = 1.0;
        this._currentSkin = skin;

    }
    this.invalidState = false;
};

/**
 * initiate all skins first
 *
 * @method preloadSkins
 */
PIXI_UI.Skinable.prototype.preloadSkins = function() {
};

/**
 * get image from skin (will execute a callback with the loaded skin
 * when it is loaded or call it directly when it already is loaded)
 *
 * @method fromSkin
 * @param name name of the state
 * @param callback callback that is executed if the skin is loaded
 */
PIXI_UI.Skinable.prototype.fromSkin = function(name, callback) {
    var skin;
    if (this.skinCache[name]) {
        skin = this.skinCache[name];
    } else {
        skin = this.theme.getSkin(this.skinName, name);
        this.skinCache[name] = skin;
    }
    if (skin) {
        callback.call(this, skin);
    }
    // TODO: what, if the skin is not loaded jet? --> execute callback after load
};

/**
 * update before draw call
 * redraw control for current state from theme
 *
 * @method redraw
 */
PIXI_UI.Skinable.prototype.redraw = function() {
    // remove last skin after new one has been added
    // (just before rendering, otherwise we would see nothing for a frame)
    if (this._lastSkin) {
        //this.removeChild(this._lastSkin);
        this._lastSkin.alpha = 0;
        this._lastSkin = null;
    }
    if (this.invalidState) {
        this.fromSkin(this._currentState, this.changeState);
    }
    if (this._currentSkin &&
        this.invalidDimensions &&
        this._width > 0 && this._height > 0) {

        this._currentSkin.width = this._width;
        this._currentSkin.height = this._height;
        this.invalidDimensions = false;
        this.updateDimensions();
    }
};

PIXI_UI.Skinable.prototype.updateDimensions = function() {
};


/**
 * change the skin name
 * You normally set the skin name as constant in your control, but if you
 * want you can set another skin name to change skins for single components
 * at runtime.
 *
 * @property skinName
 * @type String
 */
Object.defineProperty(PIXI_UI.Skinable.prototype, "skinName", {
    get: function() {
        return this._skinName;
    },
    set: function(value) {
        if ( this._skinName === value ) {
            return;
        }
        this._skinName = value;
        this.invalidState = true;
    }
});
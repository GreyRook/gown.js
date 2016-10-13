var Control = require('./Control');

/**
 * Control with a managed skin
 * (e.g. a button that has different skins for up/hover/down states)
 *
 * @class Skinable
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 */
function Skinable(theme) {
    Control.call(this);
    this.skinCache = {};
    this.setTheme(theme || GOWN.theme);

    if (this.theme === undefined) {
        throw new Error('you need to define a theme first');
    }

    // invalidate state so the control will be redrawn next time
    this.invalidState = true; // draw for the first time
    // overwrite skin values before next draw call.
    this.invalidSkinData = true;

    // default skin fallback state is 'up' (works for buttons)
    this.skinFallback = 'up';
}

Skinable.prototype = Object.create( Control.prototype );
Skinable.prototype.constructor = Skinable;
module.exports = Skinable;

Skinable.prototype.controlSetTheme = Control.prototype.setTheme;
/**
 * change the theme
 *
 * @method setTheme
 * @param theme the new theme {Theme}
 */
Skinable.prototype.setTheme = function(theme) {
    if (theme === this.theme || !theme) {
        return;
    }

    this.controlSetTheme(theme);
    this.preloadSkins();
    // force states to redraw
    this.invalidState = true;
};

/**
 * overwrite data from theme for this specific component.
 * (usable if you want to change e.g. background color based on selected items)
 */
Skinable.prototype.updateTheme = function(data) {
    this.skinData = data;
    this.invalidSkinData = true;
};

/**
 * remove old skin and add new one
 *
 * @method changeSkin
 * @param skin {DisplayObject}
 */
Skinable.prototype.changeSkin = function(skin) {
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
Skinable.prototype.preloadSkins = function() {
};

/**
 * get image from skin (will execute a callback with the loaded skin
 * when it is loaded or call it directly when it already is loaded)
 *
 * @method fromSkin
 * @param name name of the state
 * @param callback callback that is executed if the skin is loaded
 */
Skinable.prototype.fromSkin = function(name, callback) {
    var skin;
    if (this.skinCache[name]) {
        skin = this.skinCache[name];
    } else {
        skin = this.theme.getSkin(this.skinName, name);
        this.skinCache[name] = skin;
    }
    if (skin) {
        callback.call(this, skin);
    } else if (this.skinFallback && this.skinFallback !== name) {
        skin = this.fromSkin(this.skinFallback, callback);
    }
    return skin;
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
Object.defineProperty(Skinable.prototype, 'skinName', {
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

/**
 * fallback skin if other skin does not exist (e.g. if a mobile theme
 * that does not provide a "hover" state is used on a desktop system)
 *
 * @property skinFallback
 * @type String
 */
Object.defineProperty(Skinable.prototype, 'skinFallback', {
    get: function() {
        return this._skinFallback;
    },
    set: function(value) {
        this._skinFallback = value;
    }
});

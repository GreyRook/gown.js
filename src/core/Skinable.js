var Control = require('./Control');

/**
 * Control with a managed skin
 * (e.g. a button that has different skins for up/hover/down states)
 *
 * @class Skinable
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 * @param [theme=GOWN.theme] theme for the skinable {Theme}
 */
function Skinable(theme) {
    Control.call(this);

    /**
     * The skin cache
     *
     * @private
     * @type Object
     * @default {}
     */
    this.skinCache = {};

    this.setTheme(theme || GOWN.theme);

    if (this.theme === undefined) {
        throw new Error('you need to define a theme first');
    }

    /**
     * Invalidate state so the control will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidState = true; // draw for the first time

    /**
     * Overwrite skin values before next draw call.
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidSkinData = true;

    /**
     * Will destroy the skin cache when the skinable gets destroyed
     *
     * @type bool
     * @default true
     */
    this.allowDestroyCache = true;

    /**
     * The fallback skin if the other skin does not exist (e.g. if a mobile theme
     * that does not provide a "hover" state is used on a desktop system)
     * (normally the default "up"-state skin)
     *
     * @type String
     * @default 'up'
     * @private
     */
    this._skinFallback = 'up';
}

Skinable.prototype = Object.create( Control.prototype );
Skinable.prototype.constructor = Skinable;
module.exports = Skinable;

/**
 * @private
 */
Skinable.prototype.controlSetTheme = Control.prototype.setTheme;

/**
 * Change the theme
 *
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
 * Overwrite data from theme for this specific component.
 * (usable if you want to change e.g. background color based on selected items)
 *
 * @param data updated skin data
 */
Skinable.prototype.updateTheme = function(data) {
    this.skinData = data;
    this.invalidSkinData = true;
};

/**
 * Remove old skin and add new one
 *
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
 * Initiate all skins first
 */
Skinable.prototype.preloadSkins = function() {
};

/**
 * Get image from skin (will execute a callback with the loaded skin
 * when it is loaded or call it directly when it already is loaded)
 *
 * @param name name of the state {String}
 * @param callback callback that is executed if the skin is loaded {function}
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
 * Empty skin cache and load skins again
 *
 * @private
 */
Skinable.prototype.reloadSkin = function() {
    for (var name in this.skinCache) {
        var skin = this.skinCache[name];
        if (skin && skin.destroy && this.allowDestroyCache) {
            skin.destroy();
        }
    }
    for (name in this.skinCache) {
        delete this.skinCache[name];
    }
    this.skinCache = {};
    if (this.preloadSkins) {
        this.preloadSkins();
    }
    this.invalidState = true;
};

/**
 * Change the skin name
 * You normally set the skin name as constant in your control, but if you
 * want you can set another skin name to change skins for single components
 * at runtime.
 *
 * @name GOWN.Skinable#skinName
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
        this.reloadSkin();
        this.invalidState = true;
    }
});

/**
 * The fallback skin if the other skin does not exist (e.g. if a mobile theme
 * that does not provide a "hover" state is used on a desktop system)
 * (normally the default "up"-state skin)
 *
 * @name GOWN.Skinable#skinFallback
 * @type String
 * @default 'up'
 */
Object.defineProperty(Skinable.prototype, 'skinFallback', {
    get: function() {
        return this._skinFallback;
    },
    set: function(value) {
        this._skinFallback = value;
    }
});

/**
 * @private
 */
Skinable.prototype.containerDestroy = PIXI.Container.prototype.destroy;

/**
 * Destroy the Skinable and empty the skin cache
 */
Skinable.prototype.destroy = function() {
    for (var name in this.skinCache) {
        var skin = this.skinCache[name];
        if (skin && skin.destroy && this.allowDestroyCache) {
            skin.destroy();
        }
    }
    this._currentSkin = null;
    this.containerDestroy();
};

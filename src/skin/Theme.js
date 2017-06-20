var ScaleContainer = require('../utils/ScaleContainer');
var ThemeFont = require('./ThemeFont');
var EventEmitter = require('eventemitter3');

/**
 * basic theming/skinning.
 *
 * @class Theme
 * @memberof GOWN
 * @constructor
 */
function Theme(global) {
    EventEmitter.call(this);

    // at its core a theme is just a dict that holds a collection of skins.
    // every skin is a function that returns a renderable item (e.g. a texture)
    this._skins = {};

    // default global font for all labels (e.g. button label)
    if (this.textStyle) {
        this.textStyle.clone();
    } else {
        this.textStyle = new ThemeFont();
    }

    if (global === true || global === undefined) {
        GOWN.theme = this;
    }
    this.textureCache = null;
    // own skin for scroll/slider track
    // (uses the default button skin otherwise)
    this.thumbSkin = true;

    // desktop themes have a hover skin if the mouse moves over the button
    this.hoverSkin = true;
}

Theme.prototype = Object.create( EventEmitter.prototype );
Theme.prototype.constructor = Theme;
module.exports = Theme;

// skin has changed
Theme.SKIN_CHANGED = 'skin_changed';

// theme texture loaded
Theme.LOADED = 'loaded';

// theme texture has been loaded and all controls have an assigned skin
Theme.COMPLETE = 'complete';

/**
 * Set skin for ui component
 *

 * @param comp ui-component that we want to skin, e.g. "button" {String}
 * @param id id for the skin (e.g. state when the skinning function will be applied {String}
 * @param skin skin-function that will executed once the component gets updated  {String}
 */
Theme.prototype.setSkin = function(comp, id, skin) {
    this._skins[comp] = this._skins[comp] || {};
    this._skins[comp][id] = skin;
    this.emit(Theme.SKIN_CHANGED, comp, this);
};

/**
 * Set up the asset loader and load files
 *

 * @param jsonPath {Array}
 */
Theme.prototype.addImage = function(jsonPath) {
    this._jsonPath = jsonPath;
    GOWN.loader.add(jsonPath)
        .once('complete', this.loadComplete.bind(this));
};

/**
 * executed when the image has been loaded (see addImage)
 *

 */
Theme.prototype.loadComplete = function(loader, resources) {
    this.setCache(resources);
    this.emit(Theme.LOADED, this);
    this.applyTheme();
};


/**
 * set texture cache (normally called when loading is complete)
 *

 */
Theme.prototype.setCache = function(resources) {
    this.textureCache = resources[this._jsonPath].textures;
};


/**
 * apply theme to controls
 * (normally executed only once after the texture has been loaded)
 *

 */
Theme.prototype.applyTheme = function() {
    this.emit(Theme.COMPLETE, this);
};

/**
 * Create new Scalable Container
 *

 * @param name id defined in the asset loader {String}
 * @param grid grid defining the inner square of the scalable container {Rectangle}
 * @returns {Function}
 */
Theme.prototype.getScaleContainer = function(name, grid, middleWidth, centerHeight) {
    var scope = this;
    return function() {
        var texture = scope.textureCache[name];
        if(!texture) {
            throw new Error('The frameId "' + name + '" does not exist ' +
            'in the texture cache');
        }
        return new ScaleContainer(texture, grid, middleWidth, centerHeight);

    };
};

/**
 * Create new Sprite from image name
 *

 * @param name id defined in the asset loader {String}
 * @returns {Function}
 */
Theme.prototype.getImage = function(name) {
    var scope = this;
    return function() {
        if (scope.textureCache && name in scope.textureCache) {
            return new PIXI.Sprite(scope.textureCache[name]);
        } else {
            // not found - try to load the image.
            return new PIXI.Sprite(PIXI.Texture.fromImage(name));
        }
    };
};

/**
 * Get skin by component and state (or type)
 *

 * @param comp name of the component (e.g. button) {String}
 * @param state (state or type of the skin e.g. "up") {String}
 * @returns {DisplayObject}
 */
Theme.prototype.getSkin = function(comp, state) {
    if (this._skins[comp] && this._skins[comp][state]) {
        return this._skins[comp][state]();
    }
    return null;
};

/**
 * Shortcut to remove the theme from global context
 *

 */
Theme.removeTheme = function() {
    GOWN.theme = undefined;
};

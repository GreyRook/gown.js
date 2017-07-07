var ScaleContainer = require('../utils/ScaleContainer');
var ThemeFont = require('./ThemeFont');
var EventEmitter = require('eventemitter3');

/**
 * Basic theming/skinning.
 *
 * @class Theme
 * @memberof GOWN
 * @constructor
 * @param [global=true] Set theme as the global GOWN.theme
 */
function Theme(global) {
    EventEmitter.call(this);

    /**
     * At its core a theme is just a dict that holds a collection of skins.
     * Every skin is a function that returns a renderable item (e.g. a texture)
     *
     * @private
     * @type Object
     */
    this._skins = {};

    if (this.textStyle) {
        this.textStyle.clone();
    } else {
        /**
         * The default font for all labels (e.g. button label)
         *
         * @type GOWN.ThemeFont
         */
        this.textStyle = new ThemeFont();
    }

    if (global === true || global === undefined) {
        GOWN.theme = this;
    }

    /**
     * The cache for the theme textures
     *
     * @type PIXI.Texture[]
     */
    this.textureCache = null;

    /**
     * Use an own skin for scroll/slider track (uses the default button skin otherwise)
     *
     * @type bool
     * @default true
     */
    this.thumbSkin = true;

    /**
     * Desktop themes have a hover skin if the mouse moves over the button
     *
     * @type bool
     * @default true
     */
    this.hoverSkin = true;
}

Theme.prototype = Object.create( EventEmitter.prototype );
Theme.prototype.constructor = Theme;
module.exports = Theme;

/**
 * Dispatched when a skin has changed
 *
 * @static
 * @final
 * @type String
 */
Theme.SKIN_CHANGED = 'skin_changed';

/**
 * Dispatched when a theme texture has loaded
 *
 * @static
 * @final
 * @type String
 */
Theme.LOADED = 'loaded';

/**
 * Dispatched when a theme texture has been loaded and all controls have an assigned skin
 *
 * @static
 * @final
 * @type String
 */
Theme.COMPLETE = 'complete';

/**
 * Set the skin for a UI component
 *
 * @param comp UI component that we want to skin, e.g. "button" {String}
 * @param id Id for the skin (e.g. state when the skinning function will be applied {String}
 * @param skin skin-function that will executed once the component gets updated {function}
 */
Theme.prototype.setSkin = function(comp, id, skin) {
    this._skins[comp] = this._skins[comp] || {};
    this._skins[comp][id] = skin;
    this.emit(Theme.SKIN_CHANGED, comp, this);
};

/**
 * Set up the asset loader and load files
 *
 * @param jsonPath The path to the json file {String}
 */
Theme.prototype.addImage = function(jsonPath) {
    this._jsonPath = jsonPath;
    GOWN.loader.add(jsonPath)
        .once('complete', this.loadComplete.bind(this));
};

/**
 * Executed when the image has been loaded.
 * Sets cache and emits events.
 *
 * @see addImage
 * @see resource-loader https://github.com/englercj/resource-loader
 *
 * @param loader The loader {Loader}
 * @param resources The loaded resources {Object}
 */
Theme.prototype.loadComplete = function(loader, resources) {
    this.setCache(resources);
    this.emit(Theme.LOADED, this);
    this.applyTheme();
};

/**
 * Set the texture cache (normally called when loading is complete)
 *
 * @param resources The loaded resources {Object}
 */
Theme.prototype.setCache = function(resources) {
    this.textureCache = resources[this._jsonPath].textures;
};

/**
 * Apply the theme to the controls
 * (normally executed only once after the texture has been loaded)
 */
Theme.prototype.applyTheme = function() {
    this.emit(Theme.COMPLETE, this);
};

/**
 * Create a new Scalable Container
 *
 * @param name Id defined in the asset loader {String}
 * @param grid Grid defining the inner square of the scalable container {PIXI.Rectangle}
 * @param [middleWidth] The alternative width to crop the center piece
 * (only needed if we want to scale the image smaller than the original) {Number}
 * @param [centerHeight] The alternative height to crop the center piece
 * (only needed if we want to scale the image smaller than the original) {Number}
 * @return {Function}
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
 * Create a new Sprite from an image name
 *
 * @param name Id defined in the asset loader {String}
 * @returns {function}
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
 * Get a skin by a component name and state (or type)
 *
 * @param comp Name of the component (e.g. button) {String}
 * @param state State or type of the skin (e.g. "up") {String}
 * @returns {PIXI.DisplayObject}
 */
Theme.prototype.getSkin = function(comp, state) {
    if (this._skins[comp] && this._skins[comp][state]) {
        return this._skins[comp][state]();
    }
    return null;
};

/**
 * Shortcut to remove the theme from the global context
 */
Theme.removeTheme = function() {
    GOWN.theme = undefined;
};

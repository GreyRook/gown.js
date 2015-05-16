var ScaleContainer = require('../util/ScaleContainer');

/**
 * basic theming/skinning.
 *
 * @class Theme
 * @memberof PIXI_UI
 * @constructor
 */
function Theme(global) {
    // at its core a theme is just a dict that holds a collection of skins
    this._skins = {};

    this.textStyle = this.textStyle || {};
    // default color for label (e.g. buttons)
    this.textStyle.fill = this.textStyle.fill || '#000';
    // default font for label (e.g. buttons)
    this.textStyle.font = this.textStyle.font || '12px Arial';

    if (global === true || global === undefined) {
        PIXI_UI.theme = this;
    }
}
module.exports = Theme;

/**
 * Set skin for ui component
 *
 * @method setSkin
 * @param comp ui-component that we want to skin, e.g. "button" {String}
 * @param id id for the skin (e.g. state when the skinning function will be applied {String}
 * @param skin skin-function that will executed once the component gets updated  {String}
 */
Theme.prototype.setSkin = function(comp, id, skin) {
    this._skins[comp] = this._skins[comp] || {};
    this._skins[comp][id] = skin;
    // TODO: dispatch event - the skin of "comp"
};

/**
 * Set up the asset loader and load files
 *
 * @method loadImage
 * @param jsonPath {Array}
 */
Theme.prototype.loadImage = function(jsonPath) {
    PIXI_UI.loader
        .add('spreadsheet', jsonPath)
        .load(this.loadComplete.bind(this));
};

/**
 * Create new Scalable Container
 *
 * @method getScaleContainer
 * @param name id defined in the asset loader {String}
 * @param grid grid defining the inner square of the scalable container {Rectangle}
 * @returns {Function}
 */
Theme.prototype.getScaleContainer = function(name, grid) {
    return function() {
        return ScaleContainer.fromFrame(name, grid);
    };
};

/**
 * Create new Sprite from image name
 *
 * @method getImage
 * @param name id defined in the asset loader {String}
 * @returns {Function}
 */
Theme.prototype.getImage = function(name) {
    return function() {
        return PIXI.Sprite.fromImage(name);
    };
};

/**
 * Get skin by component and state (or type)
 *
 * @method getSkin
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
 * @method removeTheme
 */
Theme.removeTheme = function() {
    PIXI_UI.theme = undefined;
};
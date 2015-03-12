/**
 * @author Andreas Bresser
 */

/**
 * base for all UI controls (see controls/)
 * based on pixi-DisplayContainer that supports adding children, so all
 * controls are container
 * @class Control
 * @constructor
 */

PIXI_UI.Control = function() {
    PIXI.DisplayObjectContainer.call(this);
    this.enabled = this.enabled !== false;
    // invalidate state so the control will be redrawn next time
    this.interactive = true;
};

PIXI_UI.Control.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI_UI.Control.prototype.constructor = PIXI_UI.Control;

/**
 * change the theme (every control can have a theme, even if it does not
 * inherit Skinable, e.g. if there is only some color in the skin that will
 * be taken)
 *
 * @method setTheme
 * @param theme the new theme {Theme}
 */
PIXI_UI.Control.prototype.setTheme = function(theme) {
    if (theme === this.theme && theme) {
        return;
    }

    this.theme = theme || PIXI_UI.theme;
    this.invalidSkin = true;
};

/**
 * Renders the object using the WebGL renderer
 *
 * @method _renderWebGL
 * @param renderSession {RenderSession}
 * @private
 */
/* istanbul ignore next */
PIXI_UI.Control.prototype._renderWebGL = function(renderSession) {
    this.redraw();
    return PIXI.DisplayObjectContainer.prototype._renderWebGL.call(this, renderSession);
};

/**
 * Renders the object using the Canvas renderer
 *
 * @method _renderWebGL
 * @param renderSession {RenderSession}
 * @private
 */
/* istanbul ignore next */
PIXI_UI.Control.prototype._renderCanvas = function(renderSession) {
    this.redraw();
    return PIXI.DisplayObjectContainer.prototype._renderCanvas.call(this, renderSession);
};

/**
 * get local mouse position from PIXI.InteractionData
 *
 * @method mousePos
 * @returns {x: Number, y: Number}
 */
PIXI_UI.Control.prototype.mousePos = function(e) {
    return e.getLocalPosition(e.target || this);
};

/**
 * update before draw call
 * redraw control for current state from theme
 *
 * @method redraw
 */
PIXI_UI.Control.prototype.redraw = function() {
};

/**
 * Enables/Disables the control.
 *
 * @property enabled
 * @type Boolean
 */
Object.defineProperty(PIXI_UI.Control.prototype, "enabled", {
    get: function() {
        return this._enabled;
    },
    set: function(value) {
        this._enabled = value;
    }
});
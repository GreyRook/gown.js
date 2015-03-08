/**
 * @author Andreas Bresser
 */

/**
 * The basic Text Input - based on PIXI.Input by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class Button
 * @constructor
 */
PIXI_UI.TextInput = function(theme) {
    this.skinName = this.skinName || PIXI_UI.TextInput.SKIN_NAME;
    this._validStates = this._validStates || PIXI_UI.TextInput.stateNames;
    PIXI_UI.Control.call(this, theme);
    this._currentState = 'background';
    this.invalidState = true;
};

PIXI_UI.TextInput.prototype = Object.create( PIXI_UI.Control.prototype );
PIXI_UI.TextInput.prototype.constructor = PIXI_UI.TextInput;

// name of skin that will be applied
PIXI_UI.TextInput.SKIN_NAME = 'text_input';

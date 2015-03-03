/**
 * @author Andreas Bresser
 */

/**
 * basic button that has a selected state which indicates if the button
 * is pressed or not.
 *
 * @class ToggleButton
 * @constructor
 */
PIXI_UI.ToggleButton = function (theme) {
    this.skinName = this.skinName || PIXI_UI.ToggleButton.SKIN_NAME;
    this._validStates = PIXI_UI.Button.stateNames.slice(0);
    this._validStates.push(PIXI_UI.ToggleButton.SELECTED_UP);
    this._validStates.push(PIXI_UI.ToggleButton.SELECTED_DOWN);
    this._validStates.push(PIXI_UI.ToggleButton.SELECTED_HOVER);
    PIXI_UI.Button.call(this, theme);

    /**
     * The pressed state of the Button
     *
     * @property selected
     * @type Boolean
     */
    this._selected = false;
};

PIXI_UI.ToggleButton.prototype = Object.create( PIXI_UI.Button.prototype );
PIXI_UI.ToggleButton.prototype.constructor = PIXI_UI.ToggleButton;

PIXI_UI.ToggleButton.SKIN_NAME = 'toggle_button';

PIXI_UI.ToggleButton.SELECTED_UP = 'selected_up';
PIXI_UI.ToggleButton.SELECTED_DOWN = 'selected_down';
PIXI_UI.ToggleButton.SELECTED_HOVER = 'selected_hover';

var originalCurrentState = Object.getOwnPropertyDescriptor(PIXI_UI.Button.prototype, 'currentState');

/**
 * The current state (one of _validStates)
 *
 * @property currentState
 * @type String
 */
Object.defineProperty(PIXI_UI.ToggleButton.prototype, 'currentState',{
    set: function(value) {
        if (this._selected) {
            value = 'selected_' + value;
        }
        originalCurrentState.set.call(this, value);
    }
});

/**
 * Indicate if the button is selected (pressed)
 *
 * @property selected
 * @type Boolean
 */
Object.defineProperty(PIXI_UI.ToggleButton.prototype, 'selected', {
    set: function(selected) {
        var state = this._currentState;
        this.invalidState = this._selected !== selected || this.invalidState;
        if (state.indexOf('selected_') === 0) {
            state = state.substr(9, state.length);
        }
        this._selected = selected;
        this._pressed = false; //to prevent toggling on touch/mouse up
        this.currentState = state;
    },
    get: function() {
        return this._selected;
    }
});

/**
 * toggle state
 */
PIXI_UI.ToggleButton.prototype.toggle = function() {
    this.selected = !this._selected;
};


PIXI_UI.ToggleButton.prototype.buttonHandleEvent = PIXI_UI.Button.prototype.handleEvent;

/**
 * handle Touch/Tab Event
 * @method handleEvent
 * @param {Object} type the type of the press/touch.
 * @protected
 **/
PIXI_UI.ToggleButton.prototype.handleEvent = function(type) {
    if (!this._enabled) {
        return;
    }

    if (type === PIXI_UI.Button.UP && this._pressed) {
        this.toggle();
    }
    this.buttonHandleEvent(type);
};

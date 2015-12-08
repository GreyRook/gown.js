var Button = require('./Button');

/**
 * basic button that has a selected state which indicates if the button
 * is pressed or not.
 *
 * @class ToggleButton
 * @extends GOWN.Button
 * @memberof GOWN
 * @constructor
 */
function ToggleButton(theme, skinName) {
    this.skinName = skinName || ToggleButton.SKIN_NAME;
    this._validStates = Button.stateNames.slice(0);
    this._validStates.push(ToggleButton.SELECTED_UP);
    this._validStates.push(ToggleButton.SELECTED_DOWN);
    this._validStates.push(ToggleButton.SELECTED_HOVER);
    Button.call(this, theme, this.skinName);

    /**
     * The pressed state of the Button
     *
     * @property selected
     * @type Boolean
     */
    this._selected = false;
}

ToggleButton.prototype = Object.create( Button.prototype );
ToggleButton.prototype.constructor = ToggleButton;
module.exports = ToggleButton;


ToggleButton.SKIN_NAME = 'toggle_button';

ToggleButton.SELECTED_UP = 'selected_up';
ToggleButton.SELECTED_DOWN = 'selected_down';
ToggleButton.SELECTED_HOVER = 'selected_hover';

var originalCurrentState = Object.getOwnPropertyDescriptor(Button.prototype, 'currentState');

/**
 * The current state (one of _validStates)
 *
 * @property currentState
 * @type String
 */
Object.defineProperty(ToggleButton.prototype, 'currentState',{
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
Object.defineProperty(ToggleButton.prototype, 'selected', {
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
ToggleButton.prototype.toggle = function() {
    this.selected = !this._selected;
};


ToggleButton.prototype.buttonHandleEvent = Button.prototype.handleEvent;

/**
 * handle Touch/Tab Event
 * @method handleEvent
 * @param {Object} type the type of the press/touch.
 * @protected
 **/
ToggleButton.prototype.handleEvent = function(type) {
    if (!this._enabled) {
        return;
    }

    if (type === Button.UP && this._pressed) {
        this.toggle();
    }
    this.buttonHandleEvent(type);
};

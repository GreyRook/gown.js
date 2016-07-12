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
    this._validStates = ToggleButton.stateNames;
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

/**
 * Dispatched when the button is selected or deselected either
 * programmatically or as a result of user interaction.The value of the
 * <code>selected</code> property indicates whether the button is selected.
 * or not.
 */
ToggleButton.CHANGE = 'change';

ToggleButton.SKIN_NAME = 'toggle_button';

ToggleButton.SELECTED_UP = 'selected_up';
ToggleButton.SELECTED_DOWN = 'selected_down';
ToggleButton.SELECTED_HOVER = 'selected_hover';

ToggleButton.stateNames = Button.stateNames.concat([
    ToggleButton.SELECTED_UP,
    ToggleButton.SELECTED_DOWN,
    ToggleButton.SELECTED_HOVER]);


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
        if (this._selected !== selected) {
            this._selected = selected;
            this.emit(ToggleButton.CHANGE, this, selected);
        }
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
    var pressedBefore = this._pressed;
    this.buttonHandleEvent(type);
    if (type === Button.UP && this._over && pressedBefore) {
        this.toggle();
    }
};

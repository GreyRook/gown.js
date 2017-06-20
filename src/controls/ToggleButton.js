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
    skinName = skinName || ToggleButton.SKIN_NAME;

    /**
     * The valid toggle button states
     *
     * @private
     * @type String[]
     * @default ToggleButton.stateNames
     */
    this._validStates = ToggleButton.stateNames;

    Button.call(this, theme, skinName);

    /**
     * The pressed state of the Button
     *
     * @private
     * @type Boolean
     * @default false
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
 *
 * @static
 * @final
 * @type String
 */
ToggleButton.CHANGE = 'change';

/**
 * Default toggle button skin name
 *
 * @static
 * @final
 * @type String
 */
ToggleButton.SKIN_NAME = 'toggle_button';

/**
 * Selected up state: mouse button is released or finger is removed from the screen + the toggle button is selected
 *
 * @static
 * @final
 * @type String
 */
ToggleButton.SELECTED_UP = 'selected_up';

/**
 * Selected down state: mouse button is pressed or finger touches the screen + the toggle button is selected
 *
 * @static
 * @final
 * @type String
 */
ToggleButton.SELECTED_DOWN = 'selected_down';

/**
 * Selected hover state: mouse pointer hovers over the button + the toggle button is selected
 * (ignored on mobile)
 *
 * @static
 * @final
 * @type String
 */
ToggleButton.SELECTED_HOVER = 'selected_hover';

/**
 * Names of possible states for a toggle button
 *
 * @static
 * @final
 * @type String[]
 * @private
 */
ToggleButton.stateNames = Button.stateNames.concat([
    ToggleButton.SELECTED_UP,
    ToggleButton.SELECTED_DOWN,
    ToggleButton.SELECTED_HOVER]);

/**
 * @private
 */
var originalCurrentState = Object.getOwnPropertyDescriptor(Button.prototype, 'currentState');

/**
 * The current state
 *
 * @name GOWN.ToggleButton#currentState
 * @type String
 */
Object.defineProperty(ToggleButton.prototype, 'currentState',{
    get: function() {
        return this._currentState;
    },
    set: function(value) {
        if (this._selected) {
            value = 'selected_' + value;
        }
        originalCurrentState.set.call(this, value);
    }
});

/**
 * Set the selection state
 *
 * @param selected value of selection {bool}
 * @param [emit] set to true if you want to emit the change signal
 *        (used to prevent infinite loop in ToggleGroup) {bool}
 * @private
 */
ToggleButton.prototype.setSelected = function(selected, emit) {
    var state = this._currentState;
    this.invalidState = this._selected !== selected || this.invalidState;
    if (state.indexOf('selected_') === 0) {
        state = state.substr(9, state.length);
    }
    if (this._selected !== selected) {
        this._selected = selected;
        if (emit) {
            this.emit(ToggleButton.CHANGE, this, selected);
        }
    }
    this._pressed = false; //to prevent toggling on touch/mouse up
    this.currentState = state;
};

/**
 * Indicate if the button is selected (pressed)
 *
 * @name GOWN.ToggleButton#selected
 * @type Boolean
 * @default false
 */
Object.defineProperty(ToggleButton.prototype, 'selected', {
    set: function(selected) {
        this.setSelected(selected, true);
    },
    get: function() {
        return this._selected;
    }
});

/**
 * Toggle the state
 */
ToggleButton.prototype.toggle = function() {
    this.selected = !this._selected;
};

/**
 * @private
 */
ToggleButton.prototype.buttonHandleEvent = Button.prototype.handleEvent;

/**
 * handle the touch/tap event
 *
 * @param type the type of the press/touch. {Object}
 * @protected
 **/
ToggleButton.prototype.handleEvent = function(type) {
    if (!this._enabled) {
        return;
    }
    this.buttonHandleEvent(type);
    if (type === Button.UP && this._over) {
        this.toggle();
    }
};

/**
 * The fallback skin if the other skin does not exist (e.g. if a mobile theme
 * that does not provide a "hover" state is used on a desktop system)
 *
 * @name GOWN.ToggleButton#skinFallback
 * @type String
 */
Object.defineProperty(ToggleButton.prototype, 'skinFallback', {
    get: function() {
        var selected = '';
        if (this._currentState && this._currentState.indexOf('selected_') === 0) {
            selected = 'selected_';
        }
        return selected + this._skinFallback;
    },
    set: function(value) {
        this._skinFallback = value;
    }
});

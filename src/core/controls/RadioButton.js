var Skinable = require('../Skinable');

/**
 * The basic RadioButton with 4 normal states (up, down, hover, and disable)
 * and 4 selected states (selected_up, selected_down, selected_hover, and selected_disable)
 *
 * @class RadioButton
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 */
function RadioButton(preselected, disabled, text, theme, skinName) {
	//TODO: add a disable field;
    this.skinName = skinName || RadioButton.SKIN_NAME;
    this._validStates = this._validStates || RadioButton.stateNames.concat(RadioButton.selectedStateNames);
    Skinable.call(this, theme);

    this.disabled = disabled || false;

    this.updateLabel = false;

    this._currentState = (this.disabled) ? RadioButton.DISABLE : RadioButton.UP;

    this.labelText = new PIXI.Text((text) ? text : "", this.theme.textStyle.clone());
    this.labelText.width = 300;

    this.labelText.x = 20;
    this.addChild(this.labelText);

    // Disable overrides the fact the radio button can be selected as true
    this.selected =(this.disabled) ? false : preselected || false;
    this._mousedown = false;

    this.touchstart = this.mousedown;
    this.touchend = this.mouseupoutside = this.mouseup;
    this.touchendoutside = this.mouseout;

    this._toggleGroup = null;
}

RadioButton.prototype = Object.create( Skinable.prototype );
RadioButton.prototype.constructor = RadioButton;
module.exports = RadioButton;

// name of skin that will be applied
RadioButton.SKIN_NAME = 'radiobutton';

// the states of the checkbox as constants
RadioButton.UP = 'up';
RadioButton.DOWN = 'down';
RadioButton.HOVER = 'hover';
RadioButton.DISABLE = 'disable';

// the states of the checkbox in the 'selected' state as constants
RadioButton.SELECTED_UP = 'selected_up';
RadioButton.SELECTED_DOWN = 'selected_down';
RadioButton.SELECTED_HOVER = 'selected_hover';
RadioButton.SELECTED_DISABLE = 'selected_disable';

// the list of non-selected states
RadioButton.stateNames = [
    RadioButton.UP,
    RadioButton.DOWN,
    RadioButton.HOVER,
    RadioButton.DISABLE
];

// the list of selected states
RadioButton.selectedStateNames = [
    RadioButton.SELECTED_UP,
    RadioButton.SELECTED_DOWN,
    RadioButton.SELECTED_HOVER,
    RadioButton.SELECTED_DISABLE
];

RadioButton.prototype.mousedown = function() {
    this.handleEvent(RadioButton.DOWN);
};

RadioButton.prototype.mouseup = function() {
    this.handleEvent(RadioButton.UP);
};

RadioButton.prototype.mousemove = function() {
};

RadioButton.prototype.mouseover = function() {
    this.handleEvent(RadioButton.HOVER);
};

RadioButton.prototype.mouseout = function() {
    this.handleEvent('out');
};

/**
 * initiate all skins first
 * (to prevent flickering)
 *
 * @method preloadSkins
 */
RadioButton.prototype.preloadSkins = function() {
    for (var i = 0; i < this._validStates.length; i++) {
        var name = this._validStates[i];
        var skin = this.theme.getSkin(this.skinName, name);
        this.skinCache[name] = skin;
        if (skin) {
            this.addChildAt(skin, 0);
            skin.alpha = 0.0;
            if (this.width) {
                skin.width = this.width;
            }
            if (this.height) {
                skin.height = this.height;
            }
        }
    }
};

/**
 * The current state (one of _validStates)
 *
 * @property currentState
 * @type String
 */
Object.defineProperty(RadioButton.prototype, 'currentState',{
    get: function() {
        return this._currentState;
    },
    set: function(value) {
        if (this.disabled) {
            return;
        }

        if (this._currentState === value) {
            return;
        }
        if (this._validStates.indexOf(value) < 0) {
            throw new Error('Invalid state: ' + value + '.');
        }
        this._currentState = value;
        this.invalidState = true;
    }
});

/**
 * Indicate if the radiobox is selected (checked)
 *
 * @property selected
 * @type Boolean
 */
Object.defineProperty(RadioButton.prototype, 'selected', {
    set: function(selected) {
        var state = this._currentState;
        var index;
        if ((RadioButton.selectedStateNames.indexOf(state) >= 0) && !selected) {
            index = RadioButton.selectedStateNames.indexOf(state);
            state = RadioButton.stateNames[index];
        } else if ((RadioButton.stateNames.indexOf(state) >= 0) && selected) {
            index = RadioButton.stateNames.indexOf(state);
            state = RadioButton.selectedStateNames[index];
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
 * Indicate the ToggleGroup the Radio Button is associated to
 *
 * @property toggleGroup
 * @type ToggleGroup object
 */
Object.defineProperty(RadioButton.prototype, 'toggleGroup', {
    set: function(toggleGroup) {
        if (this._toggleGroup) {
            toggleGroup.remove(this);
        }
        toggleGroup.add(this);
        this._toggleGroup = toggleGroup;
    },
    get: function() {
        return this._toggleGroup;
    }
});

/**
 * Indicate whether or not the Radio Button is disabled
 *
 * @property disable
 * @type Boolean
 */
Object.defineProperty(RadioButton.prototype, 'disable', {
    set: function(isDisable) {
        this.disabled = isDisable;
        this._currentState = (isDisable) ? RadioButton.DISABLE : RadioButton.UP;
        this.selected = (isDisable) ? false : this.selected;
    },
    get: function() {
        return this.disabled;
    }
});

RadioButton.prototype.toggleSelected = function () {
    if (!this.selected && !this.disable) {
        this.selected = !this.selected;
        if (this._toggleGroup) {
            this._toggleGroup.select(this);
        }
	    if (this.change) {
	        this.change(this.selected);
	    }
	}
};

RadioButton.prototype.handleEvent = function (type) {
    switch (type) {
    	// Ignore the Disable state
        case RadioButton.UP:
            if (this._mousedown) {
                this._mousedown = false;
                this.toggleSelected();
                this.currentState = this.selected ? RadioButton.SELECTED_UP : RadioButton.UP;
            }
            break;
        case RadioButton.DOWN:
            if (!this._mousedown) {
                this._mousedown = true;
                this.currentState = this.selected ? RadioButton.SELECTED_DOWN : RadioButton.DOWN;
            }
            break;
        case RadioButton.HOVER:
            if (!this._mousedown) {
                this.currentState = this.selected ? RadioButton.SELECTED_HOVER : RadioButton.HOVER;
            }
            break;
        case 'out':
            this.currentState = this.selected ? RadioButton.SELECTED_UP : RadioButton.UP;
            break;
        default:
            break;
    }
};

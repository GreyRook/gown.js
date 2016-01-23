var Skinable = require('../Skinable');

/**
 * The basic CheckBox with 3 normal states (up, down and hover)
 * and 3 selected states (selected_up, selected_down and selected_hover)
 *
 * @class CheckBox
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 */
function CheckBox(preselected, theme, skinName) {
    this.skinName = skinName || CheckBox.SKIN_NAME;
    this._validStates = this._validStates || CheckBox.stateNames.concat(CheckBox.selectedStateNames);
    Skinable.call(this, theme);

    this._currentState = 'up';
    this.selected = preselected || false;
    this._mousedown = false;

    this.touchstart = this.mousedown;
    this.touchend = this.mouseupoutside = this.mouseup;
    this.touchendoutside = this.mouseout;
}

CheckBox.prototype = Object.create( Skinable.prototype );
CheckBox.prototype.constructor = CheckBox;
module.exports = CheckBox;

// name of skin that will be applied
CheckBox.SKIN_NAME = 'checkbox';

// the states of the checkbox as constants
CheckBox.UP = 'up';
CheckBox.DOWN = 'down';
CheckBox.HOVER = 'hover';

// the states of the checkbox in the 'selected' state as constants
CheckBox.SELECTED_UP = 'selected_up';
CheckBox.SELECTED_DOWN = 'selected_down';
CheckBox.SELECTED_HOVER = 'selected_hover';

// the list of non-selected states
CheckBox.stateNames = [
    CheckBox.UP,
    CheckBox.DOWN,
    CheckBox.HOVER
];

// the list of selected states
CheckBox.selectedStateNames = [
    CheckBox.SELECTED_UP,
    CheckBox.SELECTED_DOWN,
    CheckBox.SELECTED_HOVER
];

CheckBox.prototype.mousedown = function() {
    this.handleEvent(CheckBox.DOWN);
};

CheckBox.prototype.mouseup = function() {
    this.handleEvent(CheckBox.UP);
};

CheckBox.prototype.mousemove = function() {
};

CheckBox.prototype.mouseover = function() {
    this.handleEvent(CheckBox.HOVER);
};

CheckBox.prototype.mouseout = function() {
    this.handleEvent('out');
};

/**
 * initiate all skins first
 * (to prevent flickering)
 *
 * @method preloadSkins
 */
CheckBox.prototype.preloadSkins = function() {
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
Object.defineProperty(CheckBox.prototype, 'currentState',{
    get: function() {
        return this._currentState;
    },
    set: function(value) {
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
 * Indicate if the checkbox is selected (checked)
 *
 * @property selected
 * @type Boolean
 */
Object.defineProperty(CheckBox.prototype, 'selected', {
    set: function(selected) {
        var state = this._currentState;
        var index;
        if ((CheckBox.selectedStateNames.indexOf(state) >= 0) && !selected) {
            index = CheckBox.selectedStateNames.indexOf(state);
            state = CheckBox.stateNames[index];
        } else if ((CheckBox.stateNames.indexOf(state) >= 0) && selected) {
            index = CheckBox.stateNames.indexOf(state);
            state = CheckBox.selectedStateNames[index];
        }

        this._selected = selected;
        this._pressed = false; //to prevent toggling on touch/mouse up
        this.currentState = state;
    },
    get: function() {
        return this._selected;
    }
});

CheckBox.prototype.toggleSelected = function () {
    this.selected = !this.selected;
    if (this.change) {
        this.change(this.selected);
    }
};

CheckBox.prototype.handleEvent = function (type) {
    switch (type) {
        case CheckBox.UP:
            if (this._mousedown) {
                this._mousedown = false;
                this.toggleSelected();
                this.currentState = this.selected ? CheckBox.SELECTED_UP : CheckBox.UP;
            }
            break;
        case CheckBox.DOWN:
            if (!this._mousedown) {
                this._mousedown = true;
                this.currentState = this.selected ? CheckBox.SELECTED_DOWN : CheckBox.DOWN;
            }
            break;
        case CheckBox.HOVER:
            if (!this._mousedown) {
                this.currentState = this.selected ? CheckBox.SELECTED_HOVER : CheckBox.HOVER;
            }
            break;
        case 'out':
            this.currentState = this.selected ? CheckBox.SELECTED_UP : CheckBox.UP;
            break;
        default:
            break;
    }
};

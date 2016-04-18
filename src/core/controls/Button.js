var Skinable = require('../Skinable');

/**
 * The basic Button with 3 states (up, down and hover) and a label that is
 * centered on it
 *
 * @class Button
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 */
function Button(theme, skinName) {
    this.skinName = skinName || Button.SKIN_NAME;
    this._validStates = this._validStates || Button.stateNames;
    Skinable.call(this, theme);
    this.handleEvent('up');

    this.updateLabel = false; // label text changed

    this.touchstart = this.mousedown;
    this.touchend = this.mouseupoutside = this.mouseup;
    this.touchendoutside = this.mouseout;
}

Button.prototype = Object.create( Skinable.prototype );
Button.prototype.constructor = Button;
module.exports = Button;

// name of skin that will be applied
Button.SKIN_NAME = 'button';

// Identifier for the different button states
/**
 * Up state: mouse button is released or finger is removed from the screen
 *
 * @property UP
 * @static
 * @final
 * @type String
 */
Button.UP = 'up';

/**
 * Down state: mouse button is pressed or finger touches the screen
 *
 * @property DOWN
 * @static
 * @final
 * @type String
 */
Button.DOWN = 'down';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @property HOVER
 * @static
 * @final
 * @type String
 */
Button.HOVER = 'hover';

/**
 * names of possible states for a button
 *
 * @property stateNames
 * @static
 * @final
 * @type String
 */
Button.stateNames = [
    Button.DOWN, Button.HOVER, Button.UP
];

/**
 * initiate all skins first
 * (to prevent flickering)
 *
 * @method preloadSkins
 */
Button.prototype.preloadSkins = function() {
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

Button.prototype.mousedown = function() {
    this.handleEvent(Button.DOWN);
};

Button.prototype.mouseup = function() {
    this.handleEvent(Button.UP);
};

Button.prototype.mousemove = function() {
};

Button.prototype.mouseover = function() {
    this.handleEvent(Button.HOVER);
};

Button.prototype.mouseout = function() {
    this.handleEvent('out');
};


/**
 * update width/height of the button
 *
 * @method updateDimensions
 */
Button.prototype.updateDimensions = function() {
    var width = this.worldWidth;
    var height = this.worldHeight;
    if (this.hitArea) {
        this.hitArea.width = width;
        this.hitArea.height = height;
    } else {
        this.hitArea = new PIXI.Rectangle(0, 0, width, height);
    }
    for (var i = 0; i < this._validStates.length; i++) {
        var name = this._validStates[i];
        var skin = this.skinCache[name];
        if (skin) {
            skin.width = width;
            skin.height = height;
        }
    }

    if(this.labelText) {
        var scaleY = height / this._height;
        this.labelText.style.fontSize = this.theme.textStyle.fontSize * scaleY;
        this.labelText.style = this.labelText.style; // trigger setter
        this.updateLabelDimensions();
    }
};

/**
 * handle one of the mouse/touch events
 *
 * @method handleEvent
 * @param type one of the valid states
 */
Button.prototype.handleEvent = function(type) {
    if (!this._enabled) {
        return;
    }
    if (type === Button.DOWN) {
        this.currentState = Button.DOWN;
        this._pressed = true;
    } else if (type === Button.UP) {
        this._pressed = false;
        if (this._over && this.theme.hoverSkin) {
            this.currentState = Button.HOVER;
        } else {
            this.currentState = Button.UP;
        }
    } else if (type === Button.HOVER) {
        this._over = true;
        if (this._pressed) {
            this.currentState = Button.DOWN;
        } else if (this.theme.hoverSkin) {
            this.currentState = Button.HOVER;
        }
    } else  { // type === rollout and default
        if (this._over) {
            this._over = false;
        }
        this.currentState = Button.UP;
    }
};

// performance increase to avoid using call.. (10x faster)
Button.prototype.redrawSkinable = Skinable.prototype.redraw;

/**
 * update before draw call (position label)
 *
 * @method redraw
 */
Button.prototype.redraw = function() {
    if (this.updateLabel) {
        this.createLabel();
    }
    this.redrawSkinable();
};

/**
 * create/update a label for this button
 *
 * @method createLabel
 */
Button.prototype.createLabel = function() {
    if(this.labelText) {
        this.labelText.text = this._label;
        this.labelText.style = this.theme.textStyle.clone();
    } else {
        this.labelText = new PIXI.Text(this._label, this.theme.textStyle.clone());
        this.addChild(this.labelText);
    }
    this.updateLabelDimensions();
    this.updateLabel = false;
};

/**
 * create/update the position of the label
 *
 * @method updateLabelDimensions
 */
Button.prototype.updateLabelDimensions = function () {
    if (this.labelText && this.labelText.text && 
        (this.worldWidth - this.labelText.width) >= 0 &&
        (this.worldHeight - this.labelText.height) >= 0) {
        this.labelText.x = Math.floor((this.worldWidth - this.labelText.width) / 2);
        this.labelText.y = Math.floor((this.worldHeight - this.labelText.height) / 2);
    }
};

Button.prototype.skinableSetTheme = Skinable.prototype.setTheme;

/**
 * change the theme
 *
 * @method setTheme
 * @param theme the new theme {Theme}
 */
Button.prototype.setTheme = function(theme) {
    // this theme has other font or color settings - update the label
    if (this.labelText) {
        this.updateLabel = (this.updateLabel ||
            this.labelText.font !== this.theme.labelFont ||
            this.labelText.color !== this.theme.labelColor );
    }
    this.skinableSetTheme(theme);
};


/**
 * The current state (one of _validStates)
 *
 * @property currentState
 * @type String
 */
Object.defineProperty(Button.prototype, 'currentState',{
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
        // invalidate state so the next draw call will redraw the control
        this.invalidState = true;
    }
});

/**
 * Create/Update the label of the button.
 *
 * @property label
 * @type String
 */
Object.defineProperty(Button.prototype, 'label', {
    get: function() {
        return this._label;
    },
    set: function(label) {
        if(this._label === label) {
            return;
        }
        this._label = label;
        this.updateLabel = true;
    }
});

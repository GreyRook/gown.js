/**
 * @author Andreas Bresser
 */

/**
 * The basic Button with 3 states (up, down and hover) and a label that is
 * centered on it
 *
 * @class Button
 * @constructor
 */
PIXI_UI.Button = function(theme) {
    this.skinName = this.skinName || PIXI_UI.Button.SKIN_NAME;
    this._validStates = this._validStates || PIXI_UI.Button.stateNames;
    PIXI_UI.Skinable.call(this, theme);
    this.handleEvent('up');
    var scope = this;
    this.updateLabel = false; // label text changed
    this.touchstart = this.mousedown = function() {
        scope.handleEvent(PIXI_UI.Button.DOWN);
    };
    this.touchend = this.mouseupoutside = this.mouseup = function() {
        scope.handleEvent(PIXI_UI.Button.UP);
    };
    this.mouseover = function() {
        scope.handleEvent(PIXI_UI.Button.HOVER);
    };
    this.mouseout = this.touchendoutside = function() {
        scope.handleEvent('out');
    };
};

PIXI_UI.Button.prototype = Object.create( PIXI_UI.Skinable.prototype );
PIXI_UI.Button.prototype.constructor = PIXI_UI.Button;


// name of skin that will be applied
PIXI_UI.Button.SKIN_NAME = 'button';

// Identifier for the different button states
/**
 * Up state: mouse button is released or finger is removed from the screen
 *
 * @property UP
 * @static
 * @final
 * @type String
 */
PIXI_UI.Button.UP = 'up';

/**
 * Down state: mouse button is pressed or finger touches the screen
 *
 * @property DOWN
 * @static
 * @final
 * @type String
 */
PIXI_UI.Button.DOWN = 'down';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @property HOVER
 * @static
 * @final
 * @type String
 */
PIXI_UI.Button.HOVER = 'hover';

/**
 * names of possible states for a button
 *
 * @property stateNames
 * @static
 * @final
 * @type String
 */
PIXI_UI.Button.stateNames = [
    PIXI_UI.Button.DOWN, PIXI_UI.Button.HOVER, PIXI_UI.Button.UP
];

/**
 * initiate all skins first
 * (to prevent flickering)
 *
 * @method preloadSkins
 */
PIXI_UI.Button.prototype.preloadSkins = function() {
    for (var i = 0; i < this._validStates.length; i++) {
        var name = this._validStates[i];
        var skin = this.theme.getSkin(this.skinName, name);
        this.skinCache[name] = skin;
        if (skin) {
            this.addChildAt(skin, 0);
            skin.alpha = 0.0;
        }
    }
};

/**
 * update width/height of the button
 *
 * @method updateDimensions
 */
PIXI_UI.Button.prototype.updateDimensions = function() {
    if (this.hitArea) {
        this.hitArea.width = this.width;
        this.hitArea.height = this.height;
    } else {
        this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    }
    for (var i = 0; i < this._validStates.length; i++) {
        var name = this._validStates[i];
        var skin = this.skinCache[name];
        if (skin) {
            skin.width = this.width;
            skin.height = this.height;
        }
    }
};

/**
 * handle one of the mouse/touch events
 *
 * @method handleEvent
 * @param type one of the valid states
 */
PIXI_UI.Button.prototype.handleEvent = function(type) {
    if (!this._enabled) {
        return;
    }
    if (type === PIXI_UI.Button.DOWN) {
        this.currentState = PIXI_UI.Button.DOWN;
        this._pressed = true;
    } else if (type === PIXI_UI.Button.UP) {
        this._pressed = false;
        if (this._over) {
            this.currentState = PIXI_UI.Button.HOVER;
        } else {
            this.currentState = PIXI_UI.Button.UP;
        }
    } else if (type === PIXI_UI.Button.HOVER) {
        this._over = true;
        if (this._pressed) {
            this.currentState = PIXI_UI.Button.DOWN;
        } else {
            this.currentState = PIXI_UI.Button.HOVER;
        }
    } else  { // type === rollout and default
        if (this._over) {
            this._over = false;
        }
        this.currentState = PIXI_UI.Button.UP;
    }
};

// performance increase to avoid using call.. (10x faster)
PIXI_UI.Button.prototype.redrawSkinable = PIXI_UI.Skinable.prototype.redraw;

/**
 * update before draw call (position label)
 *
 * @method redraw
 */
PIXI_UI.Button.prototype.redraw = function() {
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
PIXI_UI.Button.prototype.createLabel = function() {
    if(this.labelText) {
        this.labelText.text = this._label;
        this.labelText.style = this.theme.textStyle;
    } else {
        this.labelText = new PIXI.Text(this._label, this.theme.textStyle);
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
PIXI_UI.Button.prototype.updateLabelDimensions = function () {
    if (this.labelText && this.labelText.text) {
        this.labelText.x = Math.floor((this.width - this.labelText.width) / 2);
        this.labelText.y = Math.floor((this.height - this.labelText.height) / 2);
    }
};

PIXI_UI.Button.prototype.skinableSetTheme = PIXI_UI.Skinable.prototype.setTheme;

/**
 * change the theme
 *
 * @method setTheme
 * @param theme the new theme {Theme}
 */
PIXI_UI.Button.prototype.setTheme = function(theme) {
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
Object.defineProperty(PIXI_UI.Button.prototype, 'currentState',{
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
 * The width of the shape, setting this will redraw the component.
 * (set invalidDimensions)
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI_UI.Button.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(width) {
        this._width = width;
        this.invalidDimensions = true;
    }
});

/**
 * The height of the shape, setting this will redraw the component.
 * (set invalidDimensions)
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI_UI.Button.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(height) {
        this._height = height;
        this.invalidDimensions = true;
    }
});

/**
 * Create/Update the label of the button.
 *
 * @property label
 * @type String
 */
Object.defineProperty(PIXI_UI.Button.prototype, 'label', {
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
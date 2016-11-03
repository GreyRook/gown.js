var Skinable = require('../core/Skinable');

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
    Skinable.call(this, theme);
    this._validStates = this._validStates || Button.stateNames;
    this.skinName = skinName || Button.SKIN_NAME;

    this.handleEvent(Button.UP);

    this.updateLabel = true; // label text changed

    this.on('touchstart', this.onDown, this);
    this.on('mousedown', this.onDown, this);

    this.on('mouseover', this.onHover, this);
    this.on('touchmove', this.onTouchMove, this);
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
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @property HOVER
 * @static
 * @final
 * @type String
 */
Button.OUT = 'out';

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

// triggered event name for button
Button.TRIGGERED = 'triggered';

/**
 * initiate all skins first
 * (to prevent flickering)
 *
 * @method preloadSkins
 */
Button.prototype.preloadSkins = function() {
    if (!this._validStates) {
        return;
    }
    for (var i = 0; i < this._validStates.length; i++) {
        var name = this._validStates[i];
        this.fromSkin(name, this.skinLoaded);
    }
};

/**
 * skin has been loaded (see preloadSkins) and stored into the skinCache.
 * add to container, hide and resize
 *
 * @method skinLoaded
 */
Button.prototype.skinLoaded = function(skin) {
    this.addChildAt(skin, 0);
    skin.alpha = 0.0;
    if (this.width) {
        skin.width = this.width;
    } else if (skin.minWidth) {
        this.width = skin.width = skin.minWidth;
    }
    if (this.height) {
        skin.height = this.height;
    } else if (skin.minHeight) {
        this.height = skin.height = skin.minHeight;
    }
};

Button.prototype.onDown = function() {
    this.handleEvent(Button.DOWN);
    this.on('touchend', this.onUp, this);
    this.on('mouseupoutside', this.onUp, this);
    this.on('mouseup', this.onUp, this);

    this.on('touchendoutside', this.onOut, this);
    this.on('mouseout', this.onOut, this);
};

Button.prototype.onUp = function() {
    this.handleEvent(Button.UP);
    this.off('touchend', this.onUp, this);
    this.off('mouseupoutside', this.onUp, this);
    this.off('mouseup', this.onUp, this);
};

Button.prototype.onHover = function() {
    this.handleEvent(Button.HOVER);
    this.on('touchendoutside', this.onOut, this);
    this.on('mouseout', this.onOut, this);
};

Button.prototype.onOut = function() {
    this.handleEvent(Button.OUT);
    this.off('touchendoutside', this.onOut, this);
    this.off('mouseout', this.onOut, this);
};

Button.prototype.onTouchMove = function(eventData) {
    // TODO: this still behaves strange:
    //       if you touch down a button and move your finger around the button
    //       gets deselected, even if you are on the button
    if (eventData.data.target === this) {
        this.handleEvent(Button.HOVER);
    }
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
        var style = this._textStyle || this.theme.textStyle;
        style.fontSize = style.fontSize * scaleY;
        this.labelText.style = style; // trigger setter
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
        // click / touch DOWN so the button is pressed and the pointer has to
        // be over the Button
        this._pressed = true;
        this._over = true;
    } else if (type === Button.UP) {
        this._pressed = false;

        if (this._over) {
            // the user taps or clicks the button
            this.emit(Button.TRIGGERED, this);
            if (this.theme.hoverSkin) {
                this.currentState = Button.HOVER;
            }
        } else {
            // user releases the mouse / touch outside of the button boundaries
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
        this.labelText.style = this._textStyle || this.theme.textStyle.clone();
    } else {
        this.labelText = new PIXI.Text(
            this._label,
            this._textStyle || this.theme.textStyle.clone());
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
 * TODO: move to skinable?
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

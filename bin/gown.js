(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GOWN = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * base for all UI controls (see controls/)
 * based on pixi-DisplayContainer that supports adding children, so all
 * controls are container
 * @class Control
 * @extends PIXI.Container
 * @memberof GOWN
 * @constructor
 */
function Control() {
    PIXI.Container.call(this);
    this.enabled = this.enabled !== false;
    // assume all controls are interactive
    this.interactive = true;
}

Control.prototype = Object.create( PIXI.Container.prototype );
Control.prototype.constructor = Control;
module.exports = Control;

/**
 * change the theme (every control can have a theme, even if it does not
 * inherit Skinable, e.g. if there is only some color in the skin that will
 * be taken)
 *
 * @method setTheme
 * @param theme the new theme {Theme}
 */
Control.prototype.setTheme = function(theme) {
    if (theme === this.theme && theme) {
        return;
    }

    this.theme = theme;
    this.invalidSkin = true;
};

/**
 * PIXI method to update the object transform for rendering
 * Used to call redraw() before rendering
 *
 * @method updateTransform
 */
Control.prototype.updateTransform = function() {
    if(this.redraw) {
        this.redraw();
    }

    PIXI.Container.prototype.updateTransform.call(this);
};

/**
 * get local mouse position from PIXI.InteractionData
 *
 * @method mousePos
 * @returns {PIXI.Point}
 */
Control.prototype.mousePos = function(e) {
    return e.data.getLocalPosition(this);
};

/**
 * update before draw call
 * redraw control for current state from theme
 *
 * @method redraw
 */
Control.prototype.redraw = function() {
};

/**
 * Enables/Disables the control.
 * (not implemented yet)
 *
 * @property enabled
 * @type Boolean
 */
Object.defineProperty(Control.prototype, 'enabled', {
    get: function() {
        return this._enabled;
    },
    set: function(value) {
        this._enabled = value;
    }
});


//var originalWidth = Object.getOwnPropertyDescriptor(PIXI.DisplayObjectContainer.prototype, 'width');

/**
 * The width of the shape, setting this will redraw the component.
 * (set redraw)
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Control.prototype, 'width', {
    get: function() {
        return this._width;
        //return originalWidth.get.call(this);
    },
    set: function(width) {
        this._width = width;
        //originalWidth.set.call(this, width);
    }
});

//var originalHeight = Object.getOwnPropertyDescriptor(PIXI.DisplayObjectContainer.prototype, 'height');

/**
 * The height of the shape, setting this will redraw the component.
 * (set redraw)
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Control.prototype, 'height', {
    get: function() {
        //return originalHeight.get.call(this);
        return this._height;
    },
    set: function(height) {
        //originalHeight.set.call(this, height);
        this._height = height;
    }
});

},{}],2:[function(require,module,exports){
var Control = require('./Control');
var resizeScaling = require('../utils/resizeScaling');
var mixin = require('../utils/mixin');

/**
 * Control that requires a theme (e.g. a button)
 *
 * @class Skinable
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 */
function Skinable(theme) {
    Control.call(this);
    this.skinCache = {};
    this.setTheme(theme || GOWN.theme);

    if (this.theme === undefined) {
        throw new Error('you need to define a theme first');
    }

    // invalidate state so the control will be redrawn next time
    this.invalidState = true; // draw for the first time

    this.initResizeScaling();
}

Skinable.prototype = Object.create( Control.prototype );
Skinable.prototype.constructor = Skinable;
module.exports = Skinable;

Skinable.prototype.controlSetTheme = Control.prototype.setTheme;
/**
 * change the theme
 *
 * @method setTheme
 * @param theme the new theme {Theme}
 */
Skinable.prototype.setTheme = function(theme) {
    if (theme === this.theme && theme) {
        return;
    }

    this.controlSetTheme(theme);
    this.preloadSkins();
    // force states to redraw
    this.invalidState = true;
};

/**
 * remove old skin and add new one
 *
 * @method changeSkin
 * @param skin {DisplayObject}
 */
Skinable.prototype.changeSkin = function(skin) {
    if (this._currentSkin !== skin) {
        this._lastSkin = this._currentSkin;
        this.addChildAt(skin, 0);
        skin.alpha = 1.0;
        this._currentSkin = skin;

    }
    this.invalidState = false;
};

/**
 * initiate all skins first
 *
 * @method preloadSkins
 */
Skinable.prototype.preloadSkins = function() {
};

/**
 * get image from skin (will execute a callback with the loaded skin
 * when it is loaded or call it directly when it already is loaded)
 *
 * @method fromSkin
 * @param name name of the state
 * @param callback callback that is executed if the skin is loaded
 */
Skinable.prototype.fromSkin = function(name, callback) {
    var skin;
    if (this.skinCache[name]) {
        skin = this.skinCache[name];
    } else {
        skin = this.theme.getSkin(this.skinName, name);
        this.skinCache[name] = skin;
    }
    if (skin) {
        callback.call(this, skin);
    }
    // TODO: what, if the skin is not loaded jet? --> execute callback after load
};


mixin(Skinable.prototype, resizeScaling);

/**
 * change the skin name
 * You normally set the skin name as constant in your control, but if you
 * want you can set another skin name to change skins for single components
 * at runtime.
 *
 * @property skinName
 * @type String
 */
Object.defineProperty(Skinable.prototype, 'skinName', {
    get: function() {
        return this._skinName;
    },
    set: function(value) {
        if ( this._skinName === value ) {
            return;
        }
        this._skinName = value;
        this.invalidState = true;
    }
});

},{"../utils/mixin":36,"../utils/resizeScaling":39,"./Control":1}],3:[function(require,module,exports){
var Control = require('../Control');

/**
 * entry point for your application, makes some assumptions, (e.g. that you
 * always want fullscreen) and shortcuts some fancy stuff like a gradient
 * background.
 *
 * @class Application
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 * @param background {Number | Array} a background color or a list of colors
 *  that will be used as vertical gradient
 * @param fullscreen {Boolean}
 * @param renderer {WebGLRenderer|CanvasRenderer}
 * @param stage {Stage}
 */
function Application(background, fullscreen, renderer, stage) {
    if (!stage || !renderer) {
        stage = new PIXI.Container();
        var width = 800;
        var height = 600;
        if (fullscreen) {
            width = window.innerWidth;
            height = window.innerHeight;
        }
        renderer = PIXI.autoDetectRenderer(
            width, height, {backgroundColor : 0xffffff});
        document.body.appendChild(renderer.view);
    }
    /* jshint ignore:start */
    this._stage = stage;
    this._renderer = renderer;
    /* jshint ignore:end */
    this._width = renderer.width;
    this._height = renderer.height;

    Control.call(this);
    stage.addChild(this);
    this.animate();

    this.background = background;
    this.fullscreen = fullscreen || false;
}

Application.prototype = Object.create( Control.prototype );
Application.prototype.constructor = Application;
module.exports = Application;

/**
 * call requestAnimationFrame to render the application at max. FPS
 *
 * @method animate
 */
/* jshint ignore:start */
Application.prototype.animate = function() {
    var renderer = this._renderer;
    var stage = this._stage;
    var animate = function() {
        renderer.render(stage);
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
};
/* jshint ignore:end */

/**
 * creates a gradient rect that can be used as background
 * (uses a separate canvas to create a new Texture)
 *
 * @method _createGradientRect
 * @private
 */
Application.prototype._createGradientRect = function(gradient, width, height) {
    var bgCanvas = document.createElement('canvas');
    bgCanvas.width = width || 256;
    bgCanvas.height = height || 256;
    var ctx = bgCanvas.getContext('2d');
    var linearGradient = ctx.createLinearGradient(0, 0, 0, bgCanvas.height);
    for (var i = 0; i < gradient.length; i++) {
        linearGradient.addColorStop(i, gradient[i]);
    }
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    return PIXI.Texture.fromCanvas(bgCanvas);
};

/**
 * clean application: remove event listener, free memory
 * (can also remove the canvas from the DOM tree if wanted)
 *
 * @method cleanup
 * @param removeCanvas destroys the canvas and remove it from the dom tree
 */
Application.prototype.cleanup = function(removeCanvas) {
    removeCanvas = removeCanvas || true;
    if (removeCanvas) {
        document.body.removeChild(this._renderer.view);
    }
    this._stage = null;
    this._renderer = null;
    this._removeBackground();
    this.fullscreen = false; // remove event listener
};

/**
 * called when the browser window / the application is resized
 *
 * @method onresize
 */
Application.prototype.onresize = function() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._renderer.resize(this._width, this._height);
    if (this.bg) {
        this.bg.width = this._width;
        this.bg.height = this._height;
    }
    for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        if (child.onresize) {
            child.onresize(this._width, this._height);
        }
    }
};

/**
 * remove background
 * @method _removeBackground
 * @private
 */
Application.prototype._removeBackground = function() {
    if (this.bg) {
        this.removeChild(this.bg);
        this.bg = null;
    }
};

/**
 * set fullscreen and resize to screen size
 *
 * @property enabled
 * @type Boolean
 */
Object.defineProperty(Application.prototype, 'fullscreen', {
    get: function() {
        return this._fullscreen;
    },
    set: function(value) {
        if (this._fullscreen && !value) {
            window.removeEventListener('resize', this._onresize);
        } else if (!this._fullscreen && value) {
            this._onresize = this.onresize.bind(this);
            window.addEventListener('resize', this._onresize);
        }
        this._fullscreen = value;
    }
});

/**
 * set and draw background
 *
 * @property enabled
 * @type Boolean
 */
Object.defineProperty(Application.prototype, 'background', {
    get: function() {
        return this._background;
    },
    set: function(value) {
        if (value === this._background) {
            return;
        }
        this._removeBackground();
        if (value instanceof Array) {
            this.bg = new PIXI.Sprite(this._createGradientRect(value));
            this.bg.width = this._width;
            this.bg.height = this._height;
            this.addChildAt(this.bg, 0);
        } else {
            this._renderer.backgroundColor = value;
        }
        this._background = value;
    }
});

},{"../Control":1}],4:[function(require,module,exports){
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
    if (this.labelText && this.labelText.text) {
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

},{"../Skinable":2}],5:[function(require,module,exports){
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

},{"../Skinable":2}],6:[function(require,module,exports){
var Skinable = require('../Skinable'),
    InputWrapper = require('../../utils/InputWrapper');

/**
 * InputControl used for TextInput, TextArea and everything else that
 * is capable of entering text
 *
 * based on PIXI.Input InputObject by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class InputControl
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 */
function InputControl(text, theme) {
    Skinable.call(this, theme);
    this.text = text || '';
    // create DOM Input (if we need one)
    InputWrapper.createInput();
    this.hasFocus = false;

    /**
     * indicates if the mouse button has been pressed
     * @property _mouseDown
     * @type {boolean}
     * @private
     */
    this._mouseDown = false;

    /**
     * TODO: description!
     *
     * @type {Array}
     * @private
     */
    this._clipPos = [0, 0];
}

InputControl.prototype = Object.create( Skinable.prototype );
InputControl.prototype.constructor = InputControl;
module.exports = InputControl;

/**
 * currently selected input control (used for tab index)
 *
 * @property currentInput
 * @type GOWN.InputControl
 * @static
 */
InputControl.currentInput = null;

InputControl.prototype.onKeyUp = function() {
};

InputControl.prototype.onKeyDown = function() {
};

/**
 * determine where the click was made along the string
 *
 * @method clickPos
 * @param x
 * @returns {Number}
 */
InputControl.prototype.clickPos = function(x)
{

    var text = this.pixiText.text,
        totalWidth = this.pixiText.x,
        pos = text.length;

    if (x < this.textWidth(text) + totalWidth)
    {
        // loop through each character to identify the position
        for (var i=0; i<text.length; i++)
        {
            totalWidth += this.textWidth(text[i]);
            if (totalWidth >= x)
            {
                pos = i;
                break;
            }
        }
    }

    return this._clipPos[0] + pos;
};

InputControl.prototype.posToCoord = function(pos) {
    var text = this.pixiText.text,
        totalWidth = this.pixiText.x;

    if (pos < text.length) {
        return totalWidth + this.textWidth(text.substring(0, pos));
    } else {
        return totalWidth + this.textWidth(text);
    }
};

/**
 * get text width
 *
 * @method textWidth
 * @param text
 * @returns {*}
 */
InputControl.prototype.textWidth = function(text) {
    if(!this.text._isBitmapFont)
    {
        var ctx = this.pixiText.context;
        return ctx.measureText(text || '').width;
    }
    else
    {
        var prevCharCode = null;
        var width = 0;
        var data = this.pixiText._data;
        for(var i = 0; i < text.length; i++) {
            var charCode = text.charCodeAt(i);
            var charData = data.chars[charCode];
            if(!charData) {
                continue;
            }
            if(prevCharCode && charData.kerning[prevCharCode]) {
                width += charData.kerning[prevCharCode];
            }
            width += charData.xAdvance;
            prevCharCode = charCode;
        }
        return width * this.pixiText._scale;
    }
};

/**
 * focus on this input and set it as current
 *
 * @method focus
 */
InputControl.prototype.focus = function () {
    // is already current input
    if (GOWN.InputControl.currentInput === this) {
        return;
    }

    // drop focus
    if (GOWN.InputControl.currentInput) {
        GOWN.InputControl.currentInput.blur();
    }

    // set focus
    GOWN.InputControl.currentInput = this;
    this.hasFocus = true;

    // check custom focus event
    this.onfocus();

    /*
     //TODO
     // is read only
     if(this.readonly) {
        return;
     }
     */

    // focus hidden input
    InputWrapper.focus();
};

/**
 * determine if the input has the focus
 *
 * @property hasFocus
 * @type Boolean
 */
Object.defineProperty(InputControl.prototype, 'hasFocus', {
    get: function() {
        return this._hasFocus;
    },
    set: function(focus) {
        this._hasFocus = focus;
    }
});

InputControl.prototype.onMouseUpOutside = function() {
    if(this.hasFocus && !this._mouseDown)
    {
        this.blur();
    }
    this._mouseDown = false;
};

/**
 * callback to execute code on focus
 * @method onFocus
 */
InputControl.prototype.onfocus = function () {
};

/**
 * blur the text input (remove focus)
 *
 * @method blur
 */
InputControl.prototype.blur = function() {
    if (GOWN.InputControl.currentInput === this) {
        GOWN.InputControl.currentInput = null;
        this.hasFocus = false;

        // blur hidden input
        InputWrapper.blur();
        this.onblur();
    }
};

/**
 * callback that will be executed once the text input is blurred
 *
 * @method onblur
 */
InputControl.prototype.onblur = function() {
};

// blur current input
InputControl.blur = function() {
    if (GOWN.InputControl.currentInput &&
        !GOWN.InputControl.currentInput._mouseDown) {
        GOWN.InputControl.currentInput.blur();
        GOWN.InputControl.currentInput = null;
    }
};
window.addEventListener('blur', InputControl.blur, false);

},{"../../utils/InputWrapper":32,"../Skinable":2}],7:[function(require,module,exports){
var Control = require('../Control'),
    ViewPortBounds = require('../layout/ViewPortBounds');

/**
 * The LayoutGroup allows you to add PIXI.js children that will be positioned
 *
 * @class LayoutGroup
 * @extends GOWN.Layout
 * @memberof GOWN
 * @constructor
 */
function LayoutGroup() {
    this.percentWidth = this.percentWidth || null;
    this.percentHeight = this.percentHeight || null;
    Control.call(this);
    this._viewPortBounds = new ViewPortBounds();
    this._needUpdate = true;
}

LayoutGroup.prototype = Object.create( Control.prototype );
LayoutGroup.prototype.constructor = LayoutGroup;
module.exports = LayoutGroup;

/**
 * update before draw call (position label)
 *
 * @method redraw
 */
LayoutGroup.prototype.redraw = function() {
    var dimensionChanged = false;
    if (this._width && this._viewPortBounds.explicitWidth !== this._width) {
        // width set - change viewport boundaries
        this._viewPortBounds.explicitWidth = this._width;
        dimensionChanged = true;
    }
    if (this._height && this._viewPortBounds.explicitHeight !== this._height) {
        // height set - change viewport boundaries
        this._viewPortBounds.explicitHeight = this._height;
        dimensionChanged = true;
    }
    if (this.layout &&
        (this._needUpdate || dimensionChanged || this.layout.needUpdate)) {
        this.layout.layout(this.children, this._viewPortBounds);
        this._needUpdate = false;
        this.layout._needUpdate = false;
    }
};

/* istanbul ignore next */
LayoutGroup.prototype.addChild = function(child) {
    var re = Control.prototype.addChild.call(this, child);
    this._needUpdate = true;
    return re;
};

/* istanbul ignore next */
LayoutGroup.prototype.addChildAt = function(child, pos) {
    var re = Control.prototype.addChildAt.call(this, child, pos);
    this._needUpdate = true;
    return re;
};

/**
 * add some space between children
 *
 * @param space {Number}
 */
LayoutGroup.prototype.addSpacer = function(space) {
    var spacer = new Control();
    spacer.width = spacer.height = space;
    this.addChild(spacer);
};

/**
 * Indicates if the given child is inside the viewport (only used for scrolling)
 *
 * @method childIsRenderAble
 * @type boolean
 * @param child one child with set coordinates and dimensions
 * @param x X-position on the scroll-container
 * @param y Y-position on the scroll-container
 * @param width width of the viewport
 * @param height height of the viewport
 */
LayoutGroup.prototype.childIsRenderAble = function(child, x, y, width, height) {
    return child.x < width + x &&
        child.y < height + y &&
        child.x > x - child.width &&
        child.y > y - child.height;
};


/**
 * Update renderable (culling of non visible objects)
 *
 * @method updateRenderable
 * @param x X-position on the scroll-container
 * @param y Y-position on the scroll-container
 * @param width width of the viewport
 * @param height height of the viewport
 */
LayoutGroup.prototype.updateRenderable = function(x, y, width, height) {
    for(var i=0, j=this.children.length; i<j; i++) {
        var child = this.children[i];
        child.renderable = this.childIsRenderAble(child, x, y, width, height);
    }
};


/**
 * The width of the group, will get the position and the width of the right child.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(LayoutGroup.prototype, 'width', {
    set: function(width) {
        this._width = width;
    },
    get: function() {
        if (this._width > 0) {
            return this._width;
        }
        var width = 0;
        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.getChildAt(i);
                width = Math.max(width, child.x+child.width);
            }
        }
        return width;
    }
});

/**
 * The height of the group, will get the position and the height of the bottom child.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(LayoutGroup.prototype, 'height', {
    set: function(height) {
        this._height = height;
    },
    get: function() {
        if (this._height > 0) {
            return this._height;
        }
        var height = 0;
        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.getChildAt(i);
                height = Math.max(height, child.y+child.height);
            }
        }
        return height;
    }
});

},{"../Control":1,"../layout/ViewPortBounds":23}],8:[function(require,module,exports){
var Control = require('../Control'),
    LayoutAlignment = require('../layout/LayoutAlignment');

/**
 * The ScrollArea hosts some content that can be scrolled. The width/height
 * of the ScrollArea defines the viewport.
 *
 * @class ScrollArea
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 */
function ScrollArea(content, addListener, scrolldelta, bar) {
    this.addListener = addListener || true;
    this.bar = bar || null;
    Control.call(this);
    this.content = content || null;
    this.mask = undefined;
    this.enabled = true;
    this._useMask = true;

    this.scrolldirection = ScrollArea.SCROLL_AUTO;
    // # of pixel you scroll at a time (if the event delta is 1 / -1)
    this.scrolldelta = scrolldelta || 10;

    this.interactive = true;

    this.touchend = this.touchendoutside = this.mouseupoutside = this.mouseup;
    this.touchstart = this.mousedown;
    this.touchmove = this.mousemove;
}

ScrollArea.prototype = Object.create( Control.prototype );
ScrollArea.prototype.constructor = ScrollArea;
module.exports = ScrollArea;

// scrolls horizontal as default, but will change if a
// horizontal layout is set in the content
ScrollArea.SCROLL_AUTO = 'auto';
ScrollArea.SCROLL_VERTICAL = 'vertical';
ScrollArea.SCROLL_HORIZONTAL = 'horizontal';

/**
 * check, if the layout of the content is horizontally alligned
 *
 * * @method layoutHorizontalAlign
 */
ScrollArea.prototype.layoutHorizontalAlign = function() {
    return this.content.layout &&
        this.content.layout.alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT;
};

/**
 * test if content width bigger than this width but content height is
 * smaller than this height (so we allow scrolling in only one direction)
 *
 * @method upright
 */
ScrollArea.prototype.upright = function() {
    return this.content.height <= this.height &&
        this.content.width > this.width;
};

/**
 * get 1-dimensional scroll direction
 * dissolve "auto" into VERTICAL or HORIZONTAL
 *
 * @method direction
 * @returns {String}
 */
ScrollArea.prototype.direction = function() {
    var scrollAuto = this.scrolldirection === ScrollArea.SCROLL_AUTO;
    var scroll = ScrollArea.SCROLL_VERTICAL;
    // if the scroll direction is set to SCROLL_AUTO we check, if the
    // layout of the content is set to horizontal or the content
    // width is bigger than the current
    if (this.scrolldirection === ScrollArea.SCROLL_HORIZONTAL ||
        (scrollAuto && (this.layoutHorizontalAlign() || this.upright()) )) {
        scroll = ScrollArea.SCROLL_HORIZONTAL;
    }
    return scroll;
};

/**
 * move content
 *
 * @method _scrollContent
 */
ScrollArea.prototype._scrollContent = function(x, y) {
    // todo: press shift to switch direction
    var scroll = this.direction();
    var contentMoved = false;
    if (scroll === ScrollArea.SCROLL_HORIZONTAL) {
        if (this.content.width > this.width) {
            // assure we are within bounds
            x = Math.min(x, 0);
            if (this.content.width) {
                x = Math.max(x, -(this.content.width - this.width));
            }
            this.content.x = Math.floor(x);
            contentMoved = true;
        }
    }
    if (scroll === ScrollArea.SCROLL_VERTICAL) {
        if (this.content.height > this.height) {
            // assure we are within bounds
            y = Math.min(y, 0);
            if (this.content.height && this.content.y < 0) {
                y = Math.max(y, -(this.content.height - this.height));
            }
            this.content.y = Math.floor(y);
            contentMoved = true;
        }
    }
    return contentMoved;
};

// update ScrollBar progress/thumb position
ScrollArea.prototype.updateBar = function() {
    if (this.bar && this.bar.thumb && this.content) {
        var scroll = this.direction();
        if (scroll === ScrollArea.SCROLL_HORIZONTAL) {
            this.bar.thumb.x = Math.floor(-this.content.x /
                (this.content.width - this.width) *
                (this.bar.width - this.bar.thumb.width));
        }
        if (scroll === ScrollArea.SCROLL_VERTICAL) {
            this.bar.thumb.y = Math.floor(-this.content.y /
            (this.content.height - this.height) *
            (this.bar.height - this.bar.thumb.height));
        }
    }
};

/**
 * mouse button pressed / touch start
 *
 * @method mousedown
 */
ScrollArea.prototype.mousedown = function(mouseData) {
    var pos = mouseData.data.getLocalPosition(this);
    if (!this._start) {
        this._start = [
            pos.x - this.content.x,
            pos.y - this.content.y
        ];
    }
};

/**
 * mouse/finger moved
 *
 * @method mousemove
 */
ScrollArea.prototype.mousemove = function(mouseData) {
    if (this._start) {
        var pos = mouseData.data.getLocalPosition(this);
        if (this._scrollContent(
                pos.x - this._start[0],
                pos.y - this._start[1])) {
            this.updateBar();
        }
    }
};

/**
 * mouse up/touch end
 *
 * @method mouseup
 */
ScrollArea.prototype.mouseup = function() {
    this._start = null;
};


/**
 * do not remove children - we just have a content
 * override addChild to prevent the developer from adding more than one context
 * @param child
 */
/*
ScrollArea.prototype.removeChild = function(child) {
    throw new Error('use .content = null instead of removeChild(child)')
};

ScrollArea.prototype.addChild = function(child) {
    throw new Error('use .content = child instead of addChild(child)')
};
*/

/**
 * create a new mask or redraw it
 * @method updateMask
 */
ScrollArea.prototype.updateMask = function() {
    if (this.height && this.width && this._useMask) {
        if (this.mask === undefined) {
            this.mask = new PIXI.Graphics();
        }
        this.drawMask();
    } else {
        if (this.mask) {
            this.mask.clear();
        }
        this.mask = undefined;
    }
};

/**
 * draw mask (can be overwritten, e.g. to show something above the
 * scroll area when using a vertical layout)
 * @private
 * @method drawMask
 */
ScrollArea.prototype.drawMask = function() {
    var pos = new PIXI.Point(0, 0);
    var global = this.toGlobal(pos);
    this.mask.clear()
        .beginFill('#fff', 1)
        .drawRect(global.x, global.y, this.width, this.height)
        .endFill();
    if (this.hitArea) {
        this.hitArea.width = this.width;
        this.hitArea.height = this.height;
    } else {
        this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    }
};


/**
 * update mask as needed
 *
 * @method redraw
 */
ScrollArea.prototype.redraw = function() {
    if (this.content.updateRenderable) {
        this.content.updateRenderable(-this.content.x, -this.content.y, this.width, this.height);
    }

    if (this.invalid) {
        this.updateMask();
        this.invalid = false;
    }
};

/**
 * scroll content, that can have the scrollarea as viewport.
 * can be a PIXI.Texture or a ScrollContainer
 *
 * @property content
 */
Object.defineProperty(ScrollArea.prototype, 'content', {
    set: function(content) {
        if (this._content) {
            this.removeChild(content);
        }
        this._content = content;
        if (content) {
            this.addChild(content);
        }
    },
    get: function() {
        return this._content;
    }
});


/**
 * The width of the ScrollArea (defines the viewport)
 *
 * @property width
 * @type Number
 */
Object.defineProperty(ScrollArea.prototype, 'width', {
    get: function() {
        if (!this._width) {
            return this._content.width;
        }
        return this._width;
    },
    set: function(width) {
        this._width = width;
        this.invalid = true;
    }
});

/**
 * The height of the ScrollArea (defines the viewport)
 *
 * @property height
 * @type Number
 */
Object.defineProperty(ScrollArea.prototype, 'height', {
    get: function() {
        if (!this._height) {
            return this._content.height;
        }
        return this._height;
    },
    set: function(height) {
        this._height = height;
        this.invalid = true;
    }
});

},{"../Control":1,"../layout/LayoutAlignment":18}],9:[function(require,module,exports){
var Scrollable = require('./Scrollable'),
    LayoutAlignment = require('../layout/LayoutAlignment');

/**
 * scoll bar with thumb
 * hosting some Viewport (e.g. a ScrollArea or a Texture)
 *
 * @class ScrollArea
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 */
function ScrollBar(scrollArea, thumb, theme, skinName) {
    this.scrollArea = scrollArea;
    this.skinName = skinName || ScrollBar.SKIN_NAME;

    if (this.orientation === undefined) {
        this.orientation = Scrollable.HORIZONTAL;
        if (scrollArea && scrollArea.content &&
            scrollArea.content.layout.alignment ===
                LayoutAlignment.VERTICAL_ALIGNMENT) {
            this.orientation = Scrollable.VERTICAL;
        }
    }
    if (scrollArea) {
        //scrollArea
        // move thumb when scrollarea moves
        scrollArea.bar = this;
    }
    Scrollable.call(this, thumb, theme);
}

ScrollBar.prototype = Object.create( Scrollable.prototype );
ScrollBar.prototype.constructor = ScrollBar;
module.exports = ScrollBar;


ScrollBar.SKIN_NAME = 'scroll_bar';

ScrollBar.prototype.scrollableredraw = Scrollable.prototype.redraw;
/**
 * recalculate scroll thumb width/height
 * @method redraw
 */
ScrollBar.prototype.redraw = function() {
    if (this.invalidTrack) {
        if (this.scrollArea && this.thumb) {
            if (this.orientation === Scrollable.HORIZONTAL) {
                this.thumb.width = Math.max(20, this.scrollArea.width /
                    (this.scrollArea.content.width / this.scrollArea.width));
            } else {
                this.thumb.height = Math.max(20, this.scrollArea.height /
                    (this.scrollArea.content.height / this.scrollArea.height));
            }
        }
        this.scrollableredraw(this);
    }
};

/**
 * thumb has been moved - scroll content to position
 * @param x x-position to scroll to (ignored when vertical)
 * @param y y-position to scroll to (ignored when horizontal)
 * @method thumbMoved
 */
ScrollBar.prototype.thumbMoved = function(x, y) {
    if (this.scrollArea && this.scrollArea.content) {

        if (this.orientation === Scrollable.HORIZONTAL) {
            this.scrollArea._scrollContent(
                -(this.scrollArea.content.width - this.scrollArea.width) *
                    (x / (this.scrollArea.width - this.thumb.width)),
                0);
        } else {
            this.scrollArea._scrollContent(
                0,
                -(this.scrollArea.content.height - this.scrollArea.height) *
                    (y / (this.scrollArea.height - this.thumb.height)));
        }
    }
};

},{"../layout/LayoutAlignment":18,"./Scrollable":11}],10:[function(require,module,exports){
var Button = require('./Button');

/**
 * thumb button that can be moved on the scrollbar
 *
 * @class ScrollThumb
 * @extends GOWN.Button
 * @memberof GOWN
 * @constructor
 */
function ScrollThumb(scrollable, theme, skinName) {
    this.scrollable = scrollable;
    var defaultSkin = ScrollThumb.SKIN_NAME;
    if (!theme.thumbSkin) {
        defaultSkin = Button.SKIN_NAME;
    }
    this.skinName = skinName || defaultSkin;
    if (theme.thumbSkin) {
        this._validStates = ScrollThumb.THUMB_STATES;
    }
    this.width = theme.thumbSize || 20;
    this.height = theme.thumbSize || 20;
    Button.call(this, theme, this.skinName);
    this.invalidTrack = true;

    this.touchmove = this.mousemove;
    /* jshint unused: false */
    this.touchdown = this.mousedown;
    /* jshint unused: false */
    this.touchend = this.touchendoutside = this.mouseup;
}

ScrollThumb.prototype = Object.create( Button.prototype );
ScrollThumb.prototype.constructor = ScrollThumb;
module.exports = ScrollThumb;


ScrollThumb.SKIN_NAME = 'scroll_thumb';

ScrollThumb.THUMB_STATES = [
    'horizontal_up', 'vertical_up',
    'horizontal_down', 'vertical_down',
    'horizontal_hover', 'vertical_hover'
];

var originalCurrentState = Object.getOwnPropertyDescriptor(Button.prototype, 'currentState');

/**
 * The current state (one of _validStates)
 *
 * @property currentState
 * @type String
 */
Object.defineProperty(ScrollThumb.prototype, 'currentState',{
    set: function(value) {
        if (this.theme.thumbSkin) {
            // use skin including orientation instead of default skin
            value = this.scrollable.orientation + '_' + value;
        }
        originalCurrentState.set.call(this, value);
    }
});

ScrollThumb.prototype.buttonmousedown = Button.prototype.mousedown;
ScrollThumb.prototype.mousedown = function(mouseData) {
    this.buttonmousedown(mouseData);
    var local = mouseData.data.getLocalPosition(this.scrollable);
    this.scrollable._start = [local.x, local.y];
    //this.scrollable.handleDown(mouseData);
    mouseData.stopPropagation();
};

ScrollThumb.prototype.buttonmousemove = Button.prototype.mousemove;
ScrollThumb.prototype.mousemove = function (mouseData) {
    this.buttonmousemove(mouseData);
    this.scrollable.handleMove(mouseData);
};

ScrollThumb.prototype.buttonmouseup = Button.prototype.mouseup;
ScrollThumb.prototype.mouseup = function (mouseData) {
    this.buttonmouseup(mouseData);
    this.scrollable.handleUp();
};

/**
 * show track icon on thumb
 *
 * @method showTrack
 * @param skin
 */
ScrollThumb.prototype.showTrack = function(skin) {
    if (this.skin !== skin) {
        if(this.skin) {
            this.removeChild(this.skin);
        }

        this.addChild(skin);
        this.skin = skin;
    }
    skin.x = Math.floor((this.width - skin.getBounds().width )/ 2);
    skin.y = Math.floor((this.height - skin.getBounds().height )/ 2);
    this.invalidTrack = false;
};

/**
 * redraw the skin
 *
 * @method redraw
 */
ScrollThumb.prototype.redraw = function() {
    this.redrawSkinable();
    if (this.invalidTrack && this.theme.thumbSkin) {
        this.fromSkin(this.scrollable.orientation+'_thumb', this.showTrack);
    }
};


/**
 * move the thumb on the scroll bar within its bounds
 *
 * @param x new calculated x position of the thumb
 * @param y new calculated y position of the thumb
 * @returns {boolean} returns true if the position of the thumb has been
 * moved
 * @method move
 */
ScrollThumb.prototype.move = function(x, y) {
    if (this.scrollable.orientation === GOWN.Scrollable.HORIZONTAL) {
        if (isNaN(x)) {
            return false;
        }
        x = Math.min(x, this.scrollable.maxWidth());
        x = Math.max(x, 0);
        if (x !== this.x) {
            this.x = x;
            return true;
        }
    } else {
        if (isNaN(y)) {
            return false;
        }
        y = Math.min(y, this.scrollable.maxHeight());
        y = Math.max(y, 0);
        if (y !== this.y) {
            this.y = y;
            return true;
        }
    }
    return false;
};

},{"./Button":4}],11:[function(require,module,exports){
var Skinable = require('../Skinable'),
    ScrollThumb = require('./ScrollThumb');
/**
 * scroll bar or slider
 * @class Scrollable
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 */

function Scrollable(thumb, theme) {
    this.mode = this.mode || Scrollable.DESKTOP_MODE;

    Skinable.call(this, theme);

    this.orientation = this.orientation || Scrollable.HORIZONTAL;

    this.thumb = thumb || new ScrollThumb(this, this.theme);
    this.addChild(this.thumb);

    this.invalidTrack = true;
    this._inverse = false;
    this._start = null;

    // # of pixel you scroll at a time (if the event delta is 1 / -1)
    this.scrolldelta = 10;

    this.touchstart = this.mousedown = this.handleDown;
    this.touchend = this.mouseup = this.mouseupoutside = this.handleUp;
}

Scrollable.prototype = Object.create( Skinable.prototype );
Scrollable.prototype.constructor = Scrollable;
module.exports = Scrollable;


/**
 * in desktop mode mouse wheel support is added (default)
 *
 * @property DESKTOP_MODE
 * @static
 */
Scrollable.DESKTOP_MODE = 'desktop';

/**
 * in mobile mode mouse wheel support is disabled
 *
 * @property MOBILE_MODE
 * @static
 */
Scrollable.MOBILE_MODE = 'mobile';

/**
 * show horizontal scrollbar/slider
 *
 * @property HORIZONTAL
 * @static
 */
Scrollable.HORIZONTAL = 'horizontal';

/**
 * show vertical scrollbar/slider
 *
 * @property VERTICAL
 * @static
 */
Scrollable.VERTICAL = 'vertical';

/**
 * handle mouse down/touch start
 * move scroll thumb clicking somewhere on the scroll bar (outside the thumb)
 *
 * @method handleDown
 * @param mouseData mousedata provided by pixi
 */
Scrollable.prototype.handleDown = function(mouseData) {
    var local = mouseData.data.getLocalPosition(this);
    var center = {
        x: local.x - this.thumb.width / 2,
        y: local.y - this.thumb.height / 2
    };
    if (mouseData.target === this &&
        this.moveThumb(center.x, center.y)) {
        this._start = [local.x, local.y];
        // do not override localX/localY in start
        // if we do not move the thumb
        this.thumbMoved(local.x, local.y);
    }
};

/**
 * handle mouse up/touch end
 *
 * @method handleUp
 */
Scrollable.prototype.handleUp = function() {
    this._start = null;
};

/**
 * handle mouse move: move thumb
 *
 * @method handleMove
 * @param mouseData mousedata provided by pixi
 */
Scrollable.prototype.handleMove = function(mouseData) {
    if (this._start) {
        var local = mouseData.data.getLocalPosition(this);
        var x = this.thumb.x + local.x - this._start[0];
        var y = this.thumb.y + local.y - this._start[1];
        if (this.moveThumb(x, y)) {
            // do not override localX/localY in start
            // if we do not move the thumb
            this.thumbMoved(x, y);
            this._start[0] = local.x;
            this._start[1] = local.y;
        }
    }
};

/**
 * handle mouse wheel: move thumb on track
 *
 * @method handleWheel
 * @param event mousewheel event from browser
 */
Scrollable.prototype.handleWheel = function (event) {
    var x = this.thumb.x - event.delta * this.scrolldelta;
    var y = this.thumb.y - event.delta * this.scrolldelta;
    if (this.moveThumb(x, y)) {
        this.thumbMoved(x, y);
    }
};

/**
 * thumb has new x/y position
 *
 * @method thumbMoved
 * @param x x-position that has been scrolled to (ignored when vertical)
 * @param y y-position that has been scrolled to (ignored when horizontal)
 */
/* jshint unused: false */
Scrollable.prototype.thumbMoved = function(x, y) {
};

/**
 * show the progress skin from the start/end of the scroll track to the current
 * position of the thumb.
 *
 * @method _updateProgressSkin
 * @private
 */
Scrollable.prototype._updateProgressSkin = function() {
    if (!this.progressSkin) {
        return;
    }
    if(this.orientation === Scrollable.HORIZONTAL) {
        var progressPosX = this.thumb.x + this.thumb.width / 2;
        if (this.inverse) {
            this.progressSkin.x = progressPosX;
            this.progressSkin.width = this.width - progressPosX;
            this.progressSkin.height = this.skin.height;
        } else {
            this.progressSkin.x = 0;
            this.progressSkin.width = progressPosX;
            this.progressSkin.height = this.skin.height;
        }
    } else {
        var progressPosY = this.thumb.y + this.thumb.height / 2;
        if (this.inverse) {
            this.progressSkin.y = progressPosY;
            this.progressSkin.height = this.height - progressPosY;
            this.progressSkin.width = this.skin.width;
        } else {
            this.progressSkin.y = 0;
            this.progressSkin.height =progressPosY;
            this.progressSkin.width = this.skin.width;
        }
    }
};

/**
 * returns the max. width in pixel
 * (normally this.width - thumb width)
 *
 * @method maxWidth
 * @returns {Number}
 */
Scrollable.prototype.maxWidth = function() {
    return this.width - this.thumb.width;
};

/**
 * returns the max. height in pixel
 * (normally this.height - thumb height)
 *
 * @method maxHeight
 * @returns {Number}
 */
Scrollable.prototype.maxHeight = function() {
    return this.height - this.thumb.height;
};

/**
 * move the thumb on the scroll bar within its bounds
 *
 * @param x new calculated x position of the thumb
 * @param y new calculated y position of the thumb
 * @returns {boolean} returns true if the position of the thumb has been
 * moved
 * @method moveThumb
 */
Scrollable.prototype.moveThumb = function(x, y) {
    if (this.thumb.move(x, y)) {
        this._updateProgressSkin();
        return true;
    }
    return false;
};

/**
 * show scroll track
 *
 * @method showTrack
 * @param skin
 */
Scrollable.prototype.showTrack = function(skin) {
    if (this.skin !== skin) {
        if(this.skin) {
            this.removeChild(this.skin);
        }

        this.addChildAt(skin, 0);
        this.skin = skin;
        if (this.progressSkin) {
            this._updateProgressSkin();
        }
    }
};

/**
 * show progress on track (from the start/end of the track to the
 * current position of the thumb)
 *
 * @method showProgress
 * @param skin
 */
Scrollable.prototype.showProgress = function(skin) {
    if (this.progressSkin !== skin) {
        if(this.progressSkin) {
            this.removeChild(this.progressSkin);
        }
        skin.width = skin.height = 0;
        this.addChildAt(skin, 0);
        this.progressSkin = skin;
        if (this.skin) {
            this._updateProgressSkin();
        }
    }
};

/**
 * redraw track and progressbar
 *
 * @method redraw
 */
Scrollable.prototype.redraw = function() {
    if (this.invalidTrack && this.thumb) {
        this.fromSkin(this.orientation+'_progress', this.showProgress);
        this.fromSkin(this.orientation+'_track', this.showTrack);
        if (this.skin) {
            if (this.orientation === Scrollable.HORIZONTAL) {
                this.skin.width = this.width;
            } else {
                this.skin.height = this.height;
            }
            this.invalidTrack = false;
        }
    }
};


/**
 * The width of the Scrollable, setting this will redraw the track and thumb.

 *
 * @property width
 * @type Number
 */
Object.defineProperty(Scrollable.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(width) {
        this._width = width;
        this.invalidTrack = true;
        if (this.thumb) {
            this.thumb.invalidTrack = true;
        }
    }
});

/**
 * Inverse the progress bar
 *
 * @property inverse
 * @type Boolean
 */
Object.defineProperty(Scrollable.prototype, 'inverse', {
    get: function() {
        return this._inverse;
    },
    set: function(inverse) {
        if (inverse !== this._inverse) {
            this._inverse = inverse;

            if (this.orientation === Scrollable.HORIZONTAL) {
                this.moveThumb(0, this.width - this.thumb.x);
            } else {
                this.moveThumb(0, this.height - this.thumb.y);
            }

            this.invalidTrack = true;
            if (this.thumb) {
                this.thumb.invalidTrack = true;
            }
        }
    }
});

/**
 * The height of the Scrollable, setting this will redraw the track and thumb.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Scrollable.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(height) {
        this._height = height;
        this.invalidTrack = true;
        if (this.thumb) {
            this.thumb.invalidTrack = true;
        }
    }
});

},{"../Skinable":2,"./ScrollThumb":10}],12:[function(require,module,exports){
var Scrollable = require('./Scrollable'),
    SliderData = require('../../utils/SliderData');

/**
 * Simple slider with min. and max. value
 *
 * @class Slider
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 */

function Slider(thumb, theme, skinName) {
    this.skinName = skinName || Slider.SKIN_NAME;

    this._minimum = this._minimum || 0;
    this._maximum = this._maximum || 100;
    this.step = this.step || 0; //TODO: implement me!
    this.page = this.page || 10; //TODO: implement me!
    this._value = this.minimum;
    this.change = null;

    Scrollable.call(this, thumb, theme);
}

Slider.prototype = Object.create( Scrollable.prototype );
Slider.prototype.constructor = Slider;
module.exports = Slider;


Slider.SKIN_NAME = 'scroll_bar';

/**
 * thumb has been moved - calculate new value
 *
 * @param x x-position to scroll to (ignored when vertical)
 * @param y y-position to scroll to (ignored when horizontal)
 */
Slider.prototype.thumbMoved = function(x, y) {
    var pos = 0;
    if (this.orientation === Scrollable.HORIZONTAL) {
        pos = x;
    } else {
        pos = y;
    }
    this.value = this.pixelToValue(pos);
};

/**
 * calculate value of slider based on current pixel position of thumb
 *
 * @param position
 * @method pixelToValue
 * @returns Number value between minimum and maximum
 */
Slider.prototype.pixelToValue = function(position) {
    var max = 0;
    if (this.orientation === Scrollable.HORIZONTAL) {
        max = this.maxWidth();
    } else {
        max = this.maxHeight();
    }
    if (this._inverse) {
        position = max - position;
    }
    return position / max * (this.maximum - this.minimum) + this.minimum;
};

/**
 * calculate current pixel position of thumb based on given value
 *
 * @param value
 * @method valueToPixel
 * @returns Number position of the scroll thumb in pixel
 */
Slider.prototype.valueToPixel = function(value) {
    var max = 0;
    if (this.orientation === Scrollable.HORIZONTAL) {
        max = this.maxWidth();
    } else {
        max = this.maxHeight();
    }
    var position = (value - this.minimum) / (this.maximum - this.minimum) * max;
    if (this._inverse) {
        position = max - position;
    }
    return position;
};

/**
 * set value (between minimum and maximum)
 *
 * @property value
 * @type Number
 * @default 0
 */
Object.defineProperty(Slider.prototype, 'value', {
    get: function() {
        return this._value;
    },
    set: function(value) {
        if (isNaN(value)) {
            return;
        }
        value = Math.min(value, this.maximum);
        value = Math.max(value, this.minimum);
        if (this._value === value) {
            return;
        }

        // move thumb
        var pos = this.valueToPixel(value);
        if (this.orientation === Scrollable.HORIZONTAL) {
            this.moveThumb(pos, 0);
        } else {
            this.moveThumb(0, pos);
        }

        this._value = value;
        if (this.change) {
            var sliderData = new SliderData();
            sliderData.value = this._value;
            sliderData.target = this;
            this.change(sliderData);
        }
    }
});

/**
 * set minimum and update value if necessary
 *
 * @property minimum
 * @type Number
 * @default 0
 */
Object.defineProperty(Slider.prototype, 'minimum', {
    get: function() {
        return this._minimum;
    },
    set: function(minimum) {
        if(!isNaN(minimum) && this.minimum !== minimum && minimum < this.maximum) {
            this._minimum = minimum;
        }
        if (this._value < this.minimum) {
            this.value = this._value;
        }
    }
});

/**
 * set maximum and update value if necessary
 *
 * @property maximum
 * @type Number
 * @default 100
 */
Object.defineProperty(Slider.prototype, 'maximum', {
    get: function() {
        return this._maximum;
    },
    set: function(maximum) {
        if(!isNaN(maximum) && this.maximum !== maximum && maximum > this.minimum) {
            this._maximum = maximum;
        }
        if (this._value > this.maximum) {
            this.value = maximum;
        }
    }
});

},{"../../utils/SliderData":34,"./Scrollable":11}],13:[function(require,module,exports){
var Control = require('../Control'),
    InputControl = require('./InputControl'),
    InputWrapper = require('../../utils/InputWrapper');
/**
 * The basic Text Input - based on PIXI.Input Input by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class TextInput
 * @extends GOWN.InputControl
 * @memberof GOWN
 * @param text editable text shown in input
 * @param displayAsPassword Display TextInput as Password (default false)
 * @param theme default theme
 * @constructor
 */

function TextInput(text, displayAsPassword, theme, skinName) {
    // show and load background image as skin (exploiting skin states)
    this.skinName = skinName || TextInput.SKIN_NAME;
    this._validStates = this._validStates || TextInput.stateNames;
    this._currentState = 'background';
    this.invalidState = true;

    InputControl.call(this, text, theme);

    this._displayAsPassword = displayAsPassword || false;

    /**
     * timer used to indicate if the cursor is shown
     *
     * @property _cursorTimer
     * @type {Number}
     * @private
     */
    this._cursorTimer = 0;

    /**
     * indicates if the cursor position has changed
     *
     * @property _cursorNeedsUpdate
     * @type {Boolean}
     * @private
     */

    this._cursorNeedsUpdate = true;

    /**
     * interval for the cursor (in milliseconds)
     *
     * @property blinkInterval
     * @type {number}
     */
    this.blinkInterval = 500;

    /**
     * selected area (start and end)
     *
     * @type {Array}
     * @private
     */
    this.selection = [0, 0];

    // caret/selection sprite
    this.cursor = new PIXI.Text('|', this.theme.textStyle);
    this.addChild(this.cursor);

    // selection background
    this.selectionBg = new PIXI.Graphics();
    this.addChildAt(this.selectionBg, 0);

    // set up events
    this.boundOnMouseUp = this.onMouseUp.bind(this);
    this.boundOnMouseUpOutside = this.onMouseUpOutside.bind(this);
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);

    this.mousemove = this.touchmove = this.boundOnMouseMove;
    this.mousedown = this.touchstart = this.boundOnMouseDown;
    this.mouseup = this.touchend = this.boundOnMouseUp;
    this.mouseupoutside = this.touchendoutside = this.boundOnMouseUpOutside;
}

TextInput.prototype = Object.create(InputControl.prototype);
TextInput.prototype.constructor = TextInput;
module.exports = TextInput;


// name of skin
TextInput.SKIN_NAME = 'text_input';

/**
 * set the text that is shown inside the input field.
 * calls onTextChange callback if text changes
 *
 * @property text
 * @type String
 */
Object.defineProperty(TextInput.prototype, 'text', {
    get: function () {
        return this._text;
    },
    set: function (text) {
        text += ''; // add '' to assure text is parsed as string
        if (this._origText === text) {
            // return if text has not changed
            return;
        }
        this._origText = text;
        if (this._displayAsPassword) {
            text = text.replace(/./gi, '*');
        }
        this._text = text || '';
        if (!this.pixiText) {
            this.pixiText = new PIXI.Text(text, this.theme.textStyle);
            this.addChild(this.pixiText);
        } else {
            this.pixiText.text = text;
        }

        // update text input if this text field has the focus
        if (this.hasFocus) {
            InputWrapper.setText(this.value);
        }

        // reposition cursor
        this._cursorNeedsUpdate = true;
        if (this.change) {
            this.change(text);
        }
    }
});

/**
 * The maximum number of characters that may be entered. If 0,
 * any number of characters may be entered.
 * (same as maxLength for DOM inputs)
 *
 * @default 0
 * @property maxChars
 * @type String
 */
Object.defineProperty(TextInput.prototype, 'maxChars', {
    get: function () {
        return this._maxChars;
    },
    set: function (value) {
        if (this._maxChars === value) {
            return;
        }
        InputWrapper.setMaxLength(value);
        this._maxChars = value;
    }
});

Object.defineProperty(TextInput.prototype, 'value', {
    get: function() {
        return this._origText;
    }
});

/**
 * set text and type of DOM text input
 *
 * @method onfocus
 */
TextInput.prototype.onfocus = function() {
    InputWrapper.setText(this.value);
    InputWrapper.setMaxLength(this.maxChars);
    if (this._displayAsPassword) {
        InputWrapper.setType('password');
    } else {
        InputWrapper.setType('text');
    }
};

/**
 * set selected text
 *
 * @method updateSelection
 * @param start
 * @param end
 * @returns {boolean}
 */
TextInput.prototype.updateSelection = function (start, end) {
    if (this.selection[0] !== start || this.selection[1] !== end) {
        this.selection[0] = start;
        this.selection[1] = end;
        InputWrapper.setSelection(start, end);
        this._cursorNeedsUpdate = true;
        this.updateSelectionBg();
        return true;
    } else {
        return false;
    }
};

TextInput.prototype.updateSelectionBg = function() {
    var start = this.posToCoord(this.selection[0]),
        end = this.posToCoord(this.selection[1]);

    this.selectionBg.clear();
    if (start !== end) {
        this.selectionBg.beginFill(0x0080ff);
        this.selectionBg.drawRect(0, 0, end - start, this.pixiText.height);
        this.selectionBg.x = start;
        this.selectionBg.y = this.pixiText.y;
    }
};

TextInput.prototype.onblur = function() {
    this.updateSelection(0, 0);
};

TextInput.prototype.onSubmit = function () {
};

TextInput.prototype.onKeyDown = function (e) {
    var keyCode = e.which;

    // ESC
    if (e.which === 27) {
        this.blur();
        return;
    }

    // add support for Ctrl/Cmd+A selection - select whole input text
    if (keyCode === 65 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.updateSelection(0, this.text.length);
        return;
    }

    // block keys that shouldn't be processed
    if (keyCode === 17 || e.metaKey || e.ctrlKey) {
        return;
    }

    // enter key
    if (keyCode === 13) {
        e.preventDefault();
        this.onSubmit(e);
    }

    // update the canvas input state information from the hidden input
    this.updateTextState();
};

TextInput.prototype.onKeyUp = function () {
    this.updateTextState();
};

/**
 * position cursor on the text
 */
TextInput.prototype.setCursorPos = function () {
    this.cursor.x = this.textWidth(this.text.substring(0, this.cursorPos)) | 0;
};

/**
 * draw the cursor
 *
 * @method drawCursor
 */
TextInput.prototype.drawCursor = function () {
    if (this.hasFocus || this._mouseDown) {
        var time = Date.now();

        // blink interval for cursor
        if ((time - this._cursorTimer) >= this.blinkInterval) {
            this._cursorTimer = time;
            this.cursor.visible = !this.cursor.visible;
        }

        // update cursor position
        if (this.cursor.visible && this._cursorNeedsUpdate) {
            this.setCursorPos();
            this._cursorNeedsUpdate = false;
        }
    } else {
        this.cursor.visible = false;
    }
};

TextInput.prototype.redraw = function () {
    this.drawCursor();
    Control.prototype.redraw.call(this);
};

TextInput.prototype.onMouseMove = function (e) {
    var mouse = this.mousePos(e);
    if (!this.hasFocus || !this._mouseDown || this.selectionStart < 0) { // || !this.containsPoint(mouse)) {
        return false;
    }

    var curPos = this.clickPos(mouse.x, mouse.y),
        start = Math.min(this.selectionStart, curPos),
        end = Math.max(this.selectionStart, curPos);

    if (this.updateSelection(start, end)) {
        this.cursorPos = curPos;
        this.setCursorPos();
        this._cursorNeedsUpdate = true;
    }
    return true;
};

TextInput.prototype.onMouseDown = function (e) {
    var originalEvent = e.data.originalEvent;
    if (originalEvent.which === 2 || originalEvent.which === 3) {
        originalEvent.preventDefault();
        return false;
    }

    // focus input
    this.focus();

    this._mouseDown = true;
    var mouse = this.mousePos(e);

    // start the selection drag if inside the input
    this.selectionStart = this.clickPos(mouse.x, mouse.y);
    this.updateSelection(this.selectionStart, this.selectionStart);
    this.cursorPos = this.selectionStart;
    this.setCursorPos();
    return true;
};

TextInput.prototype.onMouseUp = function (e) {
    var originalEvent = e.data.originalEvent;
    if (originalEvent.which === 2 || originalEvent.which === 3) {
        originalEvent.preventDefault();
        return false;
    }

    var mouse = this.mousePos(e);

    // update selection if a drag has happened
    var clickPos = this.clickPos(mouse.x, mouse.y);

    // update the cursor position
    if (!(this.selectionStart >= 0 && clickPos !== this.selectionStart)) {
        this.cursorPos = clickPos;
        this.setCursorPos();
        this.updateSelection(this.cursorPos, this.cursorPos);
    }

    this.selectionStart = -1;
    this._mouseDown = false;
    return true;
};

/**
 * synchronize TextInput with DOM element
 *
 * @method updateTextState
 */
TextInput.prototype.updateTextState = function () {
    var text = InputWrapper.getText();

    if (text !== this.text) {
        this.text = text;
    }

    var sel = InputWrapper.getSelection();
    if (this.updateSelection(sel[0], sel[1])) {
        this.cursorPos = sel[0];
    }
    this.setCursorPos();
};

},{"../../utils/InputWrapper":32,"../Control":1,"./InputControl":6}],14:[function(require,module,exports){
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

},{"./Button":4}],15:[function(require,module,exports){
/**
 * @file        Main export of the gown.js core library
 * @author      Andreas Bresser <andreasbresser@gmail.com>
 * @copyright   2015 Andreas Bresser
 * @license     {@link https://github.com/brean/gown.js/blob/master/LICENSE|Apache License}
 */

/**
 * @namespace GOWN.core
 */
module.exports = {
    Control:        require('./Control'),
    Skinable:       require('./Skinable'),

    // controls
    Application:            require('./controls/Application'),
    Button:                 require('./controls/Button'),
    CheckBox:               require('./controls/CheckBox'),
    InputControl:           require('./controls/InputControl'),
    LayoutGroup:            require('./controls/LayoutGroup'),
    Scrollable:             require('./controls/Scrollable'),
    ScrollArea:             require('./controls/ScrollArea'),
    ScrollBar:              require('./controls/ScrollBar'),
    ScrollThumb:            require('./controls/ScrollThumb'),
    Slider:                 require('./controls/Slider'),
    TextInput:              require('./controls/TextInput'),
    ToggleButton:           require('./controls/ToggleButton'),

    // layout
    HorizontalLayout:     require('./layout/HorizontalLayout'),
    Layout:               require('./layout/Layout'),
    LayoutAlignment:      require('./layout/LayoutAlignment'),
    TiledColumnsLayout:   require('./layout/TiledColumnsLayout'),
    TiledLayout:          require('./layout/TiledLayout'),
    TiledRowsLayout:      require('./layout/TiledRowsLayout'),
    VerticalLayout:       require('./layout/VerticalLayout'),
    ViewPortBounds:       require('./layout/ViewPortBounds'),

    // shapes
    Diamond:           require('./shapes/Diamond'),
    Ellipse:           require('./shapes/Ellipse'),
    Line:              require('./shapes/Line'),
    Rect:              require('./shapes/Rect'),
    Shape:             require('./shapes/Shape'),

    // skin
    Theme:           require('./skin/Theme')
};

},{"./Control":1,"./Skinable":2,"./controls/Application":3,"./controls/Button":4,"./controls/CheckBox":5,"./controls/InputControl":6,"./controls/LayoutGroup":7,"./controls/ScrollArea":8,"./controls/ScrollBar":9,"./controls/ScrollThumb":10,"./controls/Scrollable":11,"./controls/Slider":12,"./controls/TextInput":13,"./controls/ToggleButton":14,"./layout/HorizontalLayout":16,"./layout/Layout":17,"./layout/LayoutAlignment":18,"./layout/TiledColumnsLayout":19,"./layout/TiledLayout":20,"./layout/TiledRowsLayout":21,"./layout/VerticalLayout":22,"./layout/ViewPortBounds":23,"./shapes/Diamond":24,"./shapes/Ellipse":25,"./shapes/Line":26,"./shapes/Rect":27,"./shapes/Shape":28,"./skin/Theme":29}],16:[function(require,module,exports){
var LayoutAlignment = require('./LayoutAlignment');

/**
 * HorizontalLayout - just set alignment to
 * LayoutAlignment.HORIZONTAL_ALIGNMENT
 *
 * @class HorizontalLayout
 * @extends GOWN.LayoutAlignment
 * @memberof GOWN
 * @constructor
 */
function HorizontalLayout() {
    LayoutAlignment.call(this);
    this.alignment = LayoutAlignment.HORIZONTAL_ALIGNMENT;
}

HorizontalLayout.prototype = Object.create( LayoutAlignment.prototype );
HorizontalLayout.prototype.constructor = HorizontalLayout;
module.exports = HorizontalLayout;

},{"./LayoutAlignment":18}],17:[function(require,module,exports){
/**
 * basic layout stub - see LayoutAlignment
 *
 * @class Layout
 * @memberof GOWN
 * @constructor
 */
function Layout() {
    this.gap = 0;
    this.padding = 0;
}

module.exports = Layout;

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the top.
 *
 * @property VERTICAL_ALIGN_TOP
 * @static
 */
Layout.VERTICAL_ALIGN_TOP = 'top';

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the middle.
 *
 * @property VERTICAL_ALIGN_MIDDLE
 * @static
 */
Layout.VERTICAL_ALIGN_MIDDLE = 'middle';

/**
 * Alignment justified
 *
 * @property ALIGN_JUSTIFY
 * @static
 */
Layout.ALIGN_JUSTIFY = 'justify';

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the bottom.
 *
 * @property VERTICAL_ALIGN_BOTTOM
 * @static
 */
Layout.VERTICAL_ALIGN_BOTTOM = 'bottom';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the left.
 *
 * @property HORIZONTAL_ALIGN_LEFT
 * @static
 */
Layout.HORIZONTAL_ALIGN_LEFT = 'left';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the center.
 *
 * @property HORIZONTAL_ALIGN_CENTER
 * @static
 */
Layout.HORIZONTAL_ALIGN_CENTER = 'center';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the right.
 *
 * @property HORIZONTAL_ALIGN_RIGHT
 * @static
 */
Layout.HORIZONTAL_ALIGN_RIGHT = 'right';



/**
 * The space, in pixels, between items.
 *
 * @property gap
 * @type Number
 */
Object.defineProperty(Layout.prototype, 'gap', {
    get: function() {
        return this._gap;
    },
    set: function(value) {
        if(this._gap === value) {
            return;
        }
        this._gap = value;
        this._needUpdate = true;
    }
});

/**
 * Indicates if the layout needs to be rearranged.
 *
 * @property needUpdate
 * @readonly
 */
Object.defineProperty(Layout.prototype, 'needUpdate', {
    get: function() {
        return this._needUpdate;
    }
});

/**
 * shotrtcut to set all paddings (left, right, top, bottom)
 *
 * @property padding
 * @type Number
 */
Object.defineProperty(Layout.prototype, 'padding', {
    set: function(value) {
        this._paddingLeft = value;
        this._paddingRight = value;
        this._paddingBottom = value;
        this._paddingTop = value;
        this._needUpdate = true;
    },
    get: function (){
        // just return paddingTop, because we do not save the
        // overall padding value (just like feathers)
        return this._paddingTop;
    }
});

/**
 * The minimum space, in pixels, above the items.
 *
 * @default 0
 * @property paddingTop
 * @type Number
 */
Object.defineProperty(Layout.prototype, 'paddingTop', {
    get:  function() {
        return this._paddingTop;
    },
    set: function(value) {
        if(this._paddingTop === value) {
            return;
        }
        this._paddingTop = value;
        this._needUpdate = true;
    }
});

/**
 * The minimum space, in pixels, below the items.
 *
 * @default 0
 * @property paddingTop
 * @type Number
 */
Object.defineProperty(Layout.prototype, 'paddingBottom', {
    get:  function() {
        return this._paddingBottom;
    },
    set: function(value) {
        if(this._paddingBottom === value) {
            return;
        }
        this._paddingBottom = value;
        this._needUpdate = true;
    }
});

/**
 * The space, in pixels, that appears to the left, before the first
 * item.
 *
 * @default 0
 * @property paddingLeft
 * @type Number
 */
Object.defineProperty(Layout.prototype, 'paddingLeft', {
    get:  function() {
        return this._paddingLeft;
    },
    set: function(value) {
        if(this._paddingLeft === value) {
            return;
        }
        this._paddingLeft = value;
        this._needUpdate = true;
    }
});

/**
 * The space, in pixels, that appears to the right, after the last item.
 *
 * @default 0
 * @property paddingLeft
 * @type Number
 */
Object.defineProperty(Layout.prototype, 'paddingRight', {
    get:  function() {
        return this._paddingRight;
    },
    set: function(value) {
        if(this._paddingRight === value) {
            return;
        }
        this._paddingRight = value;
        this._needUpdate = true;
    }
});

/**
 * Position (and possibly resizes) the supplied items.
 *
 * @method layout
 * @param items items that will be layouted {Array}
 * @param viewPortBounds {ViewPortBounds}
 */
/* jshint unused: false */
Layout.prototype.layout = function (items, viewPortBounds) {
};

},{}],18:[function(require,module,exports){
var Layout = require('./Layout');

/**
 * basic layout
 *
 * @class LayoutAlignment
 * @extends GOWN.Layout
 * @memberof GOWN
 * @constructor
 */
function LayoutAlignment() {
    Layout.call(this);
}

LayoutAlignment.prototype = Object.create( Layout.prototype );
LayoutAlignment.prototype.constructor = LayoutAlignment;
module.exports = LayoutAlignment;

LayoutAlignment.VERTICAL_ALIGNMENT = 'vertical';
LayoutAlignment.HORIZONTAL_ALIGNMENT = 'horizontal';

/**
 * apply percentage width/height to items.
 * percentages have higher priorities than fixed with.
 * So if you set a width higher than 0 but also percentWidth,
 * the width will be recalculated according to percentWidth.
 *
 * @method applyPercent
 * @param items
 * @param explicit space we have for the components
 * (this function will handle padding and gap, so the explicitWidth is
 *  for the whole available width)
 */
LayoutAlignment.prototype.applyPercent = function(items, explicit) {
    var _hor = (this.alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT);

    var itemCount = items.length;
    var remaining = explicit;
    var totalExplicit = 0;
    var totalPercent = 0;

    var i, itemPercent, item;
    // sum up width/height required for all items
    for (i = 0; i < itemCount; i++) {
        item = items[i];
        var itemSpace;
        itemPercent = _hor ? item.percentWidth : item.percentHeight;
        itemSpace = _hor ? item.width : item.height;

        if (!isNaN(itemPercent) && itemPercent !== undefined &&
            itemPercent !== null) {
            totalPercent += itemPercent;
        } else if (!isNaN(itemSpace)) {
            // no percentWidth/percentHeight set for this item
            totalExplicit += itemSpace;
        }
    }

    // add space for all gaps
    totalExplicit += this._firstGap > 0 ? this._firstGap : this._gap;
    totalExplicit += (this._gap * (itemCount - 3));
    totalExplicit += this._lastGap > 0 ? this._lastGap : this._gap;

    var padding = _hor ?
        this._paddingLeft + this._paddingRight :
        this._paddingTop + this._paddingBottom;
    totalExplicit += padding;

    // use whole available space - if we do not sum up to 100 we will
    // stretch the items
    if(totalPercent < 100) {
        totalPercent = 100;
    }

    remaining -= totalExplicit;
    var percentToPixels = remaining / totalPercent;
    // claculate width/height for each item based on remaining width/height
    for(i = 0; i < itemCount; i++) {
        item = items[i];
        itemPercent = _hor ? item.percentWidth : item.percentHeight;
        if (itemPercent > 0) {
            if (_hor) {
                item.width = percentToPixels * itemPercent;
            } else {
                item.height = percentToPixels * itemPercent;
            }
        }
    }
};

/**
 * get current gap (includes first and last gap)
 *
 * @method _currentGap
 * @private
 * @param i current item position
 * @param items list of items (to determine if we are at the last gap)
 */
LayoutAlignment.prototype._currentGap = function(i, items) {
    if(!isNaN(this._firstGap) && i === 0)
    {
        return this._firstGap;
    }
    else if(!isNaN(this._lastGap) && i > 0 && i === items.length - 2)
    {
        return this._lastGap;
    }
    return this._gap;
};

/**
 * Position (and possibly resizes) the supplied items.
 *
 * @method layout
 * @param items items that will be layouted {Array}
 * @param viewPortBounds {ViewPortBounds}
 */
LayoutAlignment.prototype.layout = function(items, viewPortBounds) {
    var _hor = (this.alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT);

    // get max. dimensions from viewport bounds
    var explicitWidth = viewPortBounds ? viewPortBounds.explicitWidth : NaN;
    var explicitHeight = viewPortBounds ? viewPortBounds.explicitHeight : NaN;

    var explicitSpace = _hor ? explicitWidth : explicitHeight;
    var paddingStart = _hor ? this._paddingLeft : this._paddingTop;

    // recalculate width/height
    this.applyPercent(items, explicitSpace);

    var position = paddingStart;

    // calculate item position (x/y coordinates)
    for(var i = 0; i < items.length; i++)
    {
        var item = items[i];

        // move item to position calculated in previous loop
        if (_hor) {
            item.x = Math.floor(position);
        } else {
            item.y = Math.floor(position);
        }
        var itemSpace = _hor ? item.width : item.height;
        // calculate position for next item
        position += itemSpace + this._currentGap(i, items);
    }
};

/**
 * The space between the first and second element
 *
 * @property firstGap
 * @type String
 */
Object.defineProperty(LayoutAlignment.prototype, 'firstGap', {
    set: function(value) {
        if (value === this._firstGap) {
            return;
        }
        this._firstGap = value;
        this._needUpdate = true;
    },
    get: function() {
        return this._firstGap;
    }
});

/**
 * The space between the last and second-to-last element
 *
 * @property firstGap
 * @type String
 */
Object.defineProperty(LayoutAlignment.prototype, 'lastGap', {
    set: function(value) {
        if (value === this._lastGap) {
            return;
        }
        this._lastGap = value;
        this._needUpdate = true;
    },
    get: function() {
        return this._lastGap;
    }
});
},{"./Layout":17}],19:[function(require,module,exports){
var TiledLayout = require('./TiledLayout');

/**
 * Tiled columns Layout
 * (roughly based on starling TiledColumnsLayout)
 *
 * @class TiledColumnsLayout
 * @extends GOWN.TiledLayout
 * @memberof GOWN
 * @constructor
 */

function TiledColumnsLayout() {
    TiledLayout.call(this);
    this._paging = TiledLayout.PAGING_VERTICAL;
    this._orientation = TiledLayout.ORIENTATION_COLUMNS;
}

TiledColumnsLayout.prototype = Object.create( TiledLayout.prototype );
TiledColumnsLayout.prototype.constructor = TiledColumnsLayout;
module.exports = TiledColumnsLayout;

/**
 * Quickly sets both <code>horizontalGap</code> and <code>verticalGap</code>
 * to the same value. The <code>gap</code> getter always returns the
 * value of <code>verticalGap</code>, but the value of
 * <code>horizontalGap</code> may be different.
 *
 * @default 0
 *
 * @see #_horizontalGap
 * @see #_verticalGap
 * @property gap
 * @type Number
 */
Object.defineProperty(TiledColumnsLayout.prototype, 'gap', {
    set: function(value) {
        this._verticalGap = value;
        this._horizontalGap = value;
        this._needUpdate = true;
    },
    get: function() {
        return this._verticalGap;
    }
});
},{"./TiledLayout":20}],20:[function(require,module,exports){
var Layout = require('./Layout');

/**
 * TiledLayout a layout for tiled rows/columns
 *
 * @class TiledLayout
 * @extends GOWN.Layout
 * @memberof GOWN
 * @constructor
 */
function TiledLayout() {
    Layout.call(this);
    this._useSquareTiles = false;
    this._horizontalGap = 0;
    this._verticalGap = 0;
    this._tileHorizontalAlign = TiledLayout.TILE_HORIZONTAL_ALIGN_CENTER;
    this._tileVerticalAlign = TiledLayout.TILE_VERTICAL_ALIGN_MIDDLE;
    this._paging = TiledLayout.PAGING_NONE;
    this._orientation = TiledLayout.ORIENTATION_ROWS;
    this._needUpdate = true;
}

TiledLayout.prototype = Object.create( Layout.prototype );
TiledLayout.prototype.constructor = TiledLayout;
module.exports = TiledLayout;


TiledLayout.ORIENTATION_ROWS = 'rows';
TiledLayout.ORIENTATION_COLUMNS = 'columns';

/**
 * If an item height is smaller than the height of a tile, the item will
 * be aligned to the top edge of the tile.
 *
 * @property TILE_VERTICAL_ALIGN_TOP
 * @static
 */
TiledLayout.TILE_VERTICAL_ALIGN_TOP = 'top';

/**
 * If an item height is smaller than the height of a tile, the item will
 * be aligned to the middle of the tile.
 *
 * @property TILE_VERTICAL_ALIGN_MIDDLE
 * @static
 */
TiledLayout.TILE_VERTICAL_ALIGN_MIDDLE = 'middle';

/**
 * If an item height is smaller than the height of a tile, the item will
 * be aligned to the bottom edge of the tile.
 *
 * @property TILE_VERTICAL_ALIGN_BOTTOM
 * @static
 */
TiledLayout.TILE_VERTICAL_ALIGN_BOTTOM = 'bottom';

/**
 * The item will be resized to fit the height of the tile.
 *
 * @property TILE_VERTICAL_ALIGN_JUSTIFY
 * @static
 */
TiledLayout.TILE_VERTICAL_ALIGN_JUSTIFY = 'justify';

/**
 * If an item width is smaller than the width of a tile, the item will
 * be aligned to the left edge of the tile.
 *
 * @property TILE_HORIZONTAL_ALIGN_LEFT
 * @static
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_LEFT = 'left';

/**
 * If an item width is smaller than the width of a tile, the item will
 * be aligned to the center of the tile.
 *
 * @property TILE_HORIZONTAL_ALIGN_CENTER
 * @static
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_CENTER = 'center';

/**
 * If an item width is smaller than the width of a tile, the item will
 * be aligned to the right edge of the tile.
 *
 * @property TILE_HORIZONTAL_ALIGN_RIGHT
 * @static
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_RIGHT = 'right';

/**
 * The item will be resized to fit the width of the tile.
 *
 * @property TILE_HORIZONTAL_ALIGN_JUSTIFY
 * @static
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_JUSTIFY = 'justify';

/**
 * The items will be positioned in pages horizontally from left to right.
 *
 * @property PAGING_HORIZONTAL
 * @static
 */
TiledLayout.PAGING_HORIZONTAL = 'horizontal';

/**
 * The items will be positioned in pages vertically from top to bottom.
 *
 * @property PAGING_VERTICAL
 * @static
 */
TiledLayout.PAGING_VERTICAL = 'vertical';


/**
 * Positions (and possibly resizes) the supplied items.
 *
 * @method layout
 * @param items items that will be layouted
 * @param viewPortBounds
 */
TiledLayout.prototype.layout = function (items, viewPortBounds) {
    var _rows = this._orientation === TiledLayout.ORIENTATION_ROWS;
    if(items.length === 0) {
        return;
    }

    var maxWidth = viewPortBounds ? viewPortBounds.maxWidth : Number.POSITIVE_INFINITY;
    var maxHeight = viewPortBounds ? viewPortBounds.maxHeight : Number.POSITIVE_INFINITY;
    var explicitWidth = viewPortBounds ? viewPortBounds.explicitWidth : NaN;
    var explicitHeight = viewPortBounds ? viewPortBounds.explicitHeight : NaN;

    var i, item;
    var tileWidth = 0;
    var tileHeight = 0;

    // get size for tiles by saving the highest/widest tile.
    for(i = 0; i < items.length; i++) {
        item = items[i];
        if(!item) {
            continue;
        }
        var itemWidth = item.width;
        var itemHeight = item.height;
        if(itemWidth > tileWidth) {
            tileWidth = itemWidth;
        }
        if(itemHeight > tileHeight) {
            tileHeight = itemHeight;
        }
    }

    // make tiles square
    if (this._useSquareTiles) {
        if(tileWidth > tileHeight) {
            tileHeight = tileWidth;
        }
        else if(tileHeight > tileWidth) {
            tileWidth = tileHeight;
        }
    }

    // calculate tiles needed (and their width/height)
    var availableWidth = NaN;
    var availableHeight = NaN;

    var horizontalTileCount = _rows ? items.length : 1;

    if(!isNaN(explicitWidth)) {
        availableWidth = explicitWidth;
        horizontalTileCount = (explicitWidth -
            this._paddingLeft - this._paddingRight +
            this._horizontalGap) / (tileWidth + this._horizontalGap);
    }
    else if(!isNaN(maxWidth)) {
        availableWidth = maxWidth;
        horizontalTileCount = (maxWidth -
            this._paddingLeft - this._paddingRight +
            this._horizontalGap) / (tileWidth + this._horizontalGap);
    }
    horizontalTileCount = Math.floor(Math.max(horizontalTileCount, 1));

    var verticalTileCount = _rows ? 1 : items.length;
    if(!isNaN(explicitHeight)) {
        availableHeight = explicitHeight;
        verticalTileCount = (explicitHeight -
            this._paddingTop - this._paddingBottom +
            this._verticalGap) / (tileHeight + this._verticalGap);
    } else if(!isNaN(maxHeight)) {
        availableHeight = maxHeight;
        verticalTileCount = (maxHeight -
            this._paddingTop - this._paddingBottom +
            this._verticalGap) / (tileHeight + this._verticalGap);
    }
    verticalTileCount = Math.floor(Math.max(verticalTileCount, 1));

    var startX = this._paddingLeft;
    var startY = this._paddingTop;

    var perPage = horizontalTileCount * verticalTileCount;
    var pageIndex = 0;
    var nextPageStartIndex = perPage;
    var pageStart = _rows ? startX : startY;
    var positionX = startX;
    var positionY = startY;
    var itemIndex = 0;
    for(i = 0; i < items.length; i++)
    {
        item = items[i];
        if (_rows) {
            if(itemIndex !== 0 && itemIndex % horizontalTileCount === 0)
            {
                positionX = pageStart;
                positionY += tileHeight + this._verticalGap;
            }
        } else { // columns
            if(itemIndex !== 0 && i % verticalTileCount === 0)
            {
                positionX += tileWidth + this._horizontalGap;
                positionY = pageStart;
            }
        }
        if(itemIndex === nextPageStartIndex) {
            pageIndex++;
            nextPageStartIndex += perPage;

            //we can use availableWidth and availableHeight here without
            //checking if they're NaN because we will never reach a
            //new page without them already being calculated.
            if (_rows) {
                if(this._paging === TiledLayout.PAGING_HORIZONTAL)
                {
                    positionX = pageStart === startX + availableWidth * pageIndex;
                    positionY = startY;
                } else if(this._paging === TiledLayout.PAGING_VERTICAL) {
                    positionY = startY + availableHeight * pageIndex;
                }
            } else { // columns
                if(this._paging === TiledLayout.PAGING_HORIZONTAL) {
                    positionX = startX + availableWidth * pageIndex;
                } else if(this._paging === TiledLayout.PAGING_VERTICAL) {
                    positionX = startX;
                    positionY = pageStart = startY + availableHeight * pageIndex;
                }
            }
        }
        if(item) {
            switch(this._tileHorizontalAlign) {
                case TiledLayout.TILE_HORIZONTAL_ALIGN_JUSTIFY:
                    item.x = positionX;
                    item.width = tileWidth;
                    break;
                case TiledLayout.TILE_HORIZONTAL_ALIGN_LEFT:
                    item.x = positionX;
                    break;
                case TiledLayout.TILE_HORIZONTAL_ALIGN_RIGHT:
                    item.x = positionX + tileWidth - item.width;
                    break;
                default: //center or unknown
                    item.x = positionX + (tileWidth - item.width) / 2;
            }
            switch(this._tileVerticalAlign) {
                case TiledLayout.TILE_VERTICAL_ALIGN_JUSTIFY:
                    item.y = positionY;
                    item.height = tileHeight;
                    break;
                case TiledLayout.TILE_VERTICAL_ALIGN_TOP:
                    item.y = positionY;
                    break;
                case TiledLayout.TILE_VERTICAL_ALIGN_BOTTOM:
                    item.y = positionY + tileHeight - item.height;
                    break;
                default: //middle or unknown
                    item.y = positionY + (tileHeight - item.height) / 2;
            }
        }
        if (_rows) {
            positionX += tileWidth + this._horizontalGap;
        } else { // columns
            positionY += tileHeight + this._verticalGap;
        }
        itemIndex++;
    }

    this._needUpdate = false;
};

/**
 * use same width and height for the tiles (calculated by biggest square)
 *
 * @property useSquareTiles
 * @type Boolean
 */
Object.defineProperty(TiledLayout.prototype, 'useSquareTiles', {
    set: function(useSquareTiles) {
        this._useSquareTiles = useSquareTiles;
        this._needUpdate = true;
    },
    get: function() {
        return this._useSquareTiles;
    }
});
},{"./Layout":17}],21:[function(require,module,exports){
var TiledLayout = require('./TiledLayout');

/**
 * Tiled rows Layout
 * (roughly based on starling TiledRowsLayout)
 *
 * @class TiledRowsLayout
 * @extends GOWN.TiledLayout
 * @memberof GOWN
 * @constructor
 */
function TiledRowsLayout() {
    TiledLayout.call(this);
    this._paging = TiledLayout.PAGING_HORIZONTAL;
    this._orientation = TiledLayout.ORIENTATION_ROWS;
}

TiledRowsLayout.prototype = Object.create( TiledLayout.prototype );
TiledRowsLayout.prototype.constructor = TiledRowsLayout;
module.exports = TiledRowsLayout;

/**
 * Quickly sets both <code>horizontalGap</code> and <code>verticalGap</code>
 * to the same value. The <code>gap</code> getter always returns the
 * value of <code>horizontalGap</code>, but the value of
 * <code>verticalGap</code> may be different.
 *
 * @default 0
 *
 * @see #_horizontalGap
 * @see #_verticalGap
 *
 * @property gap
 * @type Number
 */
Object.defineProperty(TiledRowsLayout.prototype, 'gap', {
    get: function() {
        return this._horizontalGap;
    },
    set: function(value) {
        this._verticalGap = value;
        this._horizontalGap = value;
        this._needUpdate = true;
    }
});
},{"./TiledLayout":20}],22:[function(require,module,exports){
var LayoutAlignment = require('./LayoutAlignment');

/**
 * VerticalLayout - just set alignment to
 * LayoutAlignment.VERTICAL_ALIGNMENT
 *
 * @class VerticalLayout
 * @extends GOWN.LayoutAlignment
 * @memberof GOWN
 * @constructor
 */
function VerticalLayout() {
    LayoutAlignment.call(this);
    this.alignment = LayoutAlignment.VERTICAL_ALIGNMENT;
}

VerticalLayout.prototype = Object.create( LayoutAlignment.prototype );
VerticalLayout.prototype.constructor = VerticalLayout;
module.exports = VerticalLayout;

},{"./LayoutAlignment":18}],23:[function(require,module,exports){
/**
 * define viewport dimensions
 *
 * @class HorizontalLayout
 * @memberof GOWN
 * @constructor
 */
function ViewPortBounds() {
    /**
     * The explicit width of the view port, in pixels. If <code>NaN</code>,
     * there is no explicit width value.
     *
     * @property explicitWidth
     */
    this.explicitWidth = NaN;

    /**
     * The explicit height of the view port, in pixels. If <code>NaN</code>,
     * there is no explicit height value.
     *
     * @property explicitHeight
     */
    this.explicitHeight = NaN;

    /**
     * x-position
     *
     * @property x
     */
    this.x = 0;

    /**
     * y-position
     *
     * @property y
     */
    this.y = 0;
}

module.exports = ViewPortBounds;
},{}],24:[function(require,module,exports){
var Shape = require('./Shape');

/**
 * basic diamond shape
 *
 * @class Diamond
 * @extends GOWN.Shape
 * @memberof GOWN
 * @constructor
 */
function Diamond(color, alpha, width, height) {
    Shape.call(this, color, alpha, width, height);
}

Diamond.prototype = Object.create( Shape.prototype );
Diamond.prototype.constructor = Diamond;
module.exports = Diamond;

/**
 * draw the diamond during redraw.
 *
 * @method _drawShape
 * @private
 */
Diamond.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    this.graphics.moveTo(this._width/2, 0)
        .lineTo(this._width, this._height/2)
        .lineTo(this._width/2, this._height)
        .lineTo(0, this._height/2)
        .lineTo(this._width/2, 0);
};
},{"./Shape":28}],25:[function(require,module,exports){
var Shape = require('./Shape');

/**
 * basic ellipse shape
 *
 * @class Ellipse
 * @extends GOWN.Shape
 * @memberof GOWN
 * @constructor
 */
function Ellipse(color, alpha, width, height) {
    Shape.call(this, color, alpha, width, height);
}

Ellipse.prototype = Object.create( Shape.prototype );
Ellipse.prototype.constructor = Ellipse;
module.exports = Ellipse;

/**
 * draw the ellipse during redraw.
 *
 * @method _drawShape
 * @private
 */
Ellipse.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    this.drawEllipse(0, 0, this.width, this.height);
};
},{"./Shape":28}],26:[function(require,module,exports){
var Shape = require('./Shape');

/**
 * basic line
 *
 * @class Line
 * @extends GOWN.Shape
 * @memberof GOWN
 * @constructor
 */

function Line(color, alpha, width, height, reverse) {
    Shape.call(this, color, alpha, width, height);
    this._reverse = reverse;
}

Line.prototype = Object.create( Shape.prototype );
Line.prototype.constructor = Line;
module.exports = Line;

/**
 * draw the rect during redraw. will use drawRoundRect if a radius is provided.
 *
 * @method _drawShape
 * @private
 */
Line.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    if (this.reverse) {
        this.moveTo(this._width, 0);
        this.lineTo(0, this._height);
    } else {
        this.moveTo(0, 0);
        this.lineTo(this._width, this._height);
    }
};

/**
 * The radius of the rectangle border, setting this will redraw the component.
 *
 * @property color
 * @type Number
 */
Object.defineProperty(Line.prototype, 'reverse', {
    get: function() {
        return this._reverse;
    },
    set: function(reverse) {
        this._reverse = reverse;
        this.invalid = true;
    }
});

},{"./Shape":28}],27:[function(require,module,exports){
var Shape = require('./Shape');

/**
 * basic rectangular shape
 *
 * @class Rect
 * @extends GOWN.Shape
 * @memberof GOWN
 * @constructor
 */

function Rect(color, alpha, width, height, radius) {
    Shape.call(this, color, alpha, width, height);
    this._radius = radius;
}

Rect.prototype = Object.create( Shape.prototype );
Rect.prototype.constructor = Rect;
module.exports = Rect;

/**
 * draw the rect during redraw. will use drawRoundRect if a radius is provided.
 *
 * @method _drawShape
 * @private
 */
Rect.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    if (this.radius) {
        this.drawRoundedRect(0, 0,
            this._width, this._height,
            this.radius);
    } else {
        this.drawRect(0, 0, this._width, this._height);
    }
};

/**
 * The radius of the rectangle border, setting this will redraw the component.
 *
 * @property color
 * @type Number
 */
Object.defineProperty(Rect.prototype, 'radius', {
    get: function() {
        return this._radius;
    },
    set: function(radius) {
        this._radius = radius;
        this.invalid = true;
    }
});
},{"./Shape":28}],28:[function(require,module,exports){
/**
 * shape base class
 *
 * @class Shape
 * @extends PIXI.Graphics
 * @memberof GOWN
 * @constructor
 */
function Shape(color, alpha, width, height) {
    PIXI.Graphics.call(this);
    this._color = color;
    this._alpha = alpha || 1.0;
    this._width = width;
    this._height = height;
    this.invalid = true;
}

Shape.prototype = Object.create( PIXI.Graphics.prototype );
Shape.prototype.constructor = Shape;
module.exports = Shape;

// setter/getter
/**
 * The width of the shape, setting this will redraw the component.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(width) {
        this._width = width;
        this.invalid = true;
    }
});

/**
 * The height of the shape, setting this will redraw the component.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(height) {
        this._height = height;
        this.invalid = true;
    }
});

/**
 * The fill color of the shape, setting this will redraw the component.
 *
 * @property color
 * @type Number
 */

Object.defineProperty(Shape.prototype, 'color', {
    get: function() {
        return this._color;
    },
    set: function(color) {
        this._color = color;
        this.invalid = true;
    }
});

/**
 * The alpha of the shape, setting this will redraw the component.
 *
 * @property alpha
 * @type Number
 */

Object.defineProperty(Shape.prototype, 'alpha', {
    get: function() {
        return this._alpha;
    },
    set: function(alpha) {
        this._alpha = alpha;
        this.invalid = true;
    }
});

/**
 * apply the color to the shape (called during redraw)
 *
 * @method applyColor
 */
Shape.prototype.applyColor = function() {
    this.beginFill(this.color, this.alpha);
};

/**
 * apply the border around shape (called during redraw)
 *
 * @method drawBorder
 */
Shape.prototype.drawBorder = function() {
    if (this.border) {
        this.lineStyle(this.border, this.borderColor);
    }
};

/**
 * draw the shape during redraw. defaults to a simple rect
 *
 * @method _drawShape
 * @private
 */
Shape.prototype._drawShape = function() {
    if (this.width <= 0 || this.height <= 0) {
        return;
    }
    // default shape is a rect
    this.drawRect(0, 0, this._width, this._height);
};


Shape.prototype.updateTransform = function() {
    this.redraw();

    PIXI.Graphics.prototype.updateTransform.call(this);
};


/**
 * update before draw call
 * redraw control for current state from theme
 *
 * @method redraw
 */
Shape.prototype.redraw = function() {
    if(!this.invalid) {
        return;
    }

    this.clear();
    this.applyColor();
    this.drawBorder();
    this._drawShape();

    this.invalid = false;
};

},{}],29:[function(require,module,exports){
var ScaleContainer = require('../../utils/ScaleContainer');
var ThemeFont = require('./ThemeFont');
/**
 * basic theming/skinning.
 *
 * @class Theme
 * @memberof GOWN
 * @constructor
 */
function Theme(global) {
    // at its core a theme is just a dict that holds a collection of skins
    this._skins = {};

    // default font for labels (e.g. buttons)
    this.textStyle = this.textStyle || new ThemeFont();
    this.textStyle.clone();

    if (global === true || global === undefined) {
        GOWN.theme = this;
    }
    this.textureCache = null;
    // own skin for scroll/slider track
    // (uses the default button skin otherwise)
    this.thumbSkin = true;

    // desktop themes have a hover skin if the mouse moves over the button
    this.hoverSkin = true;
}
module.exports = Theme;

/**
 * Set skin for ui component
 *
 * @method setSkin
 * @param comp ui-component that we want to skin, e.g. "button" {String}
 * @param id id for the skin (e.g. state when the skinning function will be applied {String}
 * @param skin skin-function that will executed once the component gets updated  {String}
 */
Theme.prototype.setSkin = function(comp, id, skin) {
    this._skins[comp] = this._skins[comp] || {};
    this._skins[comp][id] = skin;
    // TODO: dispatch event - the skin of "comp"
};

/**
 * Set up the asset loader and load files
 *
 * @method loadImage
 * @param jsonPath {Array}
 */
Theme.prototype.loadImage = function(jsonPath) {
    this._jsonPath = jsonPath;
    GOWN.loader
        .add(jsonPath)
        .load(this.loadComplete.bind(this));
};

/**
 * executed when loadImage has finished
 *
 * @method loadComplete
 */
Theme.prototype.loadComplete = function(loader, resources) {
    this.textureCache = resources.resources[this._jsonPath].textures;
};

/**
 * Create new Scalable Container
 *
 * @method getScaleContainer
 * @param name id defined in the asset loader {String}
 * @param grid grid defining the inner square of the scalable container {Rectangle}
 * @returns {Function}
 */
Theme.prototype.getScaleContainer = function(name, grid) {
    var scope = this;
    return function() {
        var texture = scope.textureCache[name];
        if(!texture) {
            throw new Error('The frameId "' + name + '" does not exist ' +
            'in the texture cache');
        }
        return new ScaleContainer(texture, grid);

    };
};

/**
 * Create new Sprite from image name
 *
 * @method getImage
 * @param name id defined in the asset loader {String}
 * @returns {Function}
 */
Theme.prototype.getImage = function(name) {
    var scope = this;
    return function() {
        return new PIXI.Sprite(scope.textureCache[name]);
    };
};

/**
 * Get skin by component and state (or type)
 *
 * @method getSkin
 * @param comp name of the component (e.g. button) {String}
 * @param state (state or type of the skin e.g. "up") {String}
 * @returns {DisplayObject}
 */
Theme.prototype.getSkin = function(comp, state) {
    if (this._skins[comp] && this._skins[comp][state]) {
        return this._skins[comp][state]();
    }
    return null;
};

/**
 * Shortcut to remove the theme from global context
 *
 * @method removeTheme
 */
Theme.removeTheme = function() {
    GOWN.theme = undefined;
};

},{"../../utils/ScaleContainer":33,"./ThemeFont":30}],30:[function(require,module,exports){
var OPTIONS = ['fontSize', 'fontFamily', 'fill', 'align', 'stroke',
               'strokeThickness', 'wordWrap', 'wordWrapWidth', 'lineHeight',
               'dropShadow', 'dropShadowColor', 'dropShadowAngle',
               'dropShadowDistance', 'padding', 'textBaseline',
               'lineJoin', 'miterLimit'];

/**
 * @class ThemeFont
 * @memberof GOWN
 * @constructor
 */
function ThemeFont(data) {
    for(var key in data) {
        if(OPTIONS.indexOf(key) !== -1) {
            this[key] = data[key];
        }
    }

    this.fill = this.fill || '#000';
    // default font for label (e.g. buttons)
    this._fontFamily = this._fontFamily || 'Arial';
    this._fontSize = this._fontSize || 12;
}

module.exports = ThemeFont;


/**
 * clone ThemeFont instance
 *
 * @method clone
 */
ThemeFont.prototype.clone = function() {
    var re = new ThemeFont();
    for(var key in this) {
        if(OPTIONS.indexOf(key) !== -1) {
            re[key] = this[key];
        }
    }
    return re;
};

/**
 * update font string
 *
 * @method _updateFont
 * @private
 */
ThemeFont.prototype._updateFont = function() {
    this._font = this._fontSize + 'px ' + this._fontFamily;
};

/**
 * instead of setting font using fontFamily and fontSize is encouraged
 *
 * @property font
 * @type String
 */
Object.defineProperty(ThemeFont.prototype, 'font', {
    get: function() {
        return this._font;
    }
});


/**
 * Font Size
 *
 * @property fontSize
 * @type Number
 */
Object.defineProperty(ThemeFont.prototype, 'fontSize', {
    get: function() {
        return this._fontSize;
    },
    set: function(value) {
        this._fontSize = value;
        this._updateFont();
    }
});


/**
 * Font Familiy
 *
 * @property fontFamily
 * @type String
 */
Object.defineProperty(ThemeFont.prototype, 'fontFamily', {
    get: function() {
        return this._fontFamily;
    },
    set: function(value) {
        this._fontFamily = value;
        this._updateFont();
    }
});

},{}],31:[function(require,module,exports){
(function (global){
if (typeof PIXI === 'undefined') {
    if (window.console) {
        window.console.warn('pixi.js has to be loaded before loading gown.js');
    }
} else {

    var core = module.exports = require('./core');

    // add core plugins.
    core.utils          = require('./utils');

    // use default pixi loader
    core.loader = PIXI.loader;

    // mixin the deprecation features.
    //Object.assign(core, require('./deprecation'));

    // export GOWN globally.
    global.GOWN = core;

}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./core":15,"./utils":35}],32:[function(require,module,exports){
/**
 * Wrapper for DOM Text Input
 *
 * based on PIXI.Input InputObject by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class InputWrapper
 * @memberof GOWN
 * @static
 */
function InputWrapper()
{
}
module.exports = InputWrapper;

/**
 * DOM input field.
 * we use one input field for all InputControls
 *
 * @property hiddenInput
 * @type DOMObject
 * @static
 */
InputWrapper.hiddenInput = null;

/**
 * create/return unique input field.
 * @returns {DOMObject}
 */
InputWrapper.createInput = function()
{
    if (!InputWrapper.hiddenInput) {
        var input = document.createElement('input');
        input.type = 'text';
        input.tabindex = -1;
        input.style.position = 'fixed';
        input.style.opacity = 0;
        input.style.pointerEvents = 'none';
        input.style.left = '0px';
        input.style.bottom = '0px';
        input.style.left = '-100px';
        input.style.top = '-100px';
        input.style.zIndex = 10;

        // add blur handler
        input.addEventListener('blur', function()
        {
            if (GOWN.InputControl.currentInput)
            {
                GOWN.InputControl.currentInput.onMouseUpOutside();
            }
        }, false);

        // on key down
        input.addEventListener('keydown', function(e)
        {
            if (GOWN.InputControl.currentInput)
            {
                e = e || window.event;
                if (GOWN.InputControl.currentInput.hasFocus)
                {
                    GOWN.InputControl.currentInput.onKeyDown(e);
                }
            }
        });

        // on key up
        input.addEventListener('keyup', function(e)
        {
            if(GOWN.InputControl.currentInput)
            {
                e = e || window.event;
                if (GOWN.InputControl.currentInput.hasFocus)
                {
                    GOWN.InputControl.currentInput.onKeyUp(e);
                }
            }
        });

        document.body.appendChild(input);

        InputWrapper.hiddenInput = input;
    }
    return InputWrapper.hiddenInput;
};

/**
 * key to get text ('value' for default input field)
 * @type {string}
 * @static
 * @private
 */
InputWrapper.textProp = 'value';

/**
 * activate the text input
 */
InputWrapper.focus = function()
{
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.focus();
    }
};

/**
 * deactivate the text input
 */
InputWrapper.blur = function()
{
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.blur();
    }
};


/**
 * set selection
 * @returns {DOMObject}
 */
InputWrapper.setSelection = function(start, end)
{
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.selectionStart = start;
        InputWrapper.hiddenInput.selectionEnd = end;
    } else {
        InputWrapper._selection = [start, end];
    }
};

/**
 * get start and end of selection
 * @returns {Array}
 */
InputWrapper.getSelection = function() {
    if (InputWrapper.hiddenInput) {
        return [
            InputWrapper.hiddenInput.selectionStart,
            InputWrapper.hiddenInput.selectionEnd
        ];
    } else {
        return InputWrapper._selection;
    }
};

/**
 * get text value from hiddenInput
 * @returns {String}
 */
InputWrapper.getText = function() {
    if (InputWrapper.hiddenInput) {
        var textProp = InputWrapper.textProp;
        var txt = InputWrapper.hiddenInput[textProp];
        return txt.replace(/\r/g, '');
    } else {
        return InputWrapper._text;
    }

};

/**
 * get text value to hiddenInput
 * @param {String} text
 */
InputWrapper.setText = function(text) {
    if (InputWrapper.hiddenInput) {
        var textProp = InputWrapper.textProp;
        InputWrapper.hiddenInput[textProp] = text;
    } else {
        InputWrapper._text = text;
    }
};

/**
 * set max. length setting it to 0 will allow unlimited text input
 * @param length
 */
InputWrapper.setMaxLength = function(length) {
    if (InputWrapper.hiddenInput) {
        if (!length || length < 0) {
            InputWrapper.hiddenInput.removeAttribute('maxlength');
        } else {
            InputWrapper.hiddenInput.setAttribute('maxlength', length);
        }
    } else {
        InputWrapper._maxLength = length;
    }
};

InputWrapper.setType = function(type) {
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.type = type;
    } else {
        InputWrapper._type = type;
    }
};

InputWrapper.getType = function() {
    if (InputWrapper.hiddenInput) {
        return InputWrapper.hiddenInput.type;
    } else {
        return InputWrapper._type;
    }
};
},{}],33:[function(require,module,exports){
/**
 * Scale 9 Container.
 * e.g. useful for scalable buttons.
 *
 * @class ScaleContainer
 * @extends PIXI.Container
 * @memberof GOWN
 * @constructor
 */

function ScaleContainer(texture, rect) {
    PIXI.Container.call( this );

    this.rect = rect;
    this.baseTexture = texture.baseTexture;
    this.frame = texture.frame;

    this._width = this.frame.width;
    this._height = this.frame.height;

    // left / middle / right width
    var lw = rect.x;
    var mw = rect.width;
    var rw = this.frame.width - (mw + lw);

    // top / center / bottom height
    var th = rect.y;
    var ch = rect.height;
    var bh = this.frame.height - (ch + th);

    // top
    if (lw > 0 && th > 0) {
        this.tl = this._getTexture(0, 0, lw, th);
        this.addChild(this.tl);
    }
    if (mw > 0 && th > 0) {
        this.tm = this._getTexture(lw, 0, mw, th);
        this.addChild(this.tm);
        this.tm.x = lw;
    }
    if (rw > 0 && th > 0) {
        this.tr = this._getTexture(lw + mw, 0, rw, th);
        this.addChild(this.tr);
    }

    // center
    if (lw > 0 && ch > 0) {
        this.cl = this._getTexture(0, th, lw, ch);
        this.addChild(this.cl);
        this.cl.y = th;
    }
    if (mw > 0 && ch > 0) {
        this.cm = this._getTexture(lw, th, mw, ch);
        this.addChild(this.cm);
        this.cm.y = th;
        this.cm.x = lw;
    }
    if (rw > 0 && ch > 0) {
        this.cr = this._getTexture(lw + mw, th, rw, ch);
        this.addChild(this.cr);
        this.cr.y = th;
    }

    // bottom
    if (lw > 0 && bh > 0) {
        this.bl = this._getTexture(0, th + ch, lw, bh);
        this.addChild(this.bl);
    }
    if (mw > 0 && bh > 0) {
        this.bm = this._getTexture(lw, th + ch, mw, bh);
        this.addChild(this.bm);
        this.bm.x = lw;
    }
    if (rw > 0 && bh > 0) {
        this.br = this._getTexture(lw + mw, th + ch, rw, bh);
        this.addChild(this.br);
    }
}

// constructor
ScaleContainer.prototype = Object.create( PIXI.Container.prototype );
ScaleContainer.prototype.constructor = ScaleContainer;
module.exports = ScaleContainer;

/**
 * set scaling width and height
 *
 * @method _updateScales
 * @private
 */
ScaleContainer.prototype._updateScales = function() {
    this._positionTilable();

    var scaleOriginals = this.scaleOriginals = {};

    var scaleOriginal = function(name, elem) {
        if (elem && elem.width && elem.height) {
            scaleOriginals[name] = {
                width: elem.width,
                height: elem.height
            };
        }
    };

    scaleOriginal('tl', this.tl);
    scaleOriginal('tm', this.tm);
    scaleOriginal('tr', this.tr);

    scaleOriginal('cl', this.cl);
    scaleOriginal('cm', this.cm);
    scaleOriginal('cr', this.cr);

    scaleOriginal('bl', this.bl);
    scaleOriginal('bm', this.bm);
    scaleOriginal('br', this.br);
};

/**
 * create a new texture from a base-texture by given dimensions
 *
 * @method _getTexture
 * @private
 */
ScaleContainer.prototype._getTexture = function(x, y, w, h) {
    var frame = new PIXI.Rectangle(this.frame.x+x, this.frame.y+y, w, h);
    var t = new PIXI.Texture(this.baseTexture, frame, frame.clone(), null);
    return new PIXI.Sprite(t);
};

/**
 * The width of the container, setting this will redraw the component.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(ScaleContainer.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        if (this._width !== value) {
            this._width = value;
            this.invalid = true;
            this._updateScales();
        }
    }
});

/**
 * The height of the container, setting this will redraw the component.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(ScaleContainer.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        if (this._height !== value) {
            this._height = value;
            this.invalid = true;
            this._updateScales();
        }
    }
});

/**
 * update before draw call (reposition textures)
 *
 * @method redraw
 */
ScaleContainer.prototype.redraw = function() {
    if (this.invalid) {
        this._positionTilable();
        this.invalid = false;
    }
};

/**
 * recalculate the position of the tiles (every time width/height changes)
 *
 * @method _positionTilable
 * @private
 */
ScaleContainer.prototype._positionTilable = function() {
    // left / middle / right width
    var lw = this.rect.x;
    var mw = this.rect.width;
    var rw = this.frame.width - (mw + lw);

    // top / center / bottom height
    var th = this.rect.y;
    var ch = this.rect.height;
    var bh = this.frame.height - (ch + th);

    var rightX = this._width - rw;
    var bottomY = this._height - bh;
    if (this.cr) {
        this.cr.x = rightX;
    }
    if (this.br) {
        this.br.x = rightX;
        this.br.y = bottomY;
    }
    if (this.tr) {
        this.tr.x = rightX;
    }

    var middleWidth = this._width - (lw + rw);
    var centerHeight = this._height - (th + bh);
    if (this.cm) {
        this.cm.width = middleWidth;
        this.cm.height = centerHeight;
    }
    if (this.bm) {
        this.bm.width = middleWidth;
        this.bm.y = bottomY;
    }
    if (this.tm) {
        this.tm.width = middleWidth;
    }
    if (this.cl) {
        this.cl.height = centerHeight;
    }
    if (this.cr) {
        this.cr.height = centerHeight;
    }

    if (this.bl) {
        this.bl.y = bottomY;
    }
};

/**
 *
 * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
 * The frame ids are created when a Texture packer file has been loaded
 *
 * @method fromFrame
 * @static
 * @param frameId {String} The frame Id of the texture in the cache
 * @param rect {Rectangle} defines tilable area
 * @return {ScaleTexture} A new Scalable Texture (e.g. a button) using a texture from the texture cache matching the frameId
 */
ScaleContainer.fromFrame = function(frameId, rect) {
    var texture = PIXI.utils.TextureCache[frameId];
    if(!texture) {
        throw new Error('The frameId "' + frameId + '" does not exist ' +
                        'in the texture cache');
    }
    return new ScaleContainer(texture, rect);
};

},{}],34:[function(require,module,exports){
/**
 * Holds all information related to a Slider change event
 *
 * @class SliderData
 * @memberof GOWN
 * @constructor
 */
function SliderData()
{
    this.value = 0;
    /**
     * The target Sprite that was interacted with
     *
     * @property target
     * @type Sprite
     */
    this.target = null;
}

module.exports = SliderData;

},{}],35:[function(require,module,exports){
/**
 * @file        Main export of the gown.js util library
 * @author      Andreas Bresser <andreasbresser@gmail.com>
 * @copyright   2015 Andreas Bresser
 * @license     {@link https://github.com/brean/gown.js/blob/master/LICENSE|Apache License}
 */

/**
 * @namespace GOWN.util
 */
module.exports = {
    InputWrapper:           require('./InputWrapper'),
    mouseWheelSupport:      require('./mouseWheelSupport'),
    position:               require('./position'),
    ScaleContainer:         require('./ScaleContainer'),
    SliderData:             require('./SliderData'),
    resizeScaling:          require('./resizeScaling'),
    mixin:                  require('./mixin')
};

},{"./InputWrapper":32,"./ScaleContainer":33,"./SliderData":34,"./mixin":36,"./mouseWheelSupport":37,"./position":38,"./resizeScaling":39}],36:[function(require,module,exports){
module.exports = function(destination, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            if(key === 'defineProperty') {
                for (var name in source[key]) {
                    var data = source[key][name];
                    if (data.configurable === undefined) {
                         // We change our default case, so that we can
                         // overwrite properties later on
                        data.configurable = true;
                    }
                    Object.defineProperty(destination, name, data);
                }
            } else {
                destination[key] = source[key];
            }
        }
    }
    return destination;
};

},{}],37:[function(require,module,exports){
/**
 * TODO: make it work with PIXI (this is just copied from createjs_ui / WIP)
 * (e.g. get currently selected object using this.stage.interactionManager.hitTest(this, e)
 * and then execute an "onwheel"-callback)
 *
 * enable or disable mouse wheel support for canvas (e.g. for scroller)
 * using HTML 5 scrolling. will do nothing if it is already activated/
 * deactivated
 * based on http://www.sitepoint.com/html5-javascript-mouse-wheel/
 * @param stage the PIXI-stage
 * @param enable true to enable mouse support, false to disable,
 */
function mouseWheelSupport(stage, enable) {
    var canvas = stage.canvas;
    if (enable || enable === undefined) {
        if (GOWN._mouseWheelHandler !== undefined) {
            return;
        }
        GOWN._mouseWheelHandler = function(event) {
            event = window.event || event;
            var delta = Math.max(-1, Math.min(1,
                (event.wheelDelta || -event.detail)));

            var target = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY, 1);
            if (!target) {
                return;
            }
            for(var i = 0; i < target.length; i++) {
                var t = target[i];
                t.mouseMove(delta);
                /*
                var evt = new createjs.MouseEvent(
                    "mousewheel", true, false,
                    t.x, t.y, event, -1, true, t.rawX, t.rawY);
                evt.delta = delta;
                t.dispatchEvent(evt);
                */
            }
        };
        if (canvas.addEventListener) {
            canvas.addEventListener('mousewheel',
                GOWN._mouseWheelHandler, false);
            canvas.addEventListener('DOMMouseScroll',
                GOWN._mouseWheelHandler, false);
        } else {
            canvas.attachEvent('onmousewheel',
                GOWN._mouseWheelHandler);
        }
    } else {
        if (GOWN._mouseWheelHandler === undefined) {
            return;
        }
        if (canvas.removeEventListener) {
            canvas.removeEventListener('mousewheel',
                GOWN._mouseWheelHandler);
            canvas.removeEventListener('DOMMouseScroll',
                GOWN._mouseWheelHandler);
        } else {
            canvas.detachEvent('onmousewheel',
                GOWN._mouseWheelHandler);
        }
        GOWN._mouseWheelHandler = undefined;
    }
}

module.exports = mouseWheelSupport;
},{}],38:[function(require,module,exports){
/**
 * center element on parent vertically
 * @param elem
 * @param parent (optional)
 * @method centerVertical
 */
function centerVertical(elem, parent) {
    parent = parent || elem.parent;
    elem.y = Math.floor((parent.height - elem.height ) / 2);
}

/**
 *
 * @param elem
 * @param parent (optional)
 */
function bottom(elem, parent) {
    parent = parent || elem.parent;
    elem.y = parent.height - elem.height;
}

/**
 * center element on parent horizontally
 * @param elem
 * @param parent (optional)
 * @method centerHorizontal
 */
function centerHorizontal(elem, parent) {
    parent = parent || elem.parent;
    elem.x = Math.floor((parent.width - elem.width ) / 2);
}


/**
 * center element on parent
 * @param elem
 * @param parent (optional)
 * @method center
 */
function center(elem, parent) {
    centerVertical(elem, parent);
    centerHorizontal(elem, parent);
}


module.exports = {
    centerHorizontal: centerHorizontal,
    centerVertical: centerVertical,
    center: center,
    bottom: bottom
};
},{}],39:[function(require,module,exports){

module.exports = {
    /**
     * this should be called from inside the constructor
     *
     * @method initResizeScaling
     */
    initResizeScaling: function() {
        this.resizeScaling = true; // resize instead of scale

        this.minWidth = 1;
        this.minHeight = 1;

        // update dimension flag
        this._lastWidth = NaN;
        this._lastHeight = NaN;
    },

    /**
     * update before draw call
     * redraw control for current state from theme
     *
     * @method redraw
     */
    redraw: function() {
        // remove last skin after new one has been added
        // (just before rendering, otherwise we would see nothing for a frame)
        if (this._lastSkin) {
            //this.removeChild(this._lastSkin);
            this._lastSkin.alpha = 0;
            this._lastSkin = null;
        }
        if (this.invalidState) {
            this.fromSkin(this._currentState, this.changeSkin);
        }
        var width = this.worldWidth;
        var height = this.worldHeight;
        if (this._currentSkin &&
            (this._lastWidth !== width || this._lastHeight !== height) &&
            width > 0 && height > 0) {

            this._currentSkin.width = this._lastWidth = width;
            this._currentSkin.height = this._lastHeight = height;
            this.updateDimensions();
        }
    },

    updateDimensions: function() {
    },


    updateTransform: function() {
        var wt = this.worldTransform;
        var scaleX = 1;
        var scaleY = 1;

        if(this.redraw) {

            if(this.resizeScaling) {
                var pt = this.parent.worldTransform;

                scaleX = Math.sqrt(Math.pow(pt.a, 2) + Math.pow(pt.b, 2));
                scaleY = Math.sqrt(Math.pow(pt.c, 2) + Math.pow(pt.d, 2));
            }

            this.worldWidth = Math.round(Math.max(this._width * scaleX, this.minWidth));
            this.worldHeight = Math.round(Math.max(this._height * scaleY, this.minHeight));
            this.redraw();
        }

        // obmit Control.updateTransform as it calls redraw as well
        if(!this.resizeScaling) {
            PIXI.Container.prototype.updateTransform.call(this);
        } else {
            PIXI.DisplayObject.prototype.updateTransform.call(this);

            // revert scaling
            var tx = wt.tx;
            var ty = wt.ty;
            scaleX = scaleX !== 0 ? 1/scaleX : 0;
            scaleY = scaleY !== 0 ? 1/scaleY : 0;
            wt.scale(scaleX, scaleY);
            wt.tx = tx;
            wt.ty = ty;

            for (var i = 0, j = this.children.length; i < j; ++i) {
                this.children[i].updateTransform();
            }
        }
    },

    defineProperty: {

            'height': {
                get: function() {
                    return this._height;
                },
                set: function(value) {
                    this._height = value;
                    this.minHeight = Math.min(value, this.minHeight);
                }
            },
            'width': {
                get: function() {
                    return this._width;
                },
                set: function(value) {
                    this._width = value;
                    this.minWidth = Math.min(value, this.minWidth);
                }
            }
    }
};

},{}]},{},[31])(31)
});


//# sourceMappingURL=gown.js.map

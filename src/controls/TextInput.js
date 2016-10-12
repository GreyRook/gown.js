var InputControl = require('./InputControl'),
    position = require('../utils/position');
/**
 * The basic Text Input - based on PIXI.Input Input by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class TextInput
 * @extends GOWN.InputControl
 * @memberof GOWN
 * @param text editable text shown in input
 * @param theme default theme
 * @constructor
 */

function TextInput(text, theme, skinName) {
    // show and load background image as skin (exploiting skin states)
    this.skinName = skinName || TextInput.SKIN_NAME;
    this._validStates = this._validStates || TextInput.stateNames;

    this.height = 30; // TODO: overwrite by theme!

    InputControl.call(this, text, theme);
    this.currentState = TextInput.UP;


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
    if (this.pixiText) {
        this.cursor.y = this.pixiText.y;
    }
    this.addChild(this.cursor);

    // selection background
    this.selectionBg = new PIXI.Graphics();
    this.addChildAt(this.selectionBg, 0);

    // setup events
    this.on('touchstart', this.onDown, this);
    this.on('mousedown', this.onDown, this);

    this.on('touchend', this.onUp, this);
    this.on('mouseupoutside', this.onUp, this);
    this.on('mouseup', this.onUp, this);

    this.on('mousemove', this.onMove, this);
    this.on('touchmove', this.onMove, this);

    this.currentState = TextInput.UP;
}

TextInput.prototype = Object.create(InputControl.prototype);
TextInput.prototype.constructor = TextInput;
module.exports = TextInput;

/**
 * Up state: mouse button is released or finger is removed from the screen
 *
 * @property UP
 * @static
 * @final
 * @type String
 */
TextInput.UP = 'up';

/**
 * Down state: mouse button is pressed or finger touches the screen
 *
 * @property DOWN
 * @static
 * @final
 * @type String
 */
TextInput.DOWN = 'down';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @property HOVER
 * @static
 * @final
 * @type String
 */
TextInput.HOVER = 'hover';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @property HOVER
 * @static
 * @final
 * @type String
 */
TextInput.OUT = 'out';

/**
 * names of possible states for a button
 *
 * @property stateNames
 * @static
 * @final
 * @type String
 */
TextInput.stateNames = [
    TextInput.DOWN, TextInput.HOVER, TextInput.UP
];

// name of skin
TextInput.SKIN_NAME = 'text_input';


/*
 * set display as password
 */
Object.defineProperty(TextInput.prototype, 'displayAsPassword', {
    get: function () {
        return this._displayAsPassword;
    },
    set: function (displayAsPassword) {
        this._displayAsPassword = displayAsPassword;
        this.setText(this._origText);
    }
});

TextInput.prototype.setText = function(text) {
    if (this._displayAsPassword) {
        text = text.replace(/./gi, '*');
    }
    this._displayText = text || '';
    if (!this.pixiText) {
        this.pixiText = new PIXI.Text(text, this.theme.textStyle);
        this.addChild(this.pixiText);
        position.centerVertical(this.pixiText);
        if (this.cursor) {
            this.cursor.y = this.pixiText.y;
        }
    } else {
        this.pixiText.text = text;
    }
};

/**
 * set the text that is shown inside the input field.
 * calls onTextChange callback if text changes
 *
 * @property text
 * @type String
 */
Object.defineProperty(TextInput.prototype, 'text', {
    get: function () {
        return this._origText;
    },
    set: function (text) {
        text += ''; // add '' to assure text is parsed as string
        if (this._origText === text) {
            // return if text has not changed
            return;
        }
        this._origText = text;
        this.setText(text);

        // reposition cursor
        this._cursorNeedsUpdate = true;
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
        //InputWrapper.setMaxLength(value);
        this._maxChars = value;
    }
});

Object.defineProperty(TextInput.prototype, 'value', {
    get: function() {
        return this._origText;
    }
});

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
        //InputWrapper.setSelection(start, end);
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


TextInput.prototype.inputControlOnBlur = InputControl.prototype.onblur;
TextInput.prototype.onblur = function() {
    this.inputControlOnBlur();
    this.updateSelection(0, 0);
};

TextInput.prototype.inputControlKeyDown = InputControl.prototype.onKeyDown;
TextInput.prototype.onKeyDown = function (eventData) {
    this.inputControlKeyDown(eventData);
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
    this.cursor.x = this.textWidth(this._displayText.substring(0, this.cursorPos)) | 0;
};

/**
 * draw the cursor
 *
 * @method drawCursor
 */
TextInput.prototype.drawCursor = function () {
    // TODO: use Tween instead!
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

// performance increase to avoid using call.. (10x faster)
TextInput.prototype.redrawInputControl = InputControl.prototype.redraw;

TextInput.prototype.redraw = function () {
    this.drawCursor();
    this.redrawInputControl();
};

TextInput.prototype.onMove = function (e) {
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

TextInput.prototype.onDown = function (e) {
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

TextInput.prototype.onUp = function (e) {
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
    this.setCursorPos();
};

/**
 * set text style (size, font etc.) for text and cursor
 */
Object.defineProperty(TextInput.prototype, 'style', {
    set: function(style) {
        this.cursor.style = style;
        this.pixiText.style = style;
        this.setCursorPos();
        this._cursorNeedsUpdate = true;
    }
});

/**
 * The current state (one of _validStates)
 *
 * @property currentState
 * @type String
 */
Object.defineProperty(TextInput.prototype, 'currentState',{
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

// TODO: autoSizeIfNeeded

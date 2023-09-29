var Skinable = require('../core/Skinable'),
    InputWrapper = require('../utils/InputWrapper');

/**
 * InputControl used for TextInput, TextArea and everything else that
 * is capable of entering text
 *
 * roughly based on PIXI.Input InputObject by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class InputControl
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the input control {GOWN.Theme}
 */
function InputControl(theme) {
    Skinable.call(this, theme);

    /**
     * TODO
     *
     * @type bool
     * @default true
     */
    this.receiveKeys = true;

    /**
     * Prevent other interaction (touch/move) on this component
     *
     * @type bool
     * @default false
     */
    this.autoPreventInteraction = false;

    /**
     * Current position of the cursor in the text
     *
     * @type Number
     * @default 0
     * @private
     */
    this.cursorPos = 0;

    /**
     * Character position of selected area in the text (start and end)
     *
     * @type Number[]
     * @default [0, 0]
     * @private
     */
    this.selection = [0, 0];

    /**
     * Character position that marks the beginning of the current selection
     *
     * @type Number
     * @default 0
     * @private
     */
    this.selectionStart = 0;

    /**
     * Text offset
     *
     * @type PIXI.Point
     * @default new PIXI.Point(5, 4)
     * @private
     */
    this.textOffset = new PIXI.Point(5, 4);

    this.text = this.text || '';

    // create DOM Input (if we need one)
    InputWrapper.createInput();

    /**
     * Determine if the input has the focus
     *
     * @type bool
     * @default false
     * @private
     */
    this._hasFocus = false;

    /**
     * Indicates if the mouse button is being pressed
     *
     * @type bool
     * @default false
     * @private
     */
    this._mouseDown = false;

    /**
     * The current state
     *
     * @type String
     * @default InputControl.UP
     * @private
     */
    this._currentState = InputControl.UP;

    /**
     * Timer used to indicate if the cursor is shown
     *
     * @type Number
     * @default 0
     * @private
     */
    this._cursorTimer = 0;

    /**
     * Indicates if the cursor position has changed
     *
     * @type bool
     * @default true
     * @private
     */
    this._cursorNeedsUpdate = true;

    /**
     * Interval for the cursor (in milliseconds)
     *
     * @type Number
     * @default 500
     */
    this.blinkInterval = 500;

    /**
     * Caret/selection sprite
     *
     * @type PIXI.Text
     * @default new PIXI.Text('|', this.cursorStyle)
     * @private
     */
    this.cursor = new PIXI.Text('|', this.cursorStyle);
    if (this.pixiText) {
        this.cursor.y = this.pixiText.y;
    }
    this.addChild(this.cursor);

    /**
     * Text selection background
     *
     * @type PIXI.Graphics
     */
    this.selectionBg = new PIXI.Graphics();
    this.addChildAt(this.selectionBg, 0);

    // setup events
    this.on('touchstart', this.onDown, this);
    this.on('mousedown', this.onDown, this);

    // this.on('keydown', this.onKeyDown, this);
    // this.on('keyup', this.onKeyUp, this);
}

InputControl.prototype = Object.create( Skinable.prototype );
InputControl.prototype.constructor = InputControl;
module.exports = InputControl;

/**
 * Up state: mouse button is released or finger is removed from the screen
 *
 * @static
 * @final
 * @type String
 */
InputControl.UP = 'up';

/**
 * Down state: mouse button is pressed or finger touches the screen
 *
 * @static
 * @final
 * @type String
 */
InputControl.DOWN = 'down';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @static
 * @final
 * @type String
 */
InputControl.HOVER = 'hover';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @static
 * @final
 * @type String
 */
InputControl.OUT = 'out';

/**
 * Names of possible states for an input control
 *
 * @static
 * @final
 * @type String[]
 * @private
 */
InputControl.stateNames = [
    InputControl.DOWN, InputControl.HOVER, InputControl.UP
];

/**
 * Currently selected input control (used for tab index)
 *
 * @static
 * @type GOWN.InputControl
 */
InputControl.currentInput = null;

/**
 * Input changed callback
 *
 * @protected
 */
InputControl.prototype.onInputChanged = function () {
    if (!this.hasFocus) {
        return;
    }

    var text = InputWrapper.getText();

    //overrides the current text with the user input from the InputWrapper
    if(text !== this.text) {
        this.text = text;
    }

    var sel = InputWrapper.getSelection();
    if (this.updateSelection(sel[0], sel[1])) {
        this.cursorPos = sel[0];
    }
    this.setCursorPos();
};

/**
 * Move the cursor left
 */
InputControl.prototype.moveCursorLeft = function() {
    this.cursorPos = Math.max(this.cursorPos-1, 0);
    this._cursorNeedsUpdate = true;
};

/**
 * Move the cursor right
 */
InputControl.prototype.moveCursorRight = function() {
    this.cursorPos = Math.min(this.cursorPos+1, this.text.length);
    this._cursorNeedsUpdate = true;
};

/**
 * Insert a char at the current cursor position
 *
 * @param char The char that gets inserted {String}
 */
InputControl.prototype.insertChar = function(char) {
    if (this.maxChars > 0 && this.pixiText.text >= this.maxChars) {
        this.pixiText.text = this.pixiText.text.substring(0, this.maxChars);
        return;
    }
    this.text = [this.value.slice(0, this.cursorPos), char, this.value.slice(this.cursorPos)].join('');
    this.moveCursorRight();
    this.emit('change', this);
};

/**
 * Delete the selected text
 */
InputControl.prototype.deleteSelection = function() {
    var start = this.selection[0];
    var end = this.selection[1];
    if (start < end) {
        this.cursorPos = start;
        return this.deleteText(start, end);
    } else if (start > end) {
        this.cursorPos = end;
        return this.deleteText(end, start);
    }
    throw new Error('can not delete text! (start & end are the same)');
};

/**
 * Delete text from a start position to an end position
 *
 * @param fromPos start position {Number}
 * @param toPos end position {Number}
 * @returns {String}
 */
InputControl.prototype.deleteText = function(fromPos, toPos) {
    this.text = [this.text.slice(0, fromPos), this.text.slice(toPos)].join('');
    InputWrapper.setText(this.value);
    // InputWrapper.setCursorPos(this.cursorPos);
    this.emit('change', this);
    return this.text;
};

/**
 * @private
 */
InputControl.prototype.skinableSetTheme = Skinable.prototype.setTheme;

/**
 * Change the theme
 *
 * @param theme the new theme {GOWN.Theme}
 */
InputControl.prototype.setTheme = function(theme) {
    if (theme === this.theme || !theme) {
        return;
    }
    this.skinableSetTheme(theme);
    // copy text so we can force wordwrap
    this.style = theme.textStyle;
};

/**
 * Set the input control text.
 *
 * @param text The text to set {String}
 */
InputControl.prototype.setText = function(text) {
    this._displayText = text || '';
    if (!this.pixiText) {
        this.pixiText = new PIXI.Text(text, this.textStyle);
        this.pixiText.position = this.textOffset;
        this.addChild(this.pixiText);
    } else {
        this.pixiText.text = text;
    }
};

/**
 * Set the selected text
 *
 * @param start Start position in the text {Number}
 * @param end End position in the text {Number}
 * @returns {boolean}
 */
InputControl.prototype.updateSelection = function (start, end) {
    if (this.selection[0] !== start || this.selection[1] !== end) {
        this.selection[0] = start;
        this.selection[1] = end;
        this._selectionNeedsUpdate = true;
        InputWrapper.setSelection(this.selection[0], this.selection[1]);
        return true;
    }
    return false;
};

/**
 * Get the width of a text
 *
 * @param text The text to get the width from {String}
 * @returns {Number}
 */
InputControl.prototype.textWidth = function(text) {
    // TODO: support BitmapText for PIXI v3+
    var ctx = this.pixiText.context;
    return ctx.measureText(text || '').width;
};

/**
 * Focus on this input and set it as current
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

    this.emit('focusIn', this);

    InputWrapper.focus();

    /*
     //TODO: disable/ is read only
     if(this.readonly) {
        return;
     }
     */
};

/**
 * Blurs the input when the mouse is released outside
 *
 * @protected
 */
InputControl.prototype.onMouseUpOutside = function() {
    if (this.hasFocus && !this._mouseDown) {
        this.blur();
    }
};

/**
 * Callback to execute code on focus
 *
 * @protected
 */
InputControl.prototype.onfocus = function () {
};

/**
 * Blur the text input (remove focus)
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
 * Set the cursor position on the text
 */
InputControl.prototype.setCursorPos = function () {
    this.textToPixelPos(this.cursorPos, this.cursor.position);
    this.cursor.position.x += this.pixiText.x;
    this.cursor.position.y += this.pixiText.y;
};

/**
 * Height of the line in pixel
 * (assume that every character of pixi text has the same line height)
 *
 * @returns {Number}
 */
InputControl.prototype.lineHeight = function() {
    var style = this.pixiText._style;
    var lineHeight = style.lineHeight || style.fontSize + style.strokeThickness;
    return lineHeight;
};

/**
 * Draw the cursor
 *
 * @private
 */
InputControl.prototype.drawCursor = function () {
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

/**
 * onMove callback
 *
 * @protected
 */
InputControl.prototype.onMove = function (e) {
    if (this.autoPreventInteraction) {
        e.stopPropagation();
    }

    var mouse = e.data.getLocalPosition(this.pixiText);
    if (!this.hasFocus || !this._mouseDown) { // || !this.containsPoint(mouse)) {
        return false;
    }

    var curPos = this.pixelToTextPos(mouse),
        start = this.selectionStart,
        end = curPos;

    if (this.updateSelection(start, end)) {
        this.cursorPos = curPos;
        this._cursorNeedsUpdate = true;
    }
    return true;
};

/**
 * onDown callback
 *
 * @protected
 */
InputControl.prototype.onDown = function (e) {
    if (this.autoPreventInteraction) {
        e.stopPropagation();
    }

    var mouse = e.data.getLocalPosition(this.pixiText);
    var originalEvent = e.data.originalEvent;
    if (originalEvent.which === 2 || originalEvent.which === 3) {
        originalEvent.preventDefault();
        return false;
    }

    // focus input
    this.focus();

    this._mouseDown = true;

    // start the selection drag if inside the input
    this.selectionStart = this.pixelToTextPos(mouse);
    this.updateSelection(this.selectionStart, this.selectionStart);
    this.cursorPos = this.selectionStart;
    this._cursorNeedsUpdate = true;

    this.on('touchend', this.onUp, this);
    this.on('mouseupoutside', this.onUp, this);
    this.on('mouseup', this.onUp, this);

    this.on('mousemove', this.onMove, this);
    this.on('touchmove', this.onMove, this);

    // update the hidden input
    InputWrapper.setMaxLength(this.maxChars);
    InputWrapper.setText(this.value);
    InputWrapper.setCursorPos(this.cursorPos);

    return true;
};

/**
 * onUp callback
 *
 * @protected
 */
InputControl.prototype.onUp = function (e) {
    if (this.autoPreventInteraction) {
        e.stopPropagation();
    }

    var originalEvent = e.data.originalEvent;
    if (originalEvent.which === 2 || originalEvent.which === 3) {
        originalEvent.preventDefault();
        return false;
    }

    this._mouseDown = false;

    this.off('touchend', this.onUp, this);
    this.off('mouseupoutside', this.onUp, this);
    this.off('mouseup', this.onUp, this);

    this.off('mousemove', this.onMove, this);
    this.off('touchmove', this.onMove, this);

    this.focus();

    // update the hidden input cursor position and selection
    InputWrapper.setCursorPos(this.cursorPos);
    InputWrapper.setSelection(this.selectionStart, this.cursorPos);

    this.selectionStart = -1;

    return true;
};

/**
 * From position in the text to pixel position
 * (for cursor/selection positioning)
 *
 * @param textPos Current character position in the text {Number}
 * @param [position] point that will be set with the pixel position and returned {PIXI.Point}
 * @returns {PIXI.Point} Pixel position
 */
InputControl.prototype.textToPixelPos = function(textPos, position) {
    var lines = this.getLines();
    var x = 0;
    for (var y = 0; y < lines.length; y++) {
        var lineLength = lines[y].length;
        if (lineLength < textPos) {
            textPos -= lineLength + 1;
        } else {
            var text = lines[y];
            x = this.textWidth(text.substring(0, textPos));
            break;
        }
    }

    if (!position) {
        position = new PIXI.Point(x, y * this.lineHeight());
    } else {
        position.x = x;
        position.y = y * this.lineHeight();
    }
    return position;
};

/**
 * From pixel position on the text to character position inside the text
 * (used when clicked on the text)
 *
 * @param pixelPos Pixel position of the mouse on the text
 * @returns {Number} Position in the text
 */
InputControl.prototype.pixelToTextPos = function(pixelPos) {
    var textPos = 0;
    var lines = this.getLines();
    // calculate current line we are in
    var currentLine = Math.min(
        Math.max(
            parseInt(pixelPos.y / this.lineHeight()),
            0),
        lines.length - 1);
    // sum all characters of previous lines
    for (var i = 0; i < currentLine; i++) {
        textPos += lines[i].length + 1;
    }

    var displayText = lines[currentLine];
    var totalWidth = 0;
    if (pixelPos.x < this.textWidth(displayText)) {
        // loop through each character to identify the position
        for (i = 0; i < displayText.length; i++) {
            totalWidth += this.textWidth(displayText[i]);
            if (totalWidth >= pixelPos.x) {
                textPos += i;
                break;
            }
        }
    } else {
        textPos += displayText.length;
    }
    return textPos;
};

/**
 * Callback that will be executed once the text input is blurred
 *
 * @protected
 */
InputControl.prototype.onblur = function() {
    this.updateSelection(0, 0);
    this.emit('focusOut', this);
};

/**
 * @private
 */
// performance increase to avoid using call.. (10x faster)
InputControl.prototype.redrawSkinable = Skinable.prototype.redraw;

/**
 * Update before draw call (draw cursor and selection)
 *
 * @protected
 */
InputControl.prototype.redraw = function () {
    if (this.drawCursor) {
        this.drawCursor();
    }
    if (this._selectionNeedsUpdate) {
        this.updateSelectionBg();
    }
    this.redrawSkinable();
};

/**
 * Blur and destroy input control and listeners
 * @param {Object} options PIXI.js destroy options
 */
InputControl.prototype.destroy = function(options) {
    if (GOWN.InputControl.currentInput === this) {
        GOWN.InputControl.currentInput.blur();
    }

    this.off('touchstart', this.onDown, this);
    this.off('mousedown', this.onDown, this);

    Skinable.prototype.destroy.call(this, options);
}


/**
 * Set the text that is shown inside the input field.
 * Calls onTextChange callback if text changes.
 *
 * @name GOWN.InputControl#text
 * @type String
 * @default ''
 */
Object.defineProperty(InputControl.prototype, 'text', {
    get: function () {
        if (this.pixiText) {
            return this.pixiText.text;
        }
        return this._origText;
    },
    set: function (text) {
        text += ''; // add '' to assure text is parsed as string

        if (this.maxChars > 0 && text.length > this.maxChars) {
            //reset hidden input to previous state
            InputWrapper.setText(this._origText);
            InputWrapper.setSelection(this.selection[0], this.selection[1]);
            return;
        }

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
 * @name GOWN.InputControl#maxChars
 * @type String
 * @default 0
 */
Object.defineProperty(InputControl.prototype, 'maxChars', {
    get: function () {
        return this._maxChars;
    },
    set: function (value) {
        if (this._maxChars === value) {
            return;
        }
        if (this.pixiText.text > value) {
            this.pixiText.text = this.pixiText.text.substring(0, value);
            if (this.cursorPos > value) {
                this.cursorPos = value;
                this._cursorNeedsUpdate = true;
            }
            this.updateSelection(
                Math.max(this.selection[0], value),
                Math.max(this.selection[1], value)
            );
        }
        this._maxChars = value;
        InputWrapper.setMaxLength(value);

    }
});

Object.defineProperty(InputControl.prototype, 'value', {
    get: function() {
        return this._origText;
    }
});

/**
 * Determine if the input has the focus
 *
 * @name GOWN.InputControl#hasFocus
 * @type bool
 * @default false
 */
Object.defineProperty(InputControl.prototype, 'hasFocus', {
    get: function() {
        return this._hasFocus;
    },
    set: function(focus) {
        this._hasFocus = focus;
    }
});

/**
 * Set the text style (size, font etc.) for text and cursor
 *
 * @name GOWN.InputControl#style
 * @type PIXI.TextStyle
 */
Object.defineProperty(InputControl.prototype, 'style', {
    get: function() {
        return this.textStyle;
    },
    set: function(style) {
        this.cursorStyle = style;
        if (this.cursor) {
            this.cursor.style = style;
        }
        this.textStyle = style;
        if (this.pixiText) {
            this.pixiText.style = style;
            this._cursorNeedsUpdate = true;
        }
        this._cursorNeedsUpdate = true;
    }
});

/**
 * The current state
 * TODO: move to skinable?
 *
 * @name GOWN.InputControl#currentState
 * @type String
 * @default InputControl.UP
 */
Object.defineProperty(InputControl.prototype, 'currentState',{
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

var Skinable = require('../core/Skinable');

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
 */
function InputControl(theme) {
    Skinable.call(this, theme);
    this.cursorPos = {x:0, y:0};

    this.receiveKeys = true;

    this.text = this.text || '';

    this.hasFocus = false;

    /**
     * indicates if the mouse button has been pressed
     * @property _mouseDown
     * @type {boolean}
     * @private
     */
    this._mouseDown = false;

    this.currentState = InputControl.UP;

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
    this.selection = [
        {x: 0, y: 0},
        {x: 0, y: 0}];

    // caret/selection sprite
    this.cursor = new PIXI.Text('|', this.cursorStyle);
    if (this.pixiText) {
        this.cursor.y = this.pixiText.y;
    }
    this.addChild(this.cursor);

    // selection background
    this.selectionBg = new PIXI.Graphics();
    this.addChildAt(this.selectionBg, 0);

    this.selectionStart = {x: -1, y: -1};

    // TODO: remove events on destroy
    // setup events
    this.on('touchstart', this.onDown, this);
    this.on('mousedown', this.onDown, this);

    this.on('touchend', this.onUp, this);
    this.on('mouseupoutside', this.onUp, this);
    this.on('mouseup', this.onUp, this);

    this.on('mousemove', this.onMove, this);
    this.on('touchmove', this.onMove, this);

    this.on('keydown', this.onKeyDown, this);
    this.on('keyup', this.onKeyUp, this);
}

InputControl.prototype = Object.create( Skinable.prototype );
InputControl.prototype.constructor = InputControl;
module.exports = InputControl;

/**
 * Up state: mouse button is released or finger is removed from the screen
 *
 * @property UP
 * @static
 * @final
 * @type String
 */
InputControl.UP = 'up';

/**
 * Down state: mouse button is pressed or finger touches the screen
 *
 * @property DOWN
 * @static
 * @final
 * @type String
 */
InputControl.DOWN = 'down';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @property HOVER
 * @static
 * @final
 * @type String
 */
InputControl.HOVER = 'hover';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @property HOVER
 * @static
 * @final
 * @type String
 */
InputControl.OUT = 'out';


/**
 * names of possible states for a button
 *
 * @property stateNames
 * @static
 * @final
 * @type String
 */
InputControl.stateNames = [
    InputControl.DOWN, InputControl.HOVER, InputControl.UP
];

/**
 * currently selected input control (used for tab index)
 *
 * @property currentInput
 * @type GOWN.InputControl
 * @static
 */
InputControl.currentInput = null;

InputControl.prototype.onKeyDown = function (eventData) {
    if (!this.hasFocus) {
        return;
    }
    var code = eventData.data.code;
    var key = eventData.data.key;
    if (key === 'WakeUp' || key === 'CapsLock' || key === 'Meta' ||
        key === 'Shift' || key === 'Control' || key === 'Alt' ||
        key === 'Dead' || code.substring(0,1) === 'F' || key === 'Insert' ||
        key === 'Escape' || key === 'NumLock') {
        // ignore single shift/control/alt key, meta and dead keys
        return;
    }

    if (key === 'Tab') {
        // TODO: implement Tab
        return;
    }
    if (key === 'Enter') {
        this.emit('enter', this);
        return;
    }

    // check for selected Text
    var selected = this.selection && (
        this.selection[0].x - this.selection[1].x !== 0 &&
        this.selection[0].y - this.selection[1].y !== 0);

    // TODO implement insert key? it is gnored for now!
    var txt = this.text;
    var changed = false;
    switch (key) {
        case 'ArrowLeft':
            this.cursorPos--;
            if (eventData.data.shiftKey) {
                this.updateSelection(this.selection[0]-1, this.selection[1]);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            this._cursorNeedsUpdate = true;
            break;
        case 'ArrowRight':
            this.cursorPos++;
            if (eventData.data.shiftKey) {
                this.updateSelection(this.selection[0], this.selection[1]+1);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            this._cursorNeedsUpdate = true;
            break;
        case 'ArrowUp':
        case 'Home':
        case 'PageUp':
            this.cursorPos = 0;
            if (eventData.data.shiftKey) {
                this.updateSelection(0, this.selection[1]);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            this._cursorNeedsUpdate = true;
            break;
        case 'ArrowDown':
        case 'End':
        case 'PageDown':
            this.cursorPos = txt.length;
            if (eventData.data.shiftKey) {
                this.updateSelection(this.selection[0], txt.length);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            this._cursorNeedsUpdate = true;
            break;
        case 'Backspace':
            if (selected) {
                // remove only the selected Text
                this.deleteSelection();
                this.updateSelection(this.cursorPos, this.cursorPos);
                changed = true;
            } else if (this.cursorPos > 0) {
                //if (eventData.data.ctrlKey) {
                    // TODO: delete previous word!
                //}
                // remove last char at cursorPosition
                this.text = [txt.slice(0, this.cursorPos-1), txt.slice(this.cursorPos)].join('');
                this.cursorPos--;
                changed = true;
                eventData.originalEvent.preventDefault();
            }
            break;
        case 'Delete':
            if (selected) {
                this.deleteSelection();
                this.updateSelection(this.cursorPos, this.cursorPos);
                changed = true;
            } else if (this.cursorPos < txt.length) {
                //if (eventData.data.ctrlKey) {
                    // TODO: delete previous word!
                //}
                // remove next char after cursorPosition
                this.text = [txt.slice(0, this.cursorPos), txt.slice(this.cursorPos+1)].join('');
                changed = true;
            }
            break;
        default:
            // select all text
            if (eventData.data.ctrlKey && code === 'KeyA') {
                this.cursorPos = txt.length;
                this.updateSelection(0, this.cursorPos);
                this._cursorNeedsUpdate = true;
                return;
            }
            // allow µ or ² but ignore keys for browser refresh / show Developer Tools
            if (eventData.data.ctrlKey && (code !== 'KeyJ' || code !== 'KeyR')) {
                return;
            }
            if (selected) {
                txt = this.deleteSelection();
            }
            if (key.length !== 1) {
                throw new Error('unknown key ' + key);
            }
            this.text = [txt.slice(0, this.cursorPos), key, txt.slice(this.cursorPos)].join('');
            changed = true;
            this.cursorPos.x++;
            this.updateSelection(this.cursorPos, this.cursorPos);
    }
    if (changed) {
        this.emit('change', this);
        this._cursorNeedsUpdate = true;
    }
};

/**
 * delete next character
 */
InputControl.prototype.deleteNext = function() {

};

/**
 * delete selected text
 *
 */
InputControl.prototype.deleteSelection = function() {
    var s0 = this.selection[0];
    var s1 = this.selection[1];
    this.text = [this.text.slice(0, s0.x), this.text.slice(s1.x)].join('');
    this.cursorPos = s0;
    return this.text;
};

InputControl.prototype.skinableSetTheme = Skinable.prototype.setTheme;
/**
 * change the theme
 *
 * @method setTheme
 * @param theme the new theme {Theme}
 */
InputControl.prototype.setTheme = function(theme) {
    if (theme === this.theme || !theme) {
        return;
    }
    this.skinableSetTheme(theme);
    // copy text so we can force wordwrap
    this.style = theme.textStyle;
};

InputControl.prototype.setText = function(text) {
    this._displayText = text || '';
    if (!this.pixiText) {
        this.pixiText = new PIXI.Text(text, this.textStyle);
        this.addChild(this.pixiText);
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
Object.defineProperty(InputControl.prototype, 'text', {
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
Object.defineProperty(InputControl.prototype, 'maxChars', {
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

Object.defineProperty(InputControl.prototype, 'value', {
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
InputControl.prototype.updateSelection = function (start, end) {
    if (this.selection[0].x !== start.x || this.selection[1].x !== end.x ||
        this.selection[0].y !== start.y || this.selection[1].y !== end.y) {
        this.selection[0] = start;
        this.selection[1] = end;
        //InputWrapper.setSelection(start, end);
        this._cursorNeedsUpdate = true;
        // should be implemented in your Input, see TextInput / TextArea
        this.updateSelectionBg();

        return true;
    } else {
        return false;
    }
};

/**
 * determine where the click was made along the string
 *
 * @method clickPos
 * @param x
 * @param y
 * @returns {Array} x/y values of position
 */
InputControl.prototype.clickPos = function(x)
{
    var displayText = this.pixiText._text,
        totalWidth = this.pixiText.x,
        posX = 0;

    if (x < this.textWidth(displayText) + totalWidth)
    {
        // loop through each character to identify the position
        for (var i=0; i<displayText.length; i++)
        {
            totalWidth += this.textWidth(displayText[i]);
            if (totalWidth >= x)
            {
                posX = i;
                break;
            }
        }
    }

    return {x:posX, y:0};
};

/**
 * get text width
 *
 * @method textWidth
 * @param text
 * @returns {*}
 */
InputControl.prototype.textWidth = function(text) {
    // TODO: support BitmapText for PIXI v3+
    var ctx = this.pixiText.context;
    return ctx.measureText(text || '').width;
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

    this.emit('focusIn', this);
    /*
     //TODO: disable/ is read only
     if(this.readonly) {
        return;
     }
     */
};

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
        this.onblur();
    }
};

/**
 * position cursor on the text
 */
InputControl.prototype.setCursorPos = function () {
    this.cursor.x = this.pixiText.x + this.textWidth(this._displayText.substring(0, this.cursorPos.x)) | 0;
};

/**
 * draw the cursor
 *
 * @method drawCursor
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

InputControl.prototype.onMove = function (e) {
    var mouse = this.mousePos(e);
    if (!this.hasFocus || !this._mouseDown) { // || !this.containsPoint(mouse)) {
        return false;
    }

    var curPos = this.clickPos(mouse.x, mouse.y),
        start = this.selectionStart,
        end = curPos;

    if (this.updateSelection(start, end)) {
        this.cursorPos = curPos;
        this.setCursorPos();
        this._cursorNeedsUpdate = true;
    }
    return true;
};

InputControl.prototype.onDown = function (e) {
    var mouse = this.mousePos(e);
    var originalEvent = e.data.originalEvent;
    if (originalEvent.which === 2 || originalEvent.which === 3) {
        originalEvent.preventDefault();
        return false;
    }

    // focus input
    this.focus();

    this._mouseDown = true;

    // start the selection drag if inside the input
    this.selectionStart = this.clickPos(mouse.x, mouse.y);
    this.updateSelection(this.selectionStart, this.selectionStart);
    this.cursorPos = this.selectionStart;
    this.setCursorPos();
    return true;
};

InputControl.prototype.onUp = function (e) {
    var originalEvent = e.data.originalEvent;
    if (originalEvent.which === 2 || originalEvent.which === 3) {
        originalEvent.preventDefault();
        return false;
    }
    /*
    var mouse = this.mousePos(e);

    // update selection if a drag has happened
    var clickPos = this.clickPos(mouse.x, mouse.y);

    // update the cursor position
    if (!(clickPos == this.selectionStart)) {
        this.cursorPos = clickPos;
        this.setCursorPos();
        this.updateSelection(this.cursorPos, this.cursorPos);
    }
    */

    this.selectionStart.x = -1;
    this.selectionStart.y = -1;
    this._mouseDown = false;
    return true;
};

/**
 * synchronize TextInput with DOM element
 *
 * @method updateTextState
 */
InputControl.prototype.updateTextState = function () {
    this.setCursorPos();
};

/**
 * callback that will be executed once the text input is blurred
 *
 * @method onblur
 */
InputControl.prototype.onblur = function() {
    this.updateSelection({x:0, y:0}, {x:0, y:0});
    this.emit('focusOut', this);
};

// performance increase to avoid using call.. (10x faster)
InputControl.prototype.redrawSkinable = Skinable.prototype.redraw;
InputControl.prototype.redraw = function () {
    if (this.drawCursor) {
        this.drawCursor();
    }
    this.redrawSkinable();
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

/**
 * set text style (size, font etc.) for text and cursor
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
            this.setCursorPos();
        }
        this._cursorNeedsUpdate = true;
    }
});

/**
 * The current state (one of _validStates)
 * TODO: move to skinable?
 *
 * @property currentState
 * @type String
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

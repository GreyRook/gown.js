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
function InputControl(text, theme) {
    Skinable.call(this, theme);
    this.cursorPos = 0;

    this.receiveKeys = true;

    this.text = text || '';
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

    this.on('keydown', this.onKeyDown, this);
    this.on('keyup', this.onKeyUp, this);
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

InputControl.prototype.onKeyDown = function (eventData) {
    if (!this.hasFocus) {
        return;
    }
    var code = eventData.data.code;
    var key = eventData.data.key;
    if (key === 'CapsLock' || key === 'Meta' || key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Dead' || code.substring(0,1) === 'F' || key === 'Insert' || key === 'Escape') {
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
    var selected = this.selection && (this.selection[0] - this.selection[1] !== 0);

    // TODO implement insert key? it is gnored for now!
    var txt = this.text;
    var changed = false;
    switch (code) {
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
            if (eventData.data.ctrlKey) {
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
            this.cursorPos++;
            this.updateSelection(this.cursorPos, this.cursorPos);
    }
    if (changed) {
        this.emit('change', this);
        this._cursorNeedsUpdate = true;
    }
};

/**
 * delete selected text
 *
 */
InputControl.prototype.deleteSelection = function() {
    var s0 = this.selection[0];
    var s1 = this.selection[1];
    this.text = [this.text.slice(0, s0), this.text.slice(s1)].join('');
    this.cursorPos = s0;
    return this.text;
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

    var displayText = this.pixiText._text,
        totalWidth = this.pixiText.x,
        pos = displayText.length;

    if (x < this.textWidth(displayText) + totalWidth)
    {
        // loop through each character to identify the position
        for (var i=0; i<displayText.length; i++)
        {
            totalWidth += this.textWidth(displayText[i]);
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

    this.emit('focusIn', this);
    /*
     //TODO: disable/ is read only
     if(this.readonly) {
        return;
     }
     */
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
        this.onblur();
    }
};

/**
 * callback that will be executed once the text input is blurred
 *
 * @method onblur
 */
InputControl.prototype.onblur = function() {
    this.emit('focusOut', this);
};

// performance increase to avoid using call.. (10x faster)
InputControl.prototype.redrawSkinable = Skinable.prototype.redraw;

InputControl.prototype.redraw = function () {
    this.redrawSkinable();
};

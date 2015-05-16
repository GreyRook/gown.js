var Skinable = require('../core/Skinable'),
    InputWrapper = require('../util/InputWrapper');

/**
 * InputControl used for TextInput, TextArea and everything else that
 * is capable of entering text
 *
 * based on PIXI.Input InputObject by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class InputControl
 * @extends PIXI_UI.Skinable
 * @memberof PIXI_UI
 * @constructor
 */
function InputControl(text, theme) {
    Skinable.call(this, theme);
    this.text = text || ' ';
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
 * @type PIXI_UI.InputControl
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

    var text = this.pixiText,
        totalWidth = 0,
        pos = text.length;

    if (x < this.textWidth(text))
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
    if (InputControl.currentInput === this) {
        return;
    }

    // drop focus
    if (InputControl.currentInput) {
        InputControl.currentInput.blur();
    }

    // set focus
    InputControl.currentInput = this;
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
    if (InputControl.currentInput === this) {
        InputControl.currentInput = null;
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
    if (InputControl.currentInput &&
        !InputControl.currentInput._mouseDown) {
        InputControl.currentInput.blur();
        InputControl.currentInput = null;
    }
};
window.addEventListener('blur', InputControl.blur, false);

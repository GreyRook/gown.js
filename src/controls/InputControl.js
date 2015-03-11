/**
 * @author Andreas Bresser
 */

/**
 * InputControl used for TextInput, TextArea and everything else that
 * is capable of entering text
 *
 * based on PIXI.Input InputObject by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class InputControl
 * @constructor
 */
PIXI_UI.InputControl = function(text, theme) {
    PIXI_UI.Control.call(this, theme);
    this.text = text || ' ';
    // create DOM Input (if we need one)
    PIXI_UI.InputWrapper.createInput();
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
};

PIXI_UI.InputControl.prototype = Object.create( PIXI_UI.Control.prototype );
PIXI_UI.InputControl.prototype.constructor = PIXI_UI.InputControl;

/**
 * currently selected input control (used for tab index)
 *
 * @property currentInput
 * @type PIXI_UI.InputControl
 * @static
 */
PIXI_UI.InputControl.currentInput = null;

PIXI_UI.InputControl.prototype.onKeyUp = function() {
};

PIXI_UI.InputControl.prototype.onKeyDown = function() {
};

/**
 * determine where the click was made along the string
 *
 * @method clickPos
 * @param x
 * @param y
 * @returns {Number}
 */
PIXI_UI.InputControl.prototype.clickPos = function(x, y)
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
PIXI_UI.InputControl.prototype.textWidth = function(text) {
    if(!this.text._isBitmapFont)
    {
        var ctx = this.pixiText.context;
        return ctx.measureText(text || "").width;
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
PIXI_UI.InputControl.prototype.focus = function () {
    // is already current input
    if (PIXI_UI.InputControl.currentInput === this) {
        return;
    }

    // drop focus
    if (PIXI_UI.InputControl.currentInput) {
        PIXI_UI.InputControl.currentInput.blur();
    }

    // set focus
    PIXI_UI.InputControl.currentInput = this;
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
    PIXI_UI.InputWrapper.focus();
};

/**
 * determine if the input has the focus
 *
 * @property hasFocus
 * @type Boolean
 */
Object.defineProperty(PIXI_UI.InputControl.prototype, 'hasFocus', {
    get: function() {
        return this._hasFocus;
    },
    set: function(focus) {
        this._hasFocus = focus;
    }
});

PIXI_UI.InputControl.prototype.onMouseUpOutside = function(e) {
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
PIXI_UI.InputControl.prototype.onfocus = function () {
};

/**
 * blur the text input (remove focus)
 *
 * @method blur
 */
PIXI_UI.InputControl.prototype.blur = function() {
    if (PIXI_UI.InputControl.currentInput === this) {
        PIXI_UI.InputControl.currentInput = null;
        this.hasFocus = false;

        // blur hidden input
        PIXI_UI.InputWrapper.blur();
        this.onblur();
    }
};

/**
 * callback that will be executed once the text input is blurred
 *
 * @method onblur
 */
PIXI_UI.InputControl.prototype.onblur = function() {
};

// blur current input
PIXI_UI.InputControl.blur = function() {
    if (PIXI_UI.InputControl.currentInput &&
        !PIXI_UI.InputControl.currentInput._mouseDown) {
        PIXI_UI.InputControl.currentInput.blur();
        PIXI_UI.InputControl.currentInput = null;
    }
};
window.addEventListener('blur', PIXI_UI.InputControl.blur, false);
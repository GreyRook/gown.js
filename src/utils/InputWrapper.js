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
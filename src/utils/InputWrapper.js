/**
 * Wrapper for DOM Text Input.
 *
 * Based on PIXI.Input InputObject by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class InputWrapper
 * @memberof GOWN
 * @static
 */
function InputWrapper() {
}

module.exports = InputWrapper;

/**
 * DOM input field.
 * We use one input field for all InputControls
 *
 * @name GOWN.InputWrapper.hiddenInput
 * @type DOMObject
 * @static
 */
InputWrapper.hiddenInput = null;

/**
 * Create a unique input field.
 *
 * @returns {DOMObject} The input field
 */
InputWrapper.createInput = function() {
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
        input.addEventListener('blur', function() {
            if (GOWN.InputControl.currentInput) {
                GOWN.InputControl.currentInput.onMouseUpOutside();
            }
        }, false);

        // on key up
        input.addEventListener('keyup', function() {
            if (GOWN.InputControl.currentInput) {
                if (GOWN.InputControl.currentInput.hasFocus) {
                    GOWN.InputControl.currentInput.onInputChanged();
                }
            }
        });

        document.body.appendChild(input);

        InputWrapper.hiddenInput = input;
    }
    return InputWrapper.hiddenInput;
};

/**
 * The key to get the text ('value' for default input field)
 *
 * @name GOWN.InputWrapper.textProp
 * @type {string}
 * @private
 */
InputWrapper.textProp = 'value';

/**
 * Focus the text input
 *
 * @function GOWN.InputWrapper.focus
 */
InputWrapper.focus = function() {
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.focus();
    }
};

/**
 * Blur the text input
 *
 * @function GOWN.InputWrapper.blur
 */
InputWrapper.blur = function() {
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.blur();
    }
};

/**
 * Set the new selection
 *
 * @function GOWN.InputWrapper.setSelection
 * @param start First position {Number}
 * @param end Last position {Number}
 */
InputWrapper.setSelection = function(start, end) {
    if (InputWrapper.hiddenInput) {
        if(start < end) {
            InputWrapper.hiddenInput.selectionStart = start;
            InputWrapper.hiddenInput.selectionEnd = end;
        } else {
            InputWrapper.hiddenInput.selectionStart = end;
            InputWrapper.hiddenInput.selectionEnd = start;
        }
    } else {
        InputWrapper._selection = [start, end];
    }
};

/**
 * Get the start and end of the current selection
 *
 * @function GOWN.InputWrapper.getSelection
 * @returns {Number[]} The start and end of the current selection
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
 * Set the cursor position of the hidden input
 *
 * @function GOWN.InputWrapper.setCursorPos
 */
InputWrapper.setCursorPos = function (pos) {
    if (InputWrapper.hiddenInput) {
        var elem = InputWrapper.hiddenInput;
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', pos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(pos, pos);
            }
            else
                elem.focus();
        }
    }
};

/**
 * Get the text value from the hidden input
 *
 * @function GOWN.InputWrapper.getText
 * @returns {String} The text value
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
 * Set the text value of the hidden input
 *
 * @function GOWN.InputWrapper.setText
 * @param {String} text The text to set {String}
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
 * Set the maximum length.
 * Setting it to 0 will allow unlimited text input
 *
 * @function GOWN.InputWrapper.setMaxLength
 * @param length The maximum length {Number}
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

/**
 * Set the input type of the hidden input
 *
 * @function GOWN.InputWrapper.setType
 * @param type The new type for the hidden input {String}
 */
InputWrapper.setType = function(type) {
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.type = type;
    } else {
        InputWrapper._type = type;
    }
};

/**
 * Get the input type of the hidden input
 *
 * @function GOWN.InputWrapper.getType
 * @returns {String} The input type
 */
InputWrapper.getType = function() {
    if (InputWrapper.hiddenInput) {
        return InputWrapper.hiddenInput.type;
    } else {
        return InputWrapper._type;
    }
};

var InputWrapper = require('./InputWrapper'),
    InputControl = require('../controls/InputControl');

/**
 * Wrapper for InputControl to use the browser DOM Text Input.
 * this is the prefered input for Text in GOWN.
 *
 * We let the DOM object handle selection and text input!
 *
 * See KeyboardWrapper for text input outside of the browser (e.g. cocoon.js)
 *
 * based on PIXI.Input InputObject by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class DOMInputWrapper
 * @memberof GOWN
 */
function DOMInputWrapper(manager) {
    InputWrapper.call(this, manager, DOMInputWrapper.name);
}
DOMInputWrapper.prototype = Object.create( InputWrapper.prototype );
DOMInputWrapper.prototype.constructor = DOMInputWrapper;
module.exports = DOMInputWrapper;

DOMInputWrapper.name = 'dom_input';

/**
 * DOM input field.
 *
 * @property hiddenInput
 * @type Object
 * @static
 */
DOMInputWrapper.hiddenInput = {'input': null, 'textarea': null};

/**
 * currently used text input that has the focus (either TextInput or TextArea)
 *
 * @property currentHiddenText
 * @type DOMObject
 * @static
 */
DOMInputWrapper.currentHiddenText = null;

/**
 * create/return unique input field.
 * @param type used dom element (input or textarea)
 * @returns {DOMObject}
 */
DOMInputWrapper.prototype.createInput = function(type) {
    if (!DOMInputWrapper.hiddenInput[type]) {
        var domInput = document.createElement(type);
        this.hideInput(domInput);
        this.addEventListener(domInput);
        document.body.appendChild(domInput);
        DOMInputWrapper.hiddenInput[type] = domInput;
    }
    return DOMInputWrapper.hiddenInput[type];
};

DOMInputWrapper.prototype.hideInput = function(domInput) {
    domInput.tabindex = -1;
    domInput.style.position = 'fixed';
    domInput.style.opacity = 0;
    domInput.style.pointerEvents = 'none';
    domInput.style.left = '0px';
    domInput.style.bottom = '0px';
    domInput.style.left = '-100px';
    domInput.style.top = '-100px';
    domInput.style.zIndex = 10;
};

DOMInputWrapper.prototype.addEventListener = function(domInput) {
    // add blur handler
    domInput.addEventListener('blur', this.onBlur, false);
    // on key up
    domInput.addEventListener('keyup', this.onKeyUp);
};

DOMInputWrapper.prototype.onBlur = function() {
    if (InputControl.currentInput) {
        InputControl.currentInput.onMouseUpOutside();
    }
};

DOMInputWrapper.prototype.onKeyUp = function() {
    if (InputControl.currentInput &&
        InputControl.currentInput.hasFocus) {
            InputControl.currentInput.onInputChanged();
        }
};

/**
 * key to get text ('value' for default input field)
 * @type {string}
 * @static
 * @private
 */
DOMInputWrapper.textProp = 'value';

/**
 * activate the text input
 */
InputWrapper.focus = function(type) {
    if (InputWrapper.hiddenInput[type]) {
        InputWrapper.hiddenInput[type].focus();
    }
};

/**
 * deactivate the text input
 */
InputWrapper.blur = function(type) {
    if (InputWrapper.hiddenInput[type]) {
        InputWrapper.hiddenInput[type].blur();
    }
};


/**
 * set selection
 * @returns {DOMObject}
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
 * set cursor position of the hidden input
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
 * set text value to hiddenInput
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

/**
 * set the input type of the hidden input
 * @param length
 */
InputWrapper.setType = function(type) {
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.type = type;
    } else {
        InputWrapper._type = type;
    }
};

/**
 * get the input type of the hidden input
 * @returns {String}
 */
InputWrapper.getType = function() {
    if (InputWrapper.hiddenInput) {
        return InputWrapper.hiddenInput.type;
    } else {
        return InputWrapper._type;
    }
};

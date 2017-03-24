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
    // we do not need to handle selection and text content ourself -
    // there is a DOM element that stores text and selection for us.

    InputWrapper.call(this, manager, DOMInputWrapper.name);

    this.tagName = 'input';
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
DOMInputWrapper.hiddenInput = {
    'input': null,
    'textarea': null
};

/**
 * create/return unique input field.
 * @param type used dom element (input or textarea)
 * @returns {DOMObject}
 */
DOMInputWrapper.prototype.createInput = function(tagName) {
    if (!DOMInputWrapper.hiddenInput[tagName]) {
        var domInput = document.createElement(tagName);
        this.hideInput(domInput);
        this.addEventListener(domInput);
        document.body.appendChild(domInput);
        DOMInputWrapper.hiddenInput[tagName] = domInput;
    }
};

/**
 * use CSS style to hide DOM input or textarea
 */
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

/**
 * add keyboard events for DOM elements
 */
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
 * activate the dom text input / text area
 * if the InputControl receives the text or not is defined in the focus function
 * of the InputControl itself. There
 */
DOMInputWrapper.prototype.focus = function() {
    if (DOMInputWrapper.hiddenInput[this.tagName]) {
        DOMInputWrapper.hiddenInput[this.tagName].focus();
    }
};

/**
 * deactivate the text input
 */
DOMInputWrapper.blur = function() {
    if (DOMInputWrapper.hiddenInput[this.tagName]) {
        DOMInputWrapper.hiddenInput[this.tagName].blur();
    }
};

/**
 * The text content
 *
 * @property text
 * @type String
 */
Object.defineProperty(DOMInputWrapper.prototype, 'text',{
    get: function() {
        var textProp = DOMInputWrapper.textProp;
        var txt = DOMInputWrapper.hiddenInput[this.tagName][textProp];
        return txt.replace(/\r/g, '');
    },
    set: function(value) {
        var textProp = DOMInputWrapper.textProp;
        DOMInputWrapper.hiddenInput[this.tagName][textProp] = value;
    }
});

/**
 * set selection
 * @returns {DOMObject}
 */
InputWrapper.setSelection = function(tagName, start, end) {
    if(start < end) {
        InputWrapper.hiddenInput[tagName].selectionStart = start;
        InputWrapper.hiddenInput[tagName].selectionEnd = end;
    } else {
        InputWrapper.hiddenInput[tagName].selectionStart = end;
        InputWrapper.hiddenInput[tagName].selectionEnd = start;
    }
};

/**
 * get start and end of selection
 * @returns {Array}
 */
InputWrapper.getSelection = function(tagName) {
    return [
        InputWrapper.hiddenInput[tagName].selectionStart,
        InputWrapper.hiddenInput[tagName].selectionEnd
    ];
};

/**
 * set cursor position of the hidden input
 */
InputWrapper.setCursorPos = function (tagName, pos) {
    if (InputWrapper.hiddenInput[tagName]) {
        var elem = InputWrapper.hiddenInput[tagName];
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', pos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(pos, pos);
            } else {
                elem.focus();
            }
        }
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

var InputControl = require('./InputControl'),
    InputWrapper = require('../utils/InputWrapper'),
    position = require('../utils/position'),
    validators = require('../utils/validators');
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
function TextInput(theme, skinName) {
    // show and load background image as skin (exploiting skin states)
    this.skinName = skinName || TextInput.SKIN_NAME;
    this._validStates = this._validStates || InputControl.stateNames;
    this._type = TextInput.TEXT;
    this._acceptComma = false;
    this.check = false;

    InputControl.call(this, theme);
}
TextInput.prototype = Object.create(InputControl.prototype);
TextInput.prototype.constructor = TextInput;
TextInput.uber = InputControl.prototype;
module.exports = TextInput;

// name of skin
TextInput.SKIN_NAME = 'text_input';

/**
 * Text type: all input allowed
 *
 * @property TEXT
 * @static
 * @final
 * @type String
 */
TextInput.TEXT = 'text';

/**
 * Number type: only numbers are accepted
 *
 * @property NUMBER
 * @static
 * @final
 * @type String
 */
TextInput.NUMBER = 'number';

/**
 * names of possible types for a TextInput
 *
 * @property types
 * @static
 * @final
 * @type String
 */
TextInput.types = [
  TextInput.TEXT, TextInput.NUMBER
];

/*
 * set type attribute
 */
Object.defineProperty(TextInput.prototype, 'type', {
    get: function () {
        return this._type;
    },
    set: function (type) {
        if (TextInput.types.indexOf(type) === -1) {
            return;
        }
        this._type = type;
        if (type === TextInput.NUMBER) {
            if (this.text && !this.validateTypeOfNumber(this.text)) {
                this.text = '';
            }
            this.interceptors.push(this.validateTypeOfNumber);
        } else {
          var index = this.interceptors.indexOf(this.validateTypeOfNumber);
          if (index !== -1) {
            this.interceptors.splice(index, 1);
          }
        }
    }
});

Object.defineProperty(TextInput.prototype, 'acceptComma', {
    get: function () {
        return this._acceptComma;
    },
    set: function (flag) {
        var isTextValid = true;
        if (typeof flag !== 'boolean') {
            return;
        }
        this._acceptComma = flag;
        if (this.type === TextInput.NUMBER && this.text) {
            isTextValid = this.validateTypeOfNumber(this.text);
        }
        if (!isTextValid) {
            this.text = '';
        }
    }
})

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

TextInput.prototype.onMouseUpOutside = function() {
  var value,
      normalized;
  if (this.type === TextInput.NUMBER) {
      value = this.text,
      normalized = normalizeTypeOfNumber(value);

      if (normalized !== value) {
          InputWrapper.setText(normalized);
          this.text = normalized;
      }
  }
  TextInput.uber.onMouseUpOutside.call(this);
}

TextInput.prototype.getLines = function() {
    return [this.text];
};

TextInput.prototype.setText = function(text) {
    if (this._displayAsPassword) {
        text = text.replace(/./gi, '*');
    }
    var hasText = this.pixiText !== undefined;
    // this.inputControlSetText(text);
    TextInput.uber.setText.call(this, text);
    if (!hasText && this.height > 0) {
        position.centerVertical(this.pixiText);
        // set cursor to start position
        if (this.cursor) {
            this.cursor.y = this.pixiText.y;
        }
    }
};

TextInput.prototype.updateSelectionBg = function() {
    var start = this.selection[0],
        end = this.selection[1];

    this.selectionBg.clear();
    if (start !== end) {
        start = this.textWidth(this.text.substring(0, start));
        end = this.textWidth(this.text.substring(0, end));
        this.selectionBg.beginFill(0x0080ff);
        this.selectionBg.drawRect(start, 0, end - start, this.pixiText.height);
        this.selectionBg.x = this.pixiText.x;
        this.selectionBg.y = this.pixiText.y;
    }
};

TextInput.prototype.validateTypeOfNumber = function(string) {
    var arr,
        intPart,
        result = null;

    if (this.acceptComma) {
        return validators.isNumberWithComma(string) ? string : result;
    }

    arr = string.split('.');

    if (arr.length > 2) {
        return result;
    }

    if (arr[1] && !validators.isNumeric(arr[1])) {
        return result;
    }

    intPart = arr[0].replace(/,/g, '');

    if (intPart.length && !validators.isNumeric(intPart)) {
        return result;
    }
    arr[0] = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return arr.join('.');
}

function normalizeTypeOfNumber(string) {
    var lastChar = string[string.length - 1];
    if (!validators.isNumeric(lastChar)) {
        string = string.slice(0, -1);
    }
    return string;
}
// TODO: autoSizeIfNeeded

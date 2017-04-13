var InputControl = require('./InputControl'),
    InputWrapper = require('../utils/InputWrapper'),
    Check = require('./Check'),
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
            this.createCheck();
            if (this.text && !validators.isNumber(this.text)) {
                this.text = '';
            }
            this.interceptors.push(validateTypeOfNumber);
        } else if (this.check) {
            this.removeCheck();
        }
    }
});

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

TextInput.prototype.createCheck = function() {
    // this.check = new Check(this.theme);
    // this.addChild(this.check);
}

TextInput.prototype.removeCheck = function() {
    // this.removeChild(this.check);
    // this.check = null;
}

function validateTypeOfNumber(string) {
    var result = null;
    if (validators.isNumber(string)) {
        result = string;
    }
    return result;
}

function normalizeTypeOfNumber(string) {
    var lastChar = string[string.length - 1];
    if (!Number.isInteger(parseInt(lastChar, 10))) {
        string = string.slice(0, -1);
    }
    return string;
}
// TODO: autoSizeIfNeeded

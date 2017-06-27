var InputControl = require('./InputControl'),
    InputWrapper = require('../utils/InputWrapper'),
    position = require('../utils/position');

/**
 * The basic Text Input - based on PIXI.Input.
 * Input by Sebastian Nette, see https://github.com/SebastianNette/PIXI.Input
 *
 * @class TextInput
 * @extends GOWN.InputControl
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the text input {GOWN.Theme}
 * @param [skinName=TextInput.SKIN_NAME] name of the text input skin {String}
 */
function TextInput(theme, skinName) {
    // show and load background image as skin (exploiting skin states)
    /**
     * The skin name
     *
     * @type String
     * @default TextInput.SKIN_NAME
     */
    this.skinName = skinName || TextInput.SKIN_NAME;

    /**
     * The valid text input states
     *
     * @private
     * @type String[]
     * @default InputControl.stateNames
     */
    this._validStates = this._validStates || InputControl.stateNames;

    InputControl.call(this, theme);
}

TextInput.prototype = Object.create(InputControl.prototype);
TextInput.prototype.constructor = TextInput;
module.exports = TextInput;

/**
 * Default text area skin name
 *
 * @static
 * @final
 * @type String
 */
TextInput.SKIN_NAME = 'text_input';

/**
 * Set display as password (show text with "*")
 *
 * @name GOWN.TextInput#displayAsPassword
 * @type bool
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

/**
 * Get the text lines as an array
 *
 * @returns {Array|*} Returns an array with one text line per array element
 */
TextInput.prototype.getLines = function() {
    return [this.text];
};

/**
 * @private
 */
TextInput.prototype.inputControlSetText = InputControl.prototype.setText;

/**
 * Set the text
 *
 * @param text The text to display {String}
 */
TextInput.prototype.setText = function(text) {
    if (this._displayAsPassword) {
        text = text.replace(/./gi, '*');
    }
    var hasText = this.pixiText !== undefined;
    this.inputControlSetText(text);
    if (!hasText && this.height > 0) {
        position.centerVertical(this.pixiText);
        // set cursor to start position
        if (this.cursor) {
            this.cursor.y = this.pixiText.y;
        }
    }
};

/**
 * Update the selection
 *
 * @private
 */
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


// TODO: autoSizeIfNeeded

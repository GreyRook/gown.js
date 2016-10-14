var InputControl = require('./InputControl'),
    position = require('../utils/position');
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

    InputControl.call(this, theme);
}

TextInput.prototype = Object.create(InputControl.prototype);
TextInput.prototype.constructor = TextInput;
module.exports = TextInput;

// name of skin
TextInput.SKIN_NAME = 'text_input';

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

TextInput.prototype.inputControlSetText = InputControl.prototype.setText;
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

TextInput.prototype.posToCoord = function(pos) {
    var text = this.pixiText.text,
        totalWidth = this.pixiText.x;

    if (pos.x < text.length) {
        return totalWidth + this.textWidth(text.substring(0, pos.x));
    } else {
        return totalWidth + this.textWidth(text);
    }
};

TextInput.prototype.updateSelectionBg = function() {
    var start = this.posToCoord(this.selection[0]),
        end = this.posToCoord(this.selection[1]);

    this.selectionBg.clear();
    if (start !== end) {
        this.selectionBg.beginFill(0x0080ff);
        this.selectionBg.drawRect(0, 0, end - start, this.pixiText.height);
        this.selectionBg.x = start;
        this.selectionBg.y = this.pixiText.y;
    }
};

TextInput.prototype.inputControlKeyDown = InputControl.prototype.onKeyDown;
TextInput.prototype.onKeyDown = function (eventData) {
    this.inputControlKeyDown(eventData);
    // update the canvas input state information from the hidden input
    this.updateTextState();
};

TextInput.prototype.onKeyUp = function () {
    this.updateTextState();
};



// TODO: autoSizeIfNeeded

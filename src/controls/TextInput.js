var InputControl = require('./InputControl'),
    KeyboardManager = require('../interaction/KeyboardManager');
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

    InputControl.call(this, theme, 'input');
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
        this.setPixiText(this._origText);
    }
});


TextInput.prototype.getLines = function() {
    return [this.text];
};

TextInput.prototype.inputControlSetPixiText = InputControl.prototype.setPixiText;
TextInput.prototype.setPixiText = function(text) {
    if (this._displayAsPassword) {
        text = text.replace(/./gi, '*');
    }
    this.inputControlSetPixiText(text);
};

TextInput.prototype.updateSelectionBg = function() {
    if (!this.hasFocus) {
        return;
    }
    var selection = KeyboardManager.wrapper.selection;
    var start = selection[0],
        end = selection[1];

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

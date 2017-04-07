var InputControl = require('./InputControl'),
    KeyboardManager = require('../interaction/KeyboardManager');

/**
 * A text entry control that allows users to enter and edit multiple lines of
 * uniformly-formatted text with the ability to scroll.
 *
 * @class TextInput
 * @extends GOWN.InputControl
 * @memberof GOWN
 * @param text editable text shown in input
 * @param displayAsPassword Display TextInput as Password (default false)
 * @param theme default theme
 * @constructor
 */

function TextArea(theme, skinName) {
    // show and load background image as skin (exploiting skin states)
    this.skinName = skinName || TextArea.SKIN_NAME;
    this._validStates = this._validStates || InputControl.stateNames;

    InputControl.call(this, theme, 'textarea');

    this._fromPos = new PIXI.Point(0, 0);
    this._toPos = new PIXI.Point(0, 0);
    this._fromText = new PIXI.Point(0, 0);
    this._toText = new PIXI.Point(0, 0);
}

TextArea.prototype = Object.create(InputControl.prototype);
TextArea.prototype.constructor = TextArea;
module.exports = TextArea;


// name of skin
TextArea.SKIN_NAME = 'text_input';


TextArea.prototype.updateSelectionBg = function() {
    if (!this.hasFocus) {
        return;
    }
    var selection = KeyboardManager.wrapper.selection;
    var start = selection[0],
        end = selection[1];
    this.selectionBg.clear();
    if (start === end) {
        return;
    }
    if (start < end) {
        this._drawSelectionBg(start, end);
    } else if (start > end) {
        this._drawSelectionBg(end, start);
    }
};


/**
 * calculate position in Text
 */
TextArea.prototype.textToLinePos = function(textPos, position) {
    var lines = this.getLines();
    var x = 0;
    for (var y = 0; y < lines.length; y++) {
        var lineLength = lines[y].length;
        if (lineLength < textPos) {
            textPos -= lineLength + 1;
        } else {
            x = textPos;
            break;
        }
    }

    if (!position) {
        position = new PIXI.Point(x, y);
    } else {
        position.x = x;
        position.y = y;
    }
    return position;
};

/**
 * new selection over multiple lines
 */
TextArea.prototype._drawSelectionBg = function (fromTextPos, toTextPos) {
    this.textToPixelPos(fromTextPos, this._fromPos);
    this.textToPixelPos(toTextPos, this._toPos);

    this.selectionBg.beginFill(0x0080ff);
    if (this._toPos.y === this._fromPos.y) {
        this.selectionBg.drawRect(
            this._fromPos.x,
            this._fromPos.y,
            this._toPos.x - this._fromPos.x,
            this.lineHeight());
        return;
    }

    this.textToLinePos(fromTextPos, this._fromText);
    this.textToLinePos(toTextPos, this._toText);
    var lines = this.getLines();
    // draw till the end of the line
    var startPos = this._fromText.x;
    for (var i = this._fromText.y; i < this._toText.y; i++) {
        var text = lines[i];
        this.selectionBg.drawRect(
            startPos > 0 ? this._fromPos.x : 0,
            i * this.lineHeight(),
            this.textWidth(text.substring(startPos, text.length)),
            this.lineHeight());
        startPos = 0;
    }
    this.selectionBg.drawRect(0,
        this._toPos.y,
        this._toPos.x,
        this.lineHeight());
};

TextArea.prototype.getLines = function() {
    var wrappedText = this.pixiText.wordWrap(this.text);
    return wrappedText.split(/(?:\r\n|\r|\n)/);
};


Object.defineProperty(InputControl.prototype, 'width', {
    get: function () {
        return this._width;
    },
    set: function(value) {
        this._width = value;
        this.minWidth = Math.min(value, this.minWidth);
        if (this.pixiText) {
            this.pixiText.style.wordWrapWidth = value - this.textOffset.x * 2;
            this._cursorNeedsUpdate = true;
            this._selectionNeedsUpdate = true;
        }
    }
});

Object.defineProperty(TextArea.prototype, 'style', {
    get: function() {
        return this.textStyle;
    },
    set: function(style) {
        this.cursorStyle = style;
        if (this.cursor) {
            this.cursor.style = style;
        }
        style = style.clone();
        style.wordWrap = true;
        if (!style.wordWrapWidth && this.textOffset && this.width) {
            style.wordWrapWidth = this.width - this.textOffset.x * 2;
        }
        this.textStyle = style;
        if (this.pixiText) {
            this.pixiText.style = style;
        }
        this._cursorNeedsUpdate = true;
    }
});

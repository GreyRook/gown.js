var InputControl = require('./InputControl');
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

    InputControl.call(this, theme);
}

TextArea.prototype = Object.create(InputControl.prototype);
TextArea.prototype.constructor = TextArea;
module.exports = TextArea;


// name of skin
TextArea.SKIN_NAME = 'text_input';

/*
 * calculate position in the text in pixel based on text width and lineHeight
 */
TextArea.prototype.posToCoord = function(pos) {
    var lines = this.getLines();
    var text = lines[pos.y];
    var textWidth = 0;

    if (pos.x < text.length) {
        textWidth = this.textWidth(text.substring(0, pos.x));
    } else {
        textWidth = this.textWidth(text);
    }


    return {
        x: this.pixiText.x + textWidth,
        y: this.pixiText.y + pos.y * this.lineHeight()
    };
};


TextArea.prototype.updateSelectionBg = function() {
    var start = this.selection[0],
        end = this.selection[1];
    this.selectionBg.clear();
    if (start.x !== end.x && start.y === end.y) {
        start = this.posToCoord(this.selection[0]);
        end = this.posToCoord(this.selection[1]);
        this.selectionBg.beginFill(0x0080ff);
        // draw first rect from start to end of line
        this.selectionBg.drawRect(start.x, start.y, end.x - start.x, this.lineHeight());
        this.selectionBg.endFill();
    } else if (start.y < end.y) {
        this._drawSelectionBg(start, end);
    } else if (start.y > end.y) {
        this._drawSelectionBg(end, start);
    }
};

TextArea.prototype._drawSelectionBg = function (_from, _to) {
    var _fromCoords = this.posToCoord(_from);
    var _toCoords = this.posToCoord(_to);
    this.selectionBg.beginFill(0x0080ff);
    var line = this.posToCoord({x: Infinity, y: _from.y});
    this.selectionBg.drawRect(_fromCoords.x, _fromCoords.y, line.x - _fromCoords.x, this.lineHeight());
    for (var i = _from.y+1; i < _to.y; i++) {
        line = this.posToCoord({x: Infinity, y: i});
        this.selectionBg.drawRect(0, line.y, line.x, this.lineHeight());
    }
    this.selectionBg.drawRect(0, _toCoords.y, _toCoords.x, this.lineHeight());
};

/**
 * calculate line height
 * (assume that every character of the pixi text has the same line height)
 */
TextArea.prototype.lineHeight = function() {
    var style = this.pixiText._style;
    var fontProperties = this.pixiText.determineFontProperties(this.pixiText._font);
    var lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
    return lineHeight;
};

/**
 * position cursor on the text
 */
TextArea.prototype.setCursorPos = function () {
    this.cursor.y = this.cursorPos.y * this.lineHeight() + this.pixiText.y;
    if (this.cursorPos.y < 0) {
        this.cursor.x = this.pixiText.x;
        return;
    }
    var txt = this.getLines()[this.cursorPos.y];
    this.cursor.x = this.pixiText.x + this.textWidth(txt.substring(0, this.cursorPos.x)) | 0;
};

TextArea.prototype.getLines = function() {
    var wrappedText = this.pixiText.wordWrap(this.text);
    return wrappedText.split(/(?:\r\n|\r|\n)/);
};

/**
 * determine where the click was made along the string
 *
 * @method clickPos
 * @param x
 * @param y
 * @returns {Array} x/y values of position
 */
TextArea.prototype.clickPos = function(x, y)
{
    var totalWidth = this.pixiText.x,
        lines = this.getLines(),
        posX = 0;


    var posY = Math.min(
        Math.max(
            parseInt(y / this.lineHeight()),
            0),
        lines.length - 1);
    var displayText = lines[posY];

    if (x < this.textWidth(displayText) + totalWidth)
    {
        // loop through each character to identify the position
        for (var i=0; i<displayText.length; i++)
        {
            totalWidth += this.textWidth(displayText[i]);
            if (totalWidth >= x)
            {
                posX = i;
                break;
            }
        }
    }

    return {x:posX, y:posY};
};


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
        this.textStyle = style;
        if (this.pixiText) {
            this.pixiText.style = style;
            this.setCursorPos();
        }
        this._cursorNeedsUpdate = true;
    }
});

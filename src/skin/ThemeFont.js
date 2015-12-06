var OPTIONS = ['fontSize', 'fontFamily', 'fill', 'align', 'stroke',
               'strokeThickness', 'wordWrap', 'wordWrapWidth', 'lineHeight',
               'dropShadow', 'dropShadowColor', 'dropShadowAngle',
               'dropShadowDistance', 'padding', 'textBaseline',
               'lineJoin', 'miterLimit'];

/**
 * @class ThemeFont
 * @memberof GOWN
 * @constructor
 */
function ThemeFont(data) {
    for(var key in data) {
        if(OPTIONS.indexOf(key) !== -1) {
            this[key] = data[key];
        }
    }

    this.fill = this.fill || '#000';
    // default font for label (e.g. buttons)
    this._fontFamily = this._fontFamily || 'Arial';
    this._fontSize = this._fontSize || 12;
}

module.exports = ThemeFont;


/**
 * clone ThemeFont instance
 *
 * @method clone
 */
ThemeFont.prototype.clone = function() {
    var re = new ThemeFont();
    for(var key in this) {
        if(OPTIONS.indexOf(key) !== -1) {
            re[key] = this[key];
        }
    }
    return re;
};

/**
 * update font string
 *
 * @method _updateFont
 * @private
 */
ThemeFont.prototype._updateFont = function() {
    this._font = this._fontSize + 'px ' + this._fontFamily;
};

/**
 * instead of setting font using fontFamily and fontSize is encouraged
 *
 * @property font
 * @type String
 */
Object.defineProperty(ThemeFont.prototype, 'font', {
    get: function() {
        return this._font;
    }
});


/**
 * Font Size
 *
 * @property fontSize
 * @type Number
 */
Object.defineProperty(ThemeFont.prototype, 'fontSize', {
    get: function() {
        return this._fontSize;
    },
    set: function(value) {
        this._fontSize = value;
        this._updateFont();
    }
});


/**
 * Font Familiy
 *
 * @property fontFamily
 * @type String
 */
Object.defineProperty(ThemeFont.prototype, 'fontFamily', {
    get: function() {
        return this._fontFamily;
    },
    set: function(value) {
        this._fontFamily = value;
        this._updateFont();
    }
});

var OPTIONS = ['fontSize', 'fontFamily', '_fontSize', '_fontFamily',
               'wordWrap', 'wordWrapWidth', 'lineHeight',
               'fill', 'align', 'stroke', 'strokeThickness',
               'dropShadow', 'dropShadowColor', 'dropShadowAngle',
               'dropShadowDistance', 'padding', 'textBaseline',
               'lineJoin', 'miterLimit'];

/**
 * Font theme
 *
 * @class ThemeFont
 * @memberof GOWN
 * @constructor
 * @param data The font style object {Object}
 */
function ThemeFont(data) {
    for(var key in data) {
        if(OPTIONS.indexOf(key) !== -1) {
            this[key] = data[key];
        }
    }

    /**
     * The font fill color
     *
     * @type String
     * @default '#000'
     */
    this.fill = this.fill || '#000';

    /**
     * The font family
     *
     * @private
     * @type String
     * @default 'Arial'
     */
    this._fontFamily = this._fontFamily || 'Arial';

    /**
     * The font size
     *
     * @private
     * @type Number
     * @default 12
     */
    this._fontSize = this._fontSize || 12;

    /**
     * @member GOWN.ThemeFont#wordWrap
     */

    /**
     * @member GOWN.ThemeFont#wordWrapWidth
     */

    /**
     * @member GOWN.ThemeFont#lineHeight
     */

    /**
     * @member GOWN.ThemeFont#align
     */

    /**
     * @member GOWN.ThemeFont#stroke
     */

    /**
     * @member GOWN.ThemeFont#strokeThickness
     */

    /**
     * @member GOWN.ThemeFont#dropShadow
     */

    /**
     * @member GOWN.ThemeFont#dropShadowColor
     */

    /**
     * @member GOWN.ThemeFont#dropShadowAngle
     */

    /**
     * @member GOWN.ThemeFont#dropShadowDistance
     */

    /**
     * @member GOWN.ThemeFont#textBaseline
     */

    /**
     * @member GOWN.ThemeFont#lineJoin
     */

    /**
     * @member GOWN.ThemeFont#miterLimit
     */
}

module.exports = ThemeFont;

/**
 * Clone the ThemeFont instance
 *
 * @return {GOWN.ThemeFont} The cloned font theme
 */
ThemeFont.prototype.clone = function() {
    var re = new ThemeFont();
    for(var key in this) {
        if(OPTIONS.indexOf(key) !== -1) {
            re[key] = this[key];
        }
    }
    re._updateFont();
    return re;
};

/**
 * Update the font string
 *
 * @private
 */
ThemeFont.prototype._updateFont = function() {
    this._font = this._fontSize + 'px ' + this._fontFamily;
};

/**
 * Instead of setting font using fontFamily and fontSize is encouraged
 *
 * @name GOWN.ThemeFont#font
 * @type String
 * @deprecated
 */
Object.defineProperty(ThemeFont.prototype, 'font', {
    get: function() {
        return this._font;
    }
});

/**
 * The font size
 *
 * @name GOWN.ThemeFont#fontSize
 * @type Number
 * @default 12
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
 * The font family
 *
 * @name GOWN.ThemeFont#fontFamily
 * @type String
 * @default 'Arial'
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

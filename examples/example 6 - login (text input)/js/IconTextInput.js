/**
 * @author Andreas Bresser
 */

/**
 * Text input with icon
 *
 * @class IconTextInput
 */

var IconTextInput = function(icon, text, theme) {
    PIXI_UI.controls.TextInput.call(this, text, theme);
    this.icon  = icon;

    this.bg = new PIXI_UI.shapes.Rect(0x111111, 0.5, 360, 46, 5);
    this.icon.x = 7;

    this.addChild(this.bg);

    this.addChild(icon);

    var pos = PIXI_UI.util.position;
    pos.centerVertical(this.icon, this.bg);
    this.interactive = true;

    this.height = 40;

    this.pixiText.x = this.icon.width + this.icon.x*2;
    pos.centerVertical(this.pixiText);
};

IconTextInput.prototype = Object.create( PIXI_UI.controls.TextInput.prototype );
IconTextInput.prototype.constructor = IconTextInput;

IconTextInput.prototype.setCursorPos = function() {
    PIXI_UI.controls.TextInput.prototype.setCursorPos.call(this);
    this.cursor.x += this.icon.width + this.icon.x*2;
    PIXI_UI.util.position.centerVertical(this.cursor);
};
/**
 * @author Andreas Bresser
 */

/**
 * Text input with icon
 *
 * @class IconTextInput
 */

var IconTextInput = function(icon, text, theme) {
    PIXI_UI.Control.call(this, theme);
    this.icon  = icon;
    this.input = new PIXI_UI.TextInput(text, {});

    this.bg = new PIXI_UI.Rect(0x111111, 0.5, 200, 42, 5);
    this.icon.x = 7;

    this.addChild(this.bg);

    this.addChild(icon);
    this.addChild(this.input);

    PIXI_UI.centerVertical(this.icon, this.bg);
    this.interactive = true;

    this.height = 40;
};

IconTextInput.prototype = Object.create( PIXI_UI.Control.prototype );
IconTextInput.prototype.constructor = IconTextInput;
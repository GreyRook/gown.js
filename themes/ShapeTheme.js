function ShapeTheme(onComplete, global) {
    GOWN.Theme.call(this, onComplete, global);
    this.textStyle.fill = '#fff';
    //TODO: this does not really work - load font somehow?!
    this.textStyle.fontFamily = 'Droid Sans';
    // nothing to load, call applyTheme directly
    this.applyTheme();
}

ShapeTheme.prototype = Object.create( GOWN.Theme.prototype );
ShapeTheme.prototype.constructor = ShapeTheme;

ShapeTheme.prototype.getDummyButton = function(color, borderColor) {
    return function() {
        var rect = new GOWN.Rect(color, 0.8);
        rect.radius = 5;
        rect.border = 2;
        rect.borderColor = borderColor;
        return rect;
    }
};

ShapeTheme.prototype.themeApplyTheme = GOWN.Theme.prototype.applyTheme;
ShapeTheme.prototype.applyTheme = function() {
    var b = GOWN.Button;
    //var tb = GOWN.ToggleButton;
    this.setSkin(b.SKIN_NAME, b.UP,
        this.getDummyButton(0x6073c8, 0x0000ff));
    this.setSkin(b.SKIN_NAME, b.DOWN,
        this.getDummyButton(0xEA8686, 0xff0000));
    this.setSkin(b.SKIN_NAME, b.HOVER,
        this.getDummyButton(0x60c865, 0x00ff00));
    this.themeApplyTheme();
};

ShapeTheme.BUTTON_SCALE_9_GRID = new PIXI.Rectangle(6, 6, 70, 10);

GOWN.ShapeTheme = ShapeTheme;

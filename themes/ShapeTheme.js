function ShapeTheme(onComplete, global) {
    PIXI_UI.skin.Theme.call(this, global);
    this.textStyle = {
        "fill": "#fff",
        "font": "20px Arial"
    };
    this.onComplete = onComplete;
    this.setSkins();
}

ShapeTheme.prototype = Object.create( PIXI_UI.skin.Theme.prototype );
ShapeTheme.prototype.constructor = ShapeTheme;

ShapeTheme.prototype.getDummyButton = function(color, borderColor) {
    return function() {
        var rect = new PIXI_UI.shapes.Rect(color, 0.8);
        rect.radius = 5;
        rect.border = 2;
        rect.borderColor = borderColor;
        return rect;
    }
};

ShapeTheme.prototype.setSkins = function() {
    var b = PIXI_UI.controls.Button;
    //var tb = PIXI_UI.controls.ToggleButton;
    this.setSkin(b.SKIN_NAME, b.UP,
        this.getDummyButton(0x6073c8, 0x0000ff));
    this.setSkin(b.SKIN_NAME, b.DOWN,
        this.getDummyButton(0xEA8686, 0xff0000));
    this.setSkin(b.SKIN_NAME, b.HOVER,
        this.getDummyButton(0x60c865, 0x00ff00));

    // TODO: emit
    if (this._onComplete) {
        this._onComplete();
    }
};

ShapeTheme.BUTTON_SCALE_9_GRID = new PIXI.math.Rectangle(6, 6, 70, 10);

PIXI_UI.ShapeTheme = ShapeTheme;
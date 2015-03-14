PIXI_UI.ShapeTheme = function(onComplete, global) {
    PIXI_UI.Theme.call(this, global);
    this.textStyle = {
        "fill": "#fff",
        "font": "20px Arial"
    };
    this.onComplete = onComplete;
    this.setSkins();
};

PIXI_UI.ShapeTheme.prototype = Object.create( PIXI_UI.Theme.prototype );
PIXI_UI.ShapeTheme.prototype.constructor = PIXI_UI.ShapeTheme;

PIXI_UI.ShapeTheme.prototype.getDummyButton = function(color, borderColor) {
    return function() {
        var rect = new PIXI_UI.Rect(color, 0.8);
        rect.radius = 5;
        rect.border = 2;
        rect.borderColor = borderColor;
        return rect;
    }
};

PIXI_UI.ShapeTheme.prototype.setSkins = function() {
    var b = PIXI_UI.Button;
    //var tb = PIXI_UI.ToggleButton;
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

PIXI_UI.ShapeTheme.BUTTON_SCALE_9_GRID = new PIXI.Rectangle(6, 6, 70, 10);
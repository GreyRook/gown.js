function MetalWorksMobileTheme(jsonPath, onComplete, global) {
    PIXI_UI.Theme.call(this, global);

    // drag-thumb for slider does not have a skin
    this.thumbSkin = false;

    // skin is mobile - does not provide hover state
    this.hoverSkin = false;

    // default color for label (e.g. buttons)
    this.textStyle.fill = '#4a4137';
    // default font for label (e.g. buttons)
    this.textStyle.font = '20px Arial';

    this.thumbSize = 32;

    this._onComplete = onComplete;
    if (jsonPath) {
        this.loadImage(jsonPath);
    } else {
        this.loadComplete();
    }
}

MetalWorksMobileTheme.prototype = Object.create( PIXI_UI.Theme.prototype );
MetalWorksMobileTheme.prototype.constructor = MetalWorksMobileTheme;

MetalWorksMobileTheme.prototype.themeLoadComplete = PIXI_UI.Theme.prototype.loadComplete;
MetalWorksMobileTheme.prototype.loadComplete = function(loader, resources) {
    this.themeLoadComplete(this, loader, resources);
    var b = PIXI_UI.Button;
    var bg = MetalWorksMobileTheme.BUTTON_SCALE_9_GRID;

    this.setSkin(b.SKIN_NAME, b.UP,
        this.getScaleContainer("button-up-skin", bg));
    this.setSkin(b.SKIN_NAME, b.DOWN,
        this.getScaleContainer("button-down-skin", bg));


    if (PIXI_UI.ToggleButton) {
        var tb = PIXI_UI.ToggleButton;
        var sbg = MetalWorksMobileTheme.SELECTED_BUTTON_SCALE_9_GRID;

        this.setSkin(tb.SKIN_NAME, b.UP,
            this.getScaleContainer("button-up-skin", bg));
        this.setSkin(tb.SKIN_NAME, b.DOWN,
            this.getScaleContainer("button-down-skin", bg));

        this.setSkin(tb.SKIN_NAME, tb.SELECTED_UP,
            this.getScaleContainer("button-selected-up-skin", sbg));
        this.setSkin(tb.SKIN_NAME, tb.SELECTED_DOWN,
            this.getScaleContainer("button-down-skin", bg));
    }
    if (PIXI_UI.ScrollBar) {
        var sb = PIXI_UI.ScrollBar;
        // "background-skin"
        this.setSkin(sb.SKIN_NAME, "horizontal_track",
            this.getScaleContainer("background-skin",
                MetalWorksMobileTheme.DEFAULT_SCALE9_GRID));
        this.setSkin(sb.SKIN_NAME, "vertical_track",
            this.getScaleContainer("background-skin",
                MetalWorksMobileTheme.DEFAULT_SCALE9_GRID));
    }

    /*
    if (PIXI_UI.TextInput) {
        var ti = PIXI_UI.TextInput;
        this.setSkin(ti.SKIN_NAME, "background",
            this.getScaleContainer("text-input-background-skin",
                MetalWorksMobileTheme.TEXT_INPUT_SCALE_9_GRID));
    }
    */

    // TODO: emit
    if (this._onComplete) {
        this._onComplete();
    }
};

MetalWorksMobileTheme.BUTTON_SCALE_9_GRID = new PIXI.math.Rectangle(5, 5, 50, 50);
MetalWorksMobileTheme.SELECTED_BUTTON_SCALE_9_GRID = new PIXI.math.Rectangle(8, 8, 44, 44);
MetalWorksMobileTheme.DEFAULT_SCALE9_GRID = new PIXI.math.Rectangle(5, 5, 22, 22);
/*
MetalWorksMobileTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.math.Rectangle(5, 2, 42, 6);
MetalWorksMobileTheme.HORIZONTAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.math.Rectangle(1, 2, 2, 11);
MetalWorksMobileTheme.HORIZONTAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.math.Rectangle(2, 2, 10, 11);
MetalWorksMobileTheme.TEXT_INPUT_SCALE_9_GRID = new PIXI.math.Rectangle(2, 2, 148, 18);
MetalWorksMobileTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.math.Rectangle(2, 5, 6, 42);
MetalWorksMobileTheme.VERTICAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.math.Rectangle(2, 1, 11, 2);
MetalWorksMobileTheme.VERTICAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.math.Rectangle(2, 2, 11, 10);
*/
PIXI_UI.MetalWorksMobileTheme = MetalWorksMobileTheme;
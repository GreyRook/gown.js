function MetalWorksMobileTheme(jsonPath, onComplete, global) {
    GOWN.Theme.call(this, onComplete, global);

    // drag-thumb for slider does not have a skin
    this.thumbSkin = false;

    // skin is mobile - does not provide hover state
    this.hoverSkin = false;

    // default color for label (e.g. buttons)
    this.textStyle.fill = '#4a4137';
    // default font for label (e.g. buttons)
    this.textStyle.font = 'Arial';
    this.textStyle.fontSize = 20;

    this.thumbSize = 32;

    if (jsonPath) {
        this.loadImage(jsonPath);
    }
}

MetalWorksMobileTheme.prototype = Object.create( GOWN.Theme.prototype );
MetalWorksMobileTheme.prototype.constructor = MetalWorksMobileTheme;

MetalWorksMobileTheme.prototype.themeApplyTheme = GOWN.Theme.prototype.applyTheme;
MetalWorksMobileTheme.prototype.applyTheme = function() {
    var b = GOWN.Button;
    var bg = MetalWorksMobileTheme.BUTTON_SCALE_9_GRID;

    this.setSkin(b.SKIN_NAME, b.UP,
        this.getScaleContainer("button-up-skin", bg));
    this.setSkin(b.SKIN_NAME, b.DOWN,
        this.getScaleContainer("button-down-skin", bg));

    var tb = GOWN.ToggleButton;
    if (tb) {
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
    if (GOWN.ScrollBar) {
        var sb = GOWN.ScrollBar;
        // "background-skin"
        this.setSkin(sb.SKIN_NAME, "horizontal_track",
            this.getScaleContainer("background-skin",
                MetalWorksMobileTheme.DEFAULT_SCALE9_GRID));
        this.setSkin(sb.SKIN_NAME, "vertical_track",
            this.getScaleContainer("background-skin",
                MetalWorksMobileTheme.DEFAULT_SCALE9_GRID));
    }


    if (GOWN.PickerList) {
        var pl = GOWN.PickerList;

        this.setSkin(pl.SKIN_NAME, b.UP,
            this.getScaleContainer("button-up-skin", bg));
        this.setSkin(pl.SKIN_NAME, b.DOWN,
            this.getScaleContainer("button-down-skin", bg));

        this.setSkin(pl.SKIN_NAME, "picker_list_" + b.UP,
            this.getImage("picker-list-icon"));
    }
    if (GOWN.Check) {
        var chk = GOWN.Check;

        this.setSkin(chk.SKIN_NAME, b.UP,
            this.getImage("background-skin"));
        this.setSkin(chk.SKIN_NAME, b.DOWN,
            this.getImage("background-down-skin"));

        this.setSkin(chk.SKIN_NAME, tb.SELECTED_UP,
            this.getImage("check-selected-up-icon"));
        this.setSkin(chk.SKIN_NAME, tb.SELECTED_DOWN,
            this.getImage("check-selected-down-icon"));
    }

    /*
    if (GOWN.TextInput) {
        var ti = GOWN.TextInput;
        this.setSkin(ti.SKIN_NAME, "background",
            this.getScaleContainer("text-input-background-skin",
                MetalWorksMobileTheme.TEXT_INPUT_SCALE_9_GRID));
    }
    */

    this.themeApplyTheme();

};

MetalWorksMobileTheme.BUTTON_SCALE_9_GRID = new PIXI.Rectangle(5, 5, 50, 50);
MetalWorksMobileTheme.SELECTED_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(5, 5, 50, 50);
MetalWorksMobileTheme.DEFAULT_SCALE9_GRID = new PIXI.Rectangle(5, 5, 22, 22);
/*
MetalWorksMobileTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.Rectangle(5, 2, 42, 6);
MetalWorksMobileTheme.HORIZONTAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.Rectangle(1, 2, 2, 11);
MetalWorksMobileTheme.HORIZONTAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 10, 11);
MetalWorksMobileTheme.TEXT_INPUT_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 148, 18);
MetalWorksMobileTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.Rectangle(2, 5, 6, 42);
MetalWorksMobileTheme.VERTICAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.Rectangle(2, 1, 11, 2);
MetalWorksMobileTheme.VERTICAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 11, 10);
*/
GOWN.MetalWorksMobileTheme = MetalWorksMobileTheme;

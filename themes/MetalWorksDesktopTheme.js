function MetalWorksDesktopTheme(jsonPath, onComplete, global) {
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

    this.scale_9_grids

    this.thumbSize = 32;

    if (jsonPath) {
        this.loadImage(jsonPath);
    }
}

MetalWorksDesktopTheme.prototype = Object.create( GOWN.Theme.prototype );
MetalWorksDesktopTheme.prototype.constructor = MetalWorksDesktopTheme;

MetalWorksDesktopTheme.prototype.themeApplyTheme = GOWN.Theme.prototype.applyTheme;
MetalWorksDesktopTheme.prototype.applyTheme = function() {
    var b = GOWN.Button;
    var bg = this.scale_9_grids["BUTTON_SCALE_9_GRID"];

    this.setSkin(b.SKIN_NAME, b.UP,
        this.getScaleContainer("button-up-skin0000", bg));
    this.setSkin(b.SKIN_NAME, b.DOWN,
        this.getScaleContainer("button-down-skin0000", bg));

    var tb = GOWN.ToggleButton;
    if (tb) {
        var sbg = this.scale_9_grids["SELECTED_BUTTON_SCALE_9_GRID"];

        this.setSkin(tb.SKIN_NAME, b.UP,
            this.getScaleContainer("button-up-skin0000", bg));
        this.setSkin(tb.SKIN_NAME, b.DOWN,
            this.getScaleContainer("button-down-skin0000", bg));

        this.setSkin(tb.SKIN_NAME, tb.SELECTED_UP,
            this.getScaleContainer("button-selected-up-skin0000", sbg));
        this.setSkin(tb.SKIN_NAME, tb.SELECTED_DOWN,
            this.getScaleContainer("button-down-skin0000", bg));
    }
    if (GOWN.ScrollBar) {
        var sb = GOWN.ScrollBar;
        // "background-skin"
        this.setSkin(sb.SKIN_NAME, "horizontal_track",
            this.getScaleContainer("background-skin0000",
                this.scale_9_grids["DEFAULT_SCALE9_GRID"]));
        this.setSkin(sb.SKIN_NAME, "vertical_track",
            this.getScaleContainer("background-skin0000",
                this.scale_9_grids["DEFAULT_SCALE9_GRID"]));
    }


    if (GOWN.PickerList) {
        var pl = GOWN.PickerList;

        this.setSkin(pl.SKIN_NAME, b.UP,
            this.getScaleContainer("button-up-skin0000", bg));
        this.setSkin(pl.SKIN_NAME, b.DOWN,
            this.getScaleContainer("button-down-skin0000", bg));

        this.setSkin(pl.SKIN_NAME, "picker_list_" + b.UP,
            this.getImage("picker-list-icon0000"));
    }
    if (GOWN.Check) {
        var chk = GOWN.Check;

        this.setSkin(chk.SKIN_NAME, b.UP,
            this.getImage("background-skin0000"));
        this.setSkin(chk.SKIN_NAME, b.DOWN,
            this.getImage("background-down-skin0000"));

        this.setSkin(chk.SKIN_NAME, tb.SELECTED_UP,
            this.getImage("check-selected-up-icon0000"));
        this.setSkin(chk.SKIN_NAME, tb.SELECTED_DOWN,
            this.getImage("check-selected-down-icon0000"));
    }

    /*
    if (GOWN.TextInput) {
        var ti = GOWN.TextInput;
        this.setSkin(ti.SKIN_NAME, "background",
            this.getScaleContainer("text-input-background-skin",
                MetalWorksDesktopTheme.TEXT_INPUT_SCALE_9_GRID));
    }
    */

    this.themeApplyTheme();

};

MetalWorksDesktopTheme.DEFAULT_SCALE9_GRID = new PIXI.Rectangle(3, 3, 1, 1);
MetalWorksDesktopTheme.SIMPLE_SCALE9_GRID = new PIXI.Rectangle(2, 2, 1, 1);
MetalWorksDesktopTheme.BUTTON_SCALE_9_GRID = new PIXI.Rectangle(3, 3, 1, 16);
MetalWorksDesktopTheme.TOGGLE_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(4, 4, 1, 14);
MetalWorksDesktopTheme.SCROLL_BAR_STEP_BUTTON_SCALE9_GRID = new PIXI.Rectangle(3, 3, 6, 6);

// TODO: unused?/use toggle instead?
MetalWorksDesktopTheme.SELECTED_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(3, 3, 1, 16);

/*
MetalWorksDesktopTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.Rectangle(5, 2, 42, 6);
MetalWorksDesktopTheme.HORIZONTAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.Rectangle(1, 2, 2, 11);
MetalWorksDesktopTheme.HORIZONTAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 10, 11);
MetalWorksDesktopTheme.TEXT_INPUT_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 148, 18);
MetalWorksDesktopTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.Rectangle(2, 5, 6, 42);
MetalWorksDesktopTheme.VERTICAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.Rectangle(2, 1, 11, 2);
MetalWorksDesktopTheme.VERTICAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 11, 10);
*/
GOWN.MetalWorksDesktopTheme = MetalWorksDesktopTheme;

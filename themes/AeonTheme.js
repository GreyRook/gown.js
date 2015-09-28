function AeonTheme(jsonPath, onComplete, global) {
    GOWN.Theme.call(this, global);
    this._onComplete = onComplete;
    if (jsonPath) {
        this.loadImage(jsonPath);
    } else {
        this.loadComplete();
    }
}

AeonTheme.prototype = Object.create( GOWN.Theme.prototype );
AeonTheme.prototype.constructor = AeonTheme;

AeonTheme.prototype.themeLoadComplete = GOWN.Theme.prototype.loadComplete;
AeonTheme.prototype.loadComplete = function(loader, resources) {
    this.themeLoadComplete(this, loader, resources);
    var b = GOWN.Button;
    var bg = AeonTheme.BUTTON_SCALE_9_GRID;

    this.setSkin(b.SKIN_NAME, b.UP,
        this.getScaleContainer("button-up-skin", bg));
    this.setSkin(b.SKIN_NAME, b.DOWN,
        this.getScaleContainer("button-down-skin", bg));
    this.setSkin(b.SKIN_NAME, b.HOVER,
        this.getScaleContainer("button-hover-skin", bg));


    if (GOWN.ToggleButton) {
        var tb = GOWN.ToggleButton;
        var sbg = AeonTheme.SELECTED_BUTTON_SCALE_9_GRID;

        this.setSkin(tb.SKIN_NAME, b.UP,
            this.getScaleContainer("button-up-skin", bg));
        this.setSkin(tb.SKIN_NAME, b.DOWN,
            this.getScaleContainer("button-down-skin", bg));
        this.setSkin(tb.SKIN_NAME, b.HOVER,
            this.getScaleContainer("button-hover-skin", bg));

        this.setSkin(tb.SKIN_NAME, tb.SELECTED_UP,
            this.getScaleContainer("button-selected-up-skin", sbg));
        this.setSkin(tb.SKIN_NAME, tb.SELECTED_DOWN,
            this.getScaleContainer("button-selected-down-skin", sbg));
        this.setSkin(tb.SKIN_NAME, tb.SELECTED_HOVER,
            this.getScaleContainer("button-selected-hover-skin", sbg));
    }


    if (GOWN.ScrollBar) {
        var sb = GOWN.ScrollBar;

        this.setSkin(sb.SKIN_NAME, "horizontal_track",
            this.getScaleContainer("horizontal-scroll-bar-track-skin",
                AeonTheme.HORIZONTAL_SCROLL_BAR_TRACK_SCALE_9_GRID));
        this.setSkin(sb.SKIN_NAME, "vertical_track",
            this.getScaleContainer("vertical-scroll-bar-track-skin",
                AeonTheme.VERTICAL_SCROLL_BAR_TRACK_SCALE_9_GRID));
    }
    if (GOWN.ScrollThumb) {
        var st = GOWN.ScrollThumb;
        this.setSkin(st.SKIN_NAME, "horizontal_" + b.UP,
            this.getScaleContainer("horizontal-scroll-bar-thumb-up-skin",
                AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "horizontal_" + b.DOWN,
            this.getScaleContainer("horizontal-scroll-bar-thumb-down-skin",
                AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "horizontal_" + b.HOVER,
            this.getScaleContainer("horizontal-scroll-bar-thumb-hover-skin",
                AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "horizontal_thumb",
            this.getImage("horizontal-scroll-bar-thumb-icon"));


        this.setSkin(st.SKIN_NAME, "vertical_" + b.UP,
            this.getScaleContainer("vertical-scroll-bar-thumb-up-skin",
                AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "vertical_" + b.DOWN,
            this.getScaleContainer("vertical-scroll-bar-thumb-down-skin",
                AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "vertical_" + b.HOVER,
            this.getScaleContainer("vertical-scroll-bar-thumb-hover-skin",
                AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "vertical_thumb",
            this.getImage("vertical-scroll-bar-thumb-icon"));
    }

    if (GOWN.TextInput) {
        var ti = GOWN.TextInput;
        this.setSkin(ti.SKIN_NAME, "background",
            this.getScaleContainer("text-input-background-skin",
                AeonTheme.TEXT_INPUT_SCALE_9_GRID));
    }

    if (GOWN.CheckBox) {
        var chk = GOWN.CheckBox;

        this.setSkin(chk.SKIN_NAME, chk.UP,
            this.getImage("check-up-icon"));
        this.setSkin(chk.SKIN_NAME, chk.DOWN,
            this.getImage("check-down-icon"));
        this.setSkin(chk.SKIN_NAME, chk.HOVER,
            this.getImage("check-hover-icon"));

        this.setSkin(chk.SKIN_NAME, chk.SELECTED_UP,
            this.getImage("check-selected-up-icon"));
        this.setSkin(chk.SKIN_NAME, chk.SELECTED_DOWN,
            this.getImage("check-selected-down-icon"));
        this.setSkin(chk.SKIN_NAME, chk.SELECTED_HOVER,
            this.getImage("check-selected-hover-icon"));
    }


    // TODO: emit
    if (this._onComplete) {
        this._onComplete();
    }
};

AeonTheme.BUTTON_SCALE_9_GRID = new PIXI.Rectangle(6, 6, 70, 10);
AeonTheme.SELECTED_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(6, 6, 52, 10);
AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.Rectangle(5, 2, 42, 6);
AeonTheme.HORIZONTAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.Rectangle(1, 2, 2, 11);
AeonTheme.HORIZONTAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 10, 11);
AeonTheme.TEXT_INPUT_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 148, 18);
AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.Rectangle(2, 5, 6, 42);
AeonTheme.VERTICAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.Rectangle(2, 1, 11, 2);
AeonTheme.VERTICAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 11, 10);

GOWN.AeonTheme = AeonTheme;

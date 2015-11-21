function AeonTheme(jsonPath, onComplete, global) {
    GOWN.Theme.call(this, onComplete, global);
    if (jsonPath) {
        this.loadImage(jsonPath);
    }
}

AeonTheme.prototype = Object.create( GOWN.Theme.prototype );
AeonTheme.prototype.constructor = AeonTheme;

AeonTheme.prototype.themeApplyTheme = GOWN.Theme.prototype.applyTheme;
AeonTheme.prototype.applyTheme = function() {
    var b = GOWN.Button;
    var bg = AeonTheme.BUTTON_SCALE_9_GRID;

    this.setSkin(b.SKIN_NAME, b.UP,
        this.getScaleContainer("button-up-skin0000", bg));
    this.setSkin(b.SKIN_NAME, b.DOWN,
        this.getScaleContainer("button-down-skin0000", bg));
    this.setSkin(b.SKIN_NAME, b.HOVER,
        this.getScaleContainer("button-hover-skin0000", bg));

    var tb = GOWN.ToggleButton;
    if (tb) {
        var sbg = AeonTheme.SELECTED_BUTTON_SCALE_9_GRID;

        this.setSkin(tb.SKIN_NAME, b.UP,
            this.getScaleContainer("button-up-skin0000", bg));
        this.setSkin(tb.SKIN_NAME, b.DOWN,
            this.getScaleContainer("button-down-skin0000", bg));
        this.setSkin(tb.SKIN_NAME, b.HOVER,
            this.getScaleContainer("button-hover-skin0000", bg));

        this.setSkin(tb.SKIN_NAME, tb.SELECTED_UP,
            this.getScaleContainer("toggle-button-selected-up-skin0000", sbg));
        this.setSkin(tb.SKIN_NAME, tb.SELECTED_DOWN,
            this.getScaleContainer("toggle-button-selected-down-skin0000", sbg));
        this.setSkin(tb.SKIN_NAME, tb.SELECTED_HOVER,
            this.getScaleContainer("toggle-button-selected-hover-skin0000", sbg));
    }


    if (GOWN.ScrollBar) {
        var sb = GOWN.ScrollBar;

        this.setSkin(sb.SKIN_NAME, "horizontal_track",
            this.getScaleContainer("horizontal-scroll-bar-track-skin0000",
                AeonTheme.HORIZONTAL_SCROLL_BAR_TRACK_SCALE_9_GRID));
        this.setSkin(sb.SKIN_NAME, "vertical_track",
            this.getScaleContainer("vertical-scroll-bar-track-skin0000",
                AeonTheme.VERTICAL_SCROLL_BAR_TRACK_SCALE_9_GRID));
    }
    if (GOWN.ScrollThumb) {
        var st = GOWN.ScrollThumb;
        this.setSkin(st.SKIN_NAME, "horizontal_" + b.UP,
            this.getScaleContainer("horizontal-scroll-bar-thumb-up-skin0000",
                AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "horizontal_" + b.DOWN,
            this.getScaleContainer("horizontal-scroll-bar-thumb-down-skin0000",
                AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "horizontal_" + b.HOVER,
            this.getScaleContainer("horizontal-scroll-bar-thumb-hover-skin0000",
                AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "horizontal_thumb",
            this.getImage("horizontal-scroll-bar-thumb-icon0000"));


        this.setSkin(st.SKIN_NAME, "vertical_" + b.UP,
            this.getScaleContainer("vertical-scroll-bar-thumb-up-skin0000",
                AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "vertical_" + b.DOWN,
            this.getScaleContainer("vertical-scroll-bar-thumb-down-skin0000",
                AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "vertical_" + b.HOVER,
            this.getScaleContainer("vertical-scroll-bar-thumb-hover-skin0000",
                AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
        this.setSkin(st.SKIN_NAME, "vertical_thumb",
            this.getImage("vertical-scroll-bar-thumb-icon0000"));
    }

    if (GOWN.PickerList) {
        var pl = GOWN.PickerList;
        tb = GOWN.ToggleButton;
        sbg = AeonTheme.SELECTED_BUTTON_SCALE_9_GRID;

        this.setSkin(pl.SKIN_NAME, b.UP,
            this.getScaleContainer("button-up-skin0000", bg));
        this.setSkin(pl.SKIN_NAME, b.DOWN,
            this.getScaleContainer("button-down-skin0000", bg));
        this.setSkin(pl.SKIN_NAME, b.HOVER,
            this.getScaleContainer("button-hover-skin0000", bg));

        this.setSkin(pl.SKIN_NAME, tb.SELECTED_UP,
            this.getScaleContainer("button-down-skin0000", sbg));
        this.setSkin(pl.SKIN_NAME, tb.SELECTED_DOWN,
            this.getScaleContainer("button-down-skin0000", sbg));
        this.setSkin(pl.SKIN_NAME, tb.SELECTED_HOVER,
            this.getScaleContainer("button-down-skin0000", sbg));

        this.setSkin(pl.SKIN_NAME, "picker_list_" + b.UP,
            this.getImage("picker-list-up-icon0000"));
        this.setSkin(pl.SKIN_NAME, "picker_list_" + b.DOWN,
            this.getImage("picker-list-down-icon0000"));
        this.setSkin(pl.SKIN_NAME, "picker_list_" + b.HOVER,
            this.getImage("picker-list-hover-icon0000"));
    }

    if (GOWN.TextInput) {
        var ti = GOWN.TextInput;
        this.setSkin(ti.SKIN_NAME, "background",
            this.getScaleContainer("text-input-background-enabled-skin0000",
                AeonTheme.TEXT_INPUT_SCALE_9_GRID));
    }

    if (GOWN.Check) {
        var chk = GOWN.Check;

        this.setSkin(chk.SKIN_NAME, b.UP,
            this.getImage("check-up-icon0000"));
        this.setSkin(chk.SKIN_NAME, b.DOWN,
            this.getImage("check-down-icon0000"));
        this.setSkin(chk.SKIN_NAME, b.HOVER,
            this.getImage("check-hover-icon0000"));

        this.setSkin(chk.SKIN_NAME, tb.SELECTED_UP,
            this.getImage("check-selected-up-icon0000"));
        this.setSkin(chk.SKIN_NAME, tb.SELECTED_DOWN,
            this.getImage("check-selected-down-icon0000"));
        this.setSkin(chk.SKIN_NAME, tb.SELECTED_HOVER,
            this.getImage("check-selected-hover-icon0000"));
    }
    this.themeApplyTheme();
};

AeonTheme.BUTTON_SCALE_9_GRID = new PIXI.Rectangle(8, 8, 6, 29);
AeonTheme.SELECTED_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(8, 8, 6, 29);
AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.Rectangle(5, 2, 93, 18);
AeonTheme.HORIZONTAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.Rectangle(1, 2, 6, 26);
AeonTheme.HORIZONTAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 10, 11);
AeonTheme.TEXT_INPUT_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 6, 6);
AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.Rectangle(2, 5, 18, 93);
AeonTheme.VERTICAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.Rectangle(2, 1, 26, 6);
AeonTheme.VERTICAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 11, 10);

GOWN.AeonTheme = AeonTheme;

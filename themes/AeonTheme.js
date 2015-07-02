function AeonTheme(jsonPath, onComplete, global) {
    PIXI_UI.Theme.call(this, global);
    this._onComplete = onComplete;
    if (jsonPath) {
        this.loadImage(jsonPath);
    } else {
        this.loadComplete();
    }
}

AeonTheme.prototype = Object.create( PIXI_UI.Theme.prototype );
AeonTheme.prototype.constructor = AeonTheme;

AeonTheme.prototype.themeLoadComplete = PIXI_UI.Theme.prototype.loadComplete;
AeonTheme.prototype.loadComplete = function(loader, resources) {
    this.themeLoadComplete(this, loader, resources);
    var b = PIXI_UI.Button;
    var bg = AeonTheme.BUTTON_SCALE_9_GRID;

    this.setSkin(b.SKIN_NAME, b.UP,
        this.getScaleContainer("button-up-skin", bg));
    this.setSkin(b.SKIN_NAME, b.DOWN,
        this.getScaleContainer("button-down-skin", bg));
    this.setSkin(b.SKIN_NAME, b.HOVER,
        this.getScaleContainer("button-hover-skin", bg));


    if (PIXI_UI.ToggleButton) {
        var tb = PIXI_UI.ToggleButton;
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


    if (PIXI_UI.ScrollBar) {
        var sb = PIXI_UI.ScrollBar;

        this.setSkin(sb.SKIN_NAME, "horizontal_track",
            this.getScaleContainer("horizontal-scroll-bar-track-skin",
                AeonTheme.HORIZONTAL_SCROLL_BAR_TRACK_SCALE_9_GRID));
        this.setSkin(sb.SKIN_NAME, "vertical_track",
            this.getScaleContainer("vertical-scroll-bar-track-skin",
                AeonTheme.VERTICAL_SCROLL_BAR_TRACK_SCALE_9_GRID));
    }
    if (PIXI_UI.ScrollThumb) {
        var st = PIXI_UI.ScrollThumb;
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

    if (PIXI_UI.PickerList) {
        var pl = PIXI_UI.PickerList;
        tb = PIXI_UI.ToggleButton;
        sbg = AeonTheme.SELECTED_BUTTON_SCALE_9_GRID;

        this.setSkin(pl.SKIN_NAME, b.UP,
            this.getScaleContainer("button-up-skin", bg));
        this.setSkin(pl.SKIN_NAME, b.DOWN,
            this.getScaleContainer("button-down-skin", bg));
        this.setSkin(pl.SKIN_NAME, b.HOVER,
            this.getScaleContainer("button-hover-skin", bg));

        this.setSkin(pl.SKIN_NAME, tb.SELECTED_UP,
            this.getScaleContainer("button-selected-down-skin", sbg));
        this.setSkin(pl.SKIN_NAME, tb.SELECTED_DOWN,
            this.getScaleContainer("button-selected-down-skin", sbg));
        this.setSkin(pl.SKIN_NAME, tb.SELECTED_HOVER,
            this.getScaleContainer("button-down-skin", sbg));

        this.setSkin(pl.SKIN_NAME, "picker_list_" + b.UP,
            this.getImage("picker-list-up-icon"));
        this.setSkin(pl.SKIN_NAME, "picker_list_" + b.DOWN,
            this.getImage("picker-list-down-icon"));
        this.setSkin(pl.SKIN_NAME, "picker_list_" + b.HOVER,
            this.getImage("picker-list-hover-icon"));
    }

    if (PIXI_UI.TextInput) {
        var ti = PIXI_UI.TextInput;
        this.setSkin(ti.SKIN_NAME, "background",
            this.getScaleContainer("text-input-background-skin",
                AeonTheme.TEXT_INPUT_SCALE_9_GRID));
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

PIXI_UI.AeonTheme = AeonTheme;
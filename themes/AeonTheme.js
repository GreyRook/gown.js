PIXI_UI.AeonTheme = function(jsonPath, onComplete, global) {
    PIXI_UI.Theme.call(this, global);
    this._onComplete = onComplete;
    this.loadImage(jsonPath);
};

PIXI_UI.AeonTheme.prototype = Object.create( PIXI_UI.Theme.prototype );
PIXI_UI.AeonTheme.prototype.constructor = PIXI_UI.AeonTheme;

PIXI_UI.AeonTheme.prototype.loadComplete = function() {
    var b = PIXI_UI.Button;
    var tb = PIXI_UI.ToggleButton;
    var bg = PIXI_UI.AeonTheme.BUTTON_SCALE_9_GRID;
    var sbg = PIXI_UI.AeonTheme.SELECTED_BUTTON_SCALE_9_GRID;
    //var tb = PIXI_UI.ToggleButton;
    this.setSkin(b.SKIN_NAME, b.UP,
        this.getScaleContainer("button-up-skin", bg));
    this.setSkin(b.SKIN_NAME, b.DOWN,
        this.getScaleContainer("button-down-skin", bg));
    this.setSkin(b.SKIN_NAME, b.HOVER,
        this.getScaleContainer("button-hover-skin", bg));

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


    var sb = PIXI_UI.ScrollBar;
    var st = PIXI_UI.ScrollThumb;

    this.setSkin(sb.SKIN_NAME, "horizontal_track",
        this.getScaleContainer("horizontal-scroll-bar-track-skin",
            PIXI_UI.AeonTheme.HORIZONTAL_SCROLL_BAR_TRACK_SCALE_9_GRID));

    this.setSkin(st.SKIN_NAME, "horizontal_" + b.UP,
        this.getScaleContainer("horizontal-scroll-bar-thumb-up-skin",
            PIXI_UI.AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
    this.setSkin(st.SKIN_NAME, "horizontal_" + b.DOWN,
        this.getScaleContainer("horizontal-scroll-bar-thumb-down-skin",
            PIXI_UI.AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
    this.setSkin(st.SKIN_NAME, "horizontal_" + b.HOVER,
        this.getScaleContainer("horizontal-scroll-bar-thumb-hover-skin",
            PIXI_UI.AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
    this.setSkin(st.SKIN_NAME, "horizontal_thumb",
        this.getImage("horizontal-scroll-bar-thumb-icon"));



    this.setSkin(sb.SKIN_NAME, "vertical_track",
        this.getScaleContainer("vertical-scroll-bar-track-skin",
            PIXI_UI.AeonTheme.VERTICAL_SCROLL_BAR_TRACK_SCALE_9_GRID));

    this.setSkin(st.SKIN_NAME, "vertical_" + b.UP,
        this.getScaleContainer("vertical-scroll-bar-thumb-up-skin",
            PIXI_UI.AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
    this.setSkin(st.SKIN_NAME, "vertical_" + b.DOWN,
        this.getScaleContainer("vertical-scroll-bar-thumb-down-skin",
            PIXI_UI.AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
    this.setSkin(st.SKIN_NAME, "vertical_" + b.HOVER,
        this.getScaleContainer("vertical-scroll-bar-thumb-hover-skin",
            PIXI_UI.AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID));
    this.setSkin(st.SKIN_NAME, "vertical_thumb",
        this.getImage("vertical-scroll-bar-thumb-icon"));


    // TODO: emit
    if (this._onComplete) {
        this._onComplete();
    }
};

PIXI_UI.AeonTheme.BUTTON_SCALE_9_GRID = new PIXI.Rectangle(6, 6, 70, 10);
PIXI_UI.AeonTheme.SELECTED_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(6, 6, 52, 10);
PIXI_UI.AeonTheme.HORIZONTAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.Rectangle(5, 2, 42, 6);
PIXI_UI.AeonTheme.HORIZONTAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.Rectangle(1, 2, 2, 11);
PIXI_UI.AeonTheme.HORIZONTAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 10, 11);
PIXI_UI.AeonTheme.VERTICAL_SCROLL_BAR_THUMB_SCALE_9_GRID = new PIXI.Rectangle(2, 5, 6, 42);
PIXI_UI.AeonTheme.VERTICAL_SCROLL_BAR_TRACK_SCALE_9_GRID = new PIXI.Rectangle(2, 1, 11, 2);
PIXI_UI.AeonTheme.VERTICAL_SCROLL_BAR_STEP_BUTTON_SCALE_9_GRID = new PIXI.Rectangle(2, 2, 11, 10);
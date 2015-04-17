/**
 * authors: Björn Friedrichs, Andreas Bresser
 */

PIXI_UI.Slider = function(theme) {
    this.skinName = this.skinName || PIXI_UI.Slider.SKIN_NAME;

    this.minimum = this.minimum || 0;
    this.maximum = this.maximum || 100;
    this.step = this.step || 0; //TODO: implement me!
    this.page = this.page || 10;
    this._value = this.minimum;
    this.valueChanged = null;

    PIXI_UI.Scrollable.call(this, theme);
};

PIXI_UI.Slider.prototype = Object.create( PIXI_UI.Scrollable.prototype );
PIXI_UI.Slider.prototype.constructor = PIXI_UI.Slider;

PIXI_UI.Slider.SKIN_NAME = 'scroll_bar';

/**
 * thumb has been moved - calculate new value
 * @param x x-position to scroll to (ignored when vertical)
 * @param y y-position to scroll to (ignored when horizontal)
 */
PIXI_UI.Slider.prototype.thumbMoved = function(x, y) {
    var max = 1, value = 0;
    if (this.orientation === PIXI_UI.Scrollable.HORIZONTAL) {
        max = this.width - this.thumb.width;
        value = x;
    } else {
        max = this.height - this.thumb.height;
        value = y;
    }
    this.value = value / max * (this.maximum - this.minimum) + this.minimum;
};

/**
 * value changed
 */
Object.defineProperty(PIXI_UI.Slider.prototype, 'value', {
    get: function() {
        return this._value;
    },
    set: function(value) {
        this._value = value;
        if (this.change) {
            var sliderData = new PIXI_UI.SliderData();
            sliderData.value = this._value;
            sliderData.target = this;
            this.change(sliderData);
        }
    }
});
var Scrollable = require('./Scrollable'),
    SliderData = require('../util/SliderData');

/**
 * Simple slider with min. and max. value
 *
 * @class Slider
 * @extends PIXI_UI.Scrollable
 * @memberof PIXI_UI
 * @constructor
 */

function Slider(thumb, theme) {
    this.skinName = this.skinName || Slider.SKIN_NAME;

    this._minimum = this._minimum || 0;
    this._maximum = this._maximum || 100;
    this.step = this.step || 0; //TODO: implement me!
    this.page = this.page || 10;
    this._value = this.minimum;
    this.change = null;

    Scrollable.call(this, thumb, theme);
}

Slider.prototype = Object.create( Scrollable.prototype );
Slider.prototype.constructor = Slider;
module.exports = Slider;


Slider.SKIN_NAME = 'scroll_bar';

/**
 * thumb has been moved - calculate new value
 * @param x x-position to scroll to (ignored when vertical)
 * @param y y-position to scroll to (ignored when horizontal)
 */
Slider.prototype.thumbMoved = function(x, y) {
    var max = 1, value = 0;
    if (this.orientation === Scrollable.HORIZONTAL) {
        max = this.maxWidth();
        if (this._inverse) {
            value = max - x;
        } else {
            value = x;
        }
    } else {
        max = this.maxHeight();
        if (this._inverse) {
            value = max - y;
        } else {
            value = y;
        }
    }
    value = value / max * (this.maximum - this.minimum) + this.minimum;
    this.value = value;
};

/**
 * value changed
 */
Object.defineProperty(Slider.prototype, 'value', {
    get: function() {
        return this._value;
    },
    set: function(value) {
        if (isNaN(value)) {
            return;
        }
        value = Math.min(value, this.maximum);
        value = Math.max(value, this.minimum);
        this._value = value;
        if (this.change) {
            var sliderData = new SliderData();
            sliderData.value = this._value;
            sliderData.target = this;
            this.change(sliderData);
        }
    }
});

/**
 * set minimum and update value if necessary
 */
Object.defineProperty(Slider.prototype, 'minimum', {
    get: function() {
        return this._minimum;
    },
    set: function(minimum) {
        if(!isNaN(minimum) && this.minimum !== minimum && minimum < this.maximum) {
            this._minimum = minimum;
        }
        if (this._value < this.minimum) {
            this.value = this._value;
        }
    }
});

/**
 * set maximum and update value if necessary
 */
Object.defineProperty(Slider.prototype, 'maximum', {
    get: function() {
        return this._maximum;
    },
    set: function(maximum) {
        if(!isNaN(maximum) && this.maximum !== maximum && maximum > this.minimum) {
            this._maximum = maximum;
        }
        if (this._value > this.maximum) {
            this.value = maximum;
        }
    }
});

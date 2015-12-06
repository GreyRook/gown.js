var Scrollable = require('./Scrollable'),
    SliderData = require('../utils/SliderData');

/**
 * Simple slider with min. and max. value
 *
 * @class Slider
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 */

function Slider(thumb, theme) {
    this.skinName = this.skinName || Slider.SKIN_NAME;

    this._minimum = this._minimum || 0;
    this._maximum = this._maximum || 100;
    this.step = this.step || 1; //TODO: implement me!
    this.page = this.page || 10; //TODO: implement me!
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
 *
 * @param x x-position to scroll to (ignored when vertical)
 * @param y y-position to scroll to (ignored when horizontal)
 */
Slider.prototype.thumbMoved = function(x, y) {
    var pos = 0;
    if (this.direction === Scrollable.HORIZONTAL) {
        pos = x;
    } else {
        pos = y;
    }
    this.value = this.locationToValue(pos);
};

/**
 * calculate value of slider based on current pixel position of thumb
 *
 * @param position
 * @method locationToValue
 * @returns Number value between minimum and maximum
 */
Slider.prototype.locationToValue = function(position) {
    var max = 0;
    if (this.direction === Scrollable.HORIZONTAL) {
        max = this.maxWidth();
    } else {
        max = this.maxHeight();
    }
    if (this._inverse) {
        position = max - position;
    }
    return position / max * (this.maximum - this.minimum) + this.minimum;
};

/**
 * calculate current pixel position of thumb based on given value
 *
 * @param value
 * @method valueToLocation
 * @returns Number position of the scroll thumb in pixel
 */
Slider.prototype.valueToLocation = function(value) {
    var max = 0;
    if (this.direction === Scrollable.HORIZONTAL) {
        max = this.maxWidth();
    } else {
        max = this.maxHeight();
    }
    var position = (value - this.minimum) / (this.maximum - this.minimum) * max;
    if (this._inverse) {
        position = max - position;
    }
    return position;
};

/**
 * set value (between minimum and maximum)
 *
 * @property value
 * @type Number
 * @default 0
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
        if (this._value === value) {
            return;
        }

        this.emit('change', value, this);
        // move thumb
        if (this.thumb) {
            var pos = this.valueToLocation(value);
            if (this.direction === Scrollable.HORIZONTAL) {
                this.moveThumb(pos, 0);
            } else {
                this.moveThumb(0, pos);
            }
        }

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
 *
 * @property minimum
 * @type Number
 * @default 0
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
 *
 * @property maximum
 * @type Number
 * @default 100
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

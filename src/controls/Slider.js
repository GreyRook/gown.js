var Scrollable = require('./Scrollable');

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

var Scrollable = require('./Scrollable');

/**
 * Simple slider with min. and max. value
 *
 * @class Slider
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 */

function Slider(thumb, theme, skinName) {
    this.skinName = skinName || Slider.SKIN_NAME;

    this._minimum = this._minimum || 0;
    this._maximum = this._maximum || 100;
    this.step = this.step || 0; //TODO: implement me!
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
    this.value = this.pixelToValue(pos);
};

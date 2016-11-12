var Scrollable = require('./Scrollable');

/**
 * Simple slider with min. and max. value
 *
 * @class Slider
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 */
// TODO: move stuff from Scrollable back here?
function Slider(theme) {
    this._skinName = this._skinName || Slider.SKIN_NAME;

    Scrollable.call(this, theme);
}

Slider.prototype = Object.create( Scrollable.prototype );
Slider.prototype.constructor = Slider;
module.exports = Slider;

Slider.SKIN_NAME = 'scroll_bar';

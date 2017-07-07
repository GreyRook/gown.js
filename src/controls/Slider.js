var Scrollable = require('./Scrollable');

/**
 * Simple slider with min. and max. value
 *
 * @class Slider
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the slider {GOWN.Theme}
 */
// TODO: move stuff from Scrollable back here?
function Slider(theme) {
    /**
     * The skin name
     *
     * @private
     * @type String
     * @default Slider.SKIN_NAME
     */
    this._skinName = this._skinName || Slider.SKIN_NAME;

    Scrollable.call(this, theme);
}

Slider.prototype = Object.create( Scrollable.prototype );
Slider.prototype.constructor = Slider;
module.exports = Slider;

/**
 * Default slider skin name
 *
 * @static
 * @final
 * @type String
 */
Slider.SKIN_NAME = 'scroll_bar';

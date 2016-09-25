/**
 * @file        Main export of the gown.js util library
 * @author      Andreas Bresser <andreasbresser@gmail.com>
 * @copyright   2015 Andreas Bresser
 * @license     {@link https://github.com/brean/gown.js/blob/master/LICENSE|Apache License}
 */

/**
 * @namespace GOWN.util
 */
module.exports = {
    keyboardSupport:        require('./keyboardSupport'),
    mouseWheelSupport:      require('./mouseWheelSupport'),
    position:               require('./position'),
    ScaleContainer:         require('./ScaleContainer'),
    SliderData:             require('./SliderData'),
    Tween:                  require('./Tween'),
    resizeScaling:          require('./resizeScaling'),
    roundToPrecision:       require('./roundToPrecision'),
    roundToNearest:         require('./roundToNearest'),
    roundDownToNearest:     require('./roundDownToNearest'),
    roundUpToNearest:       require('./roundUpToNearest'),
    mixin:                  require('./mixin')
};

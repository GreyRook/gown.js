/**
 * @file        Main export of the gown.js util library
 * @author      Andreas Bresser <andreasbresser@gmail.com>
 * @copyright   2017 Andreas Bresser
 * @license     {@link https://github.com/GreyRook/gown.js/blob/master/LICENSE|Apache License}
 */

/**
 * @namespace GOWN.util
 */
module.exports = {
    DOMInputWrapper:        require('./DOMInputWrapper'),
    InputWrapper:           require('./InputWrapper'),
    KeyboardInputWrapper:   require('./KeyboardInputWrapper'),
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

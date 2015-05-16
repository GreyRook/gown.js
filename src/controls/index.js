/**
 * @file        Main export of the PIXI_UI controls library
 * @author      Andreas Bresser <andreasbresser@gmail.com>, Björn Friedrichs
 * @copyright   2015 Andreas Bresser, Björn Friedrichs
 * @license     {@link https://github.com/brean/pixi_ui/blob/master/LICENSE|Apache License}
 */

/**
 * @namespace PIXI.controls
 */
module.exports = {
    Application:            require('./Application'),
    Button:                 require('./Button'),
    InputControl:           require('./InputControl'),
    LayoutGroup:            require('./LayoutGroup'),
    Scrollable:             require('./Scrollable'),
    ScrollArea:             require('./ScrollArea'),
    ScrollBar:              require('./ScrollBar'),
    ScrollThumb:            require('./ScrollThumb'),
    Slicer:                 require('./Slider'),
    TextInput:              require('./TextInput'),
    ToggleButton:           require('./ToggleButton')
};
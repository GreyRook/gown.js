/**
 * @file        Main export of the gown.js core library
 * @author      Andreas Bresser <andreasbresser@gmail.com>
 * @copyright   2015 Andreas Bresser
 * @license     {@link https://github.com/brean/gown.js/blob/master/LICENSE|Apache License}
 */

/**
 * @namespace GOWN.core
 */
module.exports = {
    Control:        require('./Control'),
    Skinable:       require('./Skinable'),

    // controls
    Application:            require('./controls/Application'),
    Button:                 require('./controls/Button'),
    Check:                  require('./controls/Check'),
    InputControl:           require('./controls/InputControl'),
    LayoutGroup:            require('./controls/LayoutGroup'),
    List:                   require('./controls/List'),
    PickerList:             require('./controls/PickerList'),
    Scrollable:             require('./controls/Scrollable'),
    ScrollBar:              require('./controls/ScrollBar'),
    ScrollContainer:        require('./controls/ScrollContainer'),
    Scroller:               require('./controls/Scroller'),
    ScrollText:             require('./controls/ScrollText'),
    ScrollThumb:            require('./controls/ScrollThumb'),
    Slider:                 require('./controls/Slider'),
    TextInput:              require('./controls/TextInput'),
    ToggleButton:           require('./controls/ToggleButton'),

    // control renderer
    DefaultListItemRenderer:  require('./controls/renderer/DefaultListItemRenderer'),

    // layout
    HorizontalLayout:     require('./layout/HorizontalLayout'),
    Layout:               require('./layout/Layout'),
    LayoutAlignment:      require('./layout/LayoutAlignment'),
    TiledColumnsLayout:   require('./layout/TiledColumnsLayout'),
    TiledLayout:          require('./layout/TiledLayout'),
    TiledRowsLayout:      require('./layout/TiledRowsLayout'),
    VerticalLayout:       require('./layout/VerticalLayout'),
    ViewPortBounds:       require('./layout/ViewPortBounds'),

    // shapes
    Diamond:           require('./shapes/Diamond'),
    Ellipse:           require('./shapes/Ellipse'),
    Line:              require('./shapes/Line'),
    Rect:              require('./shapes/Rect'),
    Shape:             require('./shapes/Shape'),

    // skin
    Theme:           require('./skin/Theme'),
    ThemeFont:       require('./skin/ThemeFont')
};

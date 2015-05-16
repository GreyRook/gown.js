/**
 * @file        Main export of the PIXI_UI layout library
 * @author      Andreas Bresser <andreasbresser@gmail.com>
 * @copyright   2015 Andreas Bresser
 * @license     {@link https://github.com/brean/pixi_ui/blob/master/LICENSE|Apache License}
 */

/**
 * @namespace PIXI.layout
 */
module.exports = {
    HorizontalLayout:     require('./HorizontalLayout'),
    Layout:               require('./Layout'),
    LayoutAlignment:      require('./LayoutAlignment'),
    TiledColumnsLayout:   require('./TiledColumnsLayout'),
    TiledLayout:          require('./TiledLayout'),
    TiledRowsLayout:      require('./TiledRowsLayout'),
    VerticalLayout:       require('./VerticalLayout'),
    ViewPortBounds:       require('./ViewPortBounds')
};
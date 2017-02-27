// full version of gown
// (includes pixi-layout and pixi-shape, so you only need to add pixi.js
//  and gown.js into your html file)
if (typeof PIXI === 'undefined') {
    if (window.console) {
        window.console.warn('pixi.js has to be loaded before loading gown.js');
    }
} else {

    var core = module.exports = require('./core');
    // basic shapes
    core.shapes = {
        Shape:          require('./shapes/Shape'),
        Arrow:          require('./shapes/Arrow'),
        Diamond:        require('./shapes/Diamond'),
        Ellipse:        require('./shapes/Ellipse'),
        Line:           require('./shapes/Line'),
        Rect:           require('./shapes/Rect')
    };

    // layouting
    core.utils = {
            itemDimensions:       require('./layout/utils/itemDimensions')
    };

    core.layout = {
        HorizontalLayout:     require('./layout/HorizontalLayout'),
        Layout:               require('./layout/Layout'),
        LayoutAlignment:      require('./layout/LayoutAlignment'),
        TiledColumnsLayout:   require('./layout/TiledColumnsLayout'),
        TiledLayout:          require('./layout/TiledLayout'),
        TiledRowsLayout:      require('./layout/TiledRowsLayout'),
        VerticalLayout:       require('./layout/VerticalLayout')
    };

    // controls
    core.Application =            require('./controls/Application');
    core.AutoComplete =           require('./controls/AutoComplete');
    core.Button =                 require('./controls/Button');
    core.Check =                  require('./controls/Check');
    core.InputControl =           require('./controls/InputControl');
    core.LayoutGroup =            require('./controls/LayoutGroup');
    core.List =                   require('./controls/List');
    core.PickerList =             require('./controls/PickerList');
    core.Radio =                  require('./controls/Radio');
    core.Scrollable =             require('./controls/Scrollable');
    core.ScrollBar =              require('./controls/ScrollBar');
    core.ScrollContainer =        require('./controls/ScrollContainer');
    core.Scroller =               require('./controls/Scroller');
    core.ScrollText =             require('./controls/ScrollText');
    core.ScrollThumb =            require('./controls/ScrollThumb');
    core.Slider =                 require('./controls/Slider');
    core.TextInput =              require('./controls/TextInput');
    core.TextArea =               require('./controls/TextArea');
    core.ToggleButton =           require('./controls/ToggleButton');
    core.ToggleGroup =            require('./controls/ToggleGroup');

    // data
    core.ListCollection = require('./data/ListCollection');

    // control renderer
    core.DefaultListItemRenderer =  require('./controls/renderers/DefaultListItemRenderer');

    // skin
    core.Theme =           require('./skin/Theme');
    core.ThemeFont =       require('./skin/ThemeFont');
    core.ThemeParser =     require('./skin/ThemeParser');

    // manager
    core.ResizeManager =     require('./interaction/ResizeManager');
    core.KeyboardManager =   require('./interaction/KeyboardManager');

    // add core plugins.
    core.utils = require('./utils');

    // use default pixi loader
    core.loader = PIXI.loader;

    // export GOWN globally.
    global.GOWN = core;
}

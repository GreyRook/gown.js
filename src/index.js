if (typeof PIXI === 'undefined') {
    if (window.console) {
        window.console.warn('pixi.js has to be loaded before loading gown.js');
    }
} else {

    var core = module.exports = require('./core');

    // controls
    core.Application =            require('./controls/Application');
    core.Button =                 require('./controls/Button');
    core.Check =                  require('./controls/Check');
    core.InputControl =           require('./controls/InputControl');
    core.LayoutGroup =            require('./controls/LayoutGroup');
    core.List =                   require('./controls/List');
    core.PickerList =             require('./controls/PickerList');
    core.Scrollable =             require('./controls/Scrollable');
    core.ScrollBar =              require('./controls/ScrollBar');
    core.ScrollContainer =        require('./controls/ScrollContainer');
    core.Scroller =               require('./controls/Scroller');
    core.ScrollText =             require('./controls/ScrollText');
    core.ScrollThumb =            require('./controls/ScrollThumb');
    core.Slider =                 require('./controls/Slider');
    core.TextInput =              require('./controls/TextInput');
    core.ToggleButton =           require('./controls/ToggleButton');

    // data
    core.ListCollection =         require('./data/ListCollection');

    // control renderer
    core.DefaultListItemRenderer =  require('./controls/renderer/DefaultListItemRenderer');

    // layout
    core.HorizontalLayout =     require('./layout/HorizontalLayout');
    core.Layout =               require('./layout/Layout');
    core.LayoutAlignment =      require('./layout/LayoutAlignment');
    core.TiledColumnsLayout =   require('./layout/TiledColumnsLayout');
    core.TiledLayout =          require('./layout/TiledLayout');
    core.TiledRowsLayout =      require('./layout/TiledRowsLayout');
    core.VerticalLayout =       require('./layout/VerticalLayout');
    core.ViewPortBounds =       require('./layout/ViewPortBounds');

    // shapes
    core.Diamond =           require('./shapes/Diamond');
    core.Ellipse =           require('./shapes/Ellipse');
    core.Line =              require('./shapes/Line');
    core.Rect =              require('./shapes/Rect');
    core.Shape =             require('./shapes/Shape');

    // skin
    core.Theme =           require('./skin/Theme');
    core.ThemeFont =       require('./skin/ThemeFont');

    // add core plugins.
    core.utils          = require('./utils');

    // use default pixi loader
    core.loader = PIXI.loader;

    // mixin the deprecation features.
    //Object.assign(core; require('./deprecation'));

    // export GOWN globally.
    global.GOWN = core;
}

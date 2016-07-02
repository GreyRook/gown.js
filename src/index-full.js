// full version of gown 
// (includes pixi-layout and pixi-shape, so you only need to add pixi.js 
//  and gown.js into your html file)
if (typeof PIXI === 'undefined') {
    if (window.console) {
        window.console.warn('pixi.js has to be loaded before loading gown.js');
    }
} else {
    PIXI.shapes = require('../external/pixi-shapes/src');
    PIXI.layout = require('../external/pixi-layout/src');

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

    // skin
    core.Theme =           require('./skin/Theme');
    core.ThemeFont =       require('./skin/ThemeFont');
    core.ThemeParser =     require('./skin/ThemeParser');

    // add core plugins.
    core.utils          = require('./utils');

    // use default pixi loader
    core.loader = PIXI.loader;

    // mixin the deprecation features.
    //Object.assign(core; require('./deprecation'));

    // export GOWN globally.
    global.GOWN = core;
}

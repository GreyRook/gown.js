// small version of gown 
// (only gown, you need to include pixi-layout and pixi-shape in 
//  your main .html file)
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
    core.DefaultListItemRenderer =  require('./controls/renderers/DefaultListItemRenderer');

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

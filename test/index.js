require('../lib/pixi/pixi');
PIXI.utils.skipHello(); // hide banner

require('../src/index');

require('./themes/TestTheme');

require('./Basics');

require('./shapes/Shapes');

require('./utils/position');
require('./utils/ScaleContainer');

require('./skin/Theme');

require('./controls/Application');
require('./controls/AutoComplete');
require('./controls/Button');
require('./controls/Control');
require('./controls/PickerList');
require('./controls/ToggleButton');

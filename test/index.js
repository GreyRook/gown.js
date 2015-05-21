var core = module.exports = require('../src/core');

// include themes
//module.exports.TestTheme = require('./src/TestTheme');

// add core plugins.
core.utils          = require('../src/utils');

// use default pixi loader
core.loader = PIXI.loader;

// mixin the deprecation features.
//Object.assign(core, require('./deprecation'));

// export PIXI_UI globally.
global.PIXI_UI = core;

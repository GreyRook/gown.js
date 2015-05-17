var core = module.exports = require('./core');

// add core plugins.
core.utils          = require('./utils');

// use default pixi loader
core.loader = PIXI.loader;

// mixin the deprecation features.
//Object.assign(core, require('./deprecation'));

// export PIXI_UI globally.
global.PIXI_UI = core;
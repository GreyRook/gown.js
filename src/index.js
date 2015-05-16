var core = module.exports = require('./core');

// add core plugins.
core.controls       = require('./controls');
core.layout         = require('./layout');
core.shapes         = require('./shapes');
core.skin           = require('./skin');
core.util           = require('./util');

// use default pixi loader
core.loader = PIXI.loader;

// mixin the deprecation features.
//Object.assign(core, require('./deprecation'));

// export PIXI_UI globally.
global.PIXI_UI = core;
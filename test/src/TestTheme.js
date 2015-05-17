/**
 * test theme - to test/simulate asset loading for jasmine
 */
PIXI_UI.TestTheme = function(global) {
    PIXI_UI.Theme.call(this, global);
};

PIXI_UI.TestTheme.prototype = Object.create( PIXI_UI.Theme.prototype );
PIXI_UI.TestTheme.prototype.constructor = PIXI_UI.TestTheme;
/**
 * test theme - to test/simulate asset loading for jasmine
 */
GOWN.TestTheme = function(global) {
    GOWN.Theme.call(this, global);
};

GOWN.TestTheme.prototype = Object.create( GOWN.Theme.prototype );
GOWN.TestTheme.prototype.constructor = GOWN.TestTheme;
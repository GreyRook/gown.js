var DropDownTheme = function(jsonPath, onComplete, global) {
    GOWN.AeonTheme.call(this, jsonPath, onComplete, global);
    this.line = {
        lineColor: 0xf1f2f3,
        width: 220,
        height: 2
    };

    this.background = {
        color: 0xFFFFFF
    };
};

DropDownTheme.prototype = Object.create( GOWN.AeonTheme.prototype );
DropDownTheme.prototype.constructor = DropDownTheme;

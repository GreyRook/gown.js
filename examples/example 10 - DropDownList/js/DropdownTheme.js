var DropDownTheme = function(jsonPath, onComplete, global) {
    GOWN.AeonTheme.call(this, jsonPath, onComplete, global);
    this.line = {
        lineColor: 0xEEEEEE,
        width: 220,
        height: 2
    };

    this.textStyle = {
        font:"20px Arial",
        fill : 0x4E5769
    };

    this.labelStyle = {
        font:"15px Arial",
        fill : 0xDDDDDD
    };

    this.labelTextColors = {
        active : '#FF93A7',
        normal : '#DDDDDD'
    }

    this.background = {
        color: 0xFFFFFF
    };
};

DropDownTheme.prototype = Object.create( GOWN.AeonTheme.prototype );
DropDownTheme.prototype.constructor = DropDownTheme;

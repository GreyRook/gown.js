var LoginTheme = function(jsonPath, onComplete, global) {
    GOWN.AeonTheme.call(this, jsonPath, onComplete, global);
    this.textStyle = {
        "fill": "#ffffff",
        "font": "12px Arial"
    };
};


LoginTheme.prototype = Object.create( GOWN.AeonTheme.prototype );
LoginTheme.prototype.constructor = LoginTheme;
var LoginTheme = function(jsonPath, onComplete, global) {
    PIXI_UI.AeonTheme.call(this, jsonPath, onComplete, global);
    this.textStyle = {
        "fill": "#ffffff",
        "font": "12px Arial"
    };
};


LoginTheme.prototype = Object.create( PIXI_UI.AeonTheme.prototype );
LoginTheme.prototype.constructor = LoginTheme;
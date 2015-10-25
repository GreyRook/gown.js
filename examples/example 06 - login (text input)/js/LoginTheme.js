var LoginTheme = function(jsonPath, onComplete, global) {
    GOWN.AeonTheme.call(this, jsonPath, onComplete, global);
    this.textStyle = new GOWN.ThemeFont({
        "fill": "#ffffff",
        "fontSize": 12,
        "fontFamily": "Arial"
    });
};


LoginTheme.prototype = Object.create( GOWN.AeonTheme.prototype );
LoginTheme.prototype.constructor = LoginTheme;

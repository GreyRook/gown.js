var Theme = require('./Theme'),
    Button = require('../controls/Button');

/**
 * load theme from .json file.
 *
 * @class Theme
 * @memberof GOWN
 * @constructor
 */
function ThemeParser(jsonPath, global) {
    Theme.call(this, global);
    
    // components that show something and can be used as skin (see PIXI.shapes)
    this.skinComponents = this.skinComponents || this.getSkinComponents();
    
    this.loadThemeData(jsonPath);
}

ThemeParser.prototype = Object.create( Theme.prototype );
ThemeParser.prototype.constructor = ThemeParser;
module.exports = ThemeParser;

// load theme data
ThemeParser.DATA_LOADED = 'data_loaded';

ThemeParser.prototype.getSkinComponents = function () {
    var cmps = {};
    if (PIXI.shapes) {
        cmps.rect = PIXI.shapes.Rect;
        cmps.diamond = PIXI.shapes.Diamond;
        cmps.ellipse = PIXI.shapes.Ellipse;
        cmps.line = PIXI.shapes.Line;
    }
    return cmps;
};

ThemeParser.components = {};
ThemeParser.components[Button.SKIN_NAME] = Button.stateNames;

ThemeParser.prototype.loadComplete = function(loader, resources) {
    this.setCache(resources);
        
    if (resources) {
        var res = resources[this._jsonPath];
        if (res) {
            this.themeData = res.data;
        }
        
        this.applyTheme();
        Theme.prototype.loadComplete.call(this, loader, resources);
    }
};

ThemeParser.prototype.themeApplyTheme = Theme.prototype.applyTheme;
ThemeParser.prototype.applyTheme = function() {
    if (!this.themeData) {
        return;
    }
    this.parseData(this.themeData);
    this.themeApplyTheme();
};

/**
 * create new skin from theme data
 * @param data {String}
 * @returns {function}
 */
ThemeParser.prototype.skinFromData = function(data) {
    if (data.type in this.skinComponents) {
        // keep component in scope
        var CmpClass = this.skinComponents[data.type];
        return function() {
            var cmp = new CmpClass();
            for (var key in data) {
                if (key === 'type') {
                    continue;
                }
                cmp[key] = data[key];
            }
            return cmp;
        };
    }
};

/**
 * create dictionary containing skin data (including default values) 
 * @param stateName name of current state (e.g. GOWN.Button.UP) {String}
 * @param skinData data gathered from previous runs {String}
 * @param data new data that will be copied into skinData {Object}
 */
ThemeParser.prototype.getSkinData = function(stateName, skinData, data) {
    if (!data) {
        return;
    }
    
    var copyInto = function(source, target) {
        if (!source) {
            return;
        }
        for (var key in source) {
            target[key] = source[key];
        }
    };
    
    // get default skin for all states...
    copyInto(data.all, skinData);
    
    // ... override default values for current state
    copyInto(data[stateName], skinData);
};

ThemeParser.prototype.parseData = function(data) {
    this.hoverSkin = data.hoverSkin;
    this.thumbSkin = data.thumbSkin;
    
    if (data.textStyle) {
        this.textStyle.fill = data.textStyle.fill;
        this.textStyle.fontFamily = data.textStyle.fontFamily;
    }
    if (!data.skins) {
        return;
    }
    
    for (var componentName in ThemeParser.components) {
        // create skin for componentName (e.g. button) from data
        
        var states = ThemeParser.components[componentName];
        //var skins = data.skins[componentName];
        for (var i = 0; i < states.length; i++) {
            var stateName = states[i];
            var skinData = {};
            // set defaults
            this.getSkinData(stateName, skinData, data.skins.default);
            
            // override defaults with component data
            if (componentName in data.skins) {
                this.getSkinData(stateName, skinData, data.skins[componentName]);
            }
            
            // create skin from skinData for current skin
            this.setSkin(componentName, stateName, this.skinFromData(skinData));
        }
    }
};

ThemeParser.prototype.loadThemeData = function(jsonPath) {
    this.loadImage(jsonPath);
};

var Skinable = require('../Skinable');

/**
 * The basic DropDownList
 *
 * @class DropDownList
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 */
function DropDownList(elementList ,theme, skinName) {
    this.skinName = skinName || DropDownList.SKIN_NAME;
    Skinable.call(this, theme);

    this.elementList = elementList;

    this.showDropDown = true;

    this.runUpdateDimensions = true;

    this.updateLabel = false; // label text changed

    this.updateElementList = true; // list changed

}
DropDownList.prototype = Object.create( Skinable.prototype );
DropDownList.prototype.constructor = DropDownList;
module.exports = DropDownList;

// name of skin that will be applied
DropDownList.SKIN_NAME = 'dropDownList';

// performance increase to avoid using call.. (10x faster)
DropDownList.prototype.redrawSkinable = Skinable.prototype.redraw;

DropDownList.prototype.skinableSetTheme = Skinable.prototype.setTheme;

DropDownList.prototype.updateDimensions = function() {
    //var width = this.worldWidth;
    var height = this.worldHeight;
    // if (this.hitArea) {
    //     this.hitArea.width = width;
    //     this.hitArea.height = height;
    // } else {
    //     this.hitArea = new PIXI.Rectangle(0, 0, width, height);
    // }
    //
    // var name = 'dropDownListSkin'; //TODO ???
    // var skin = this.skinCache[name];
    // if (skin) {
    //     skin.width = width;
    //     skin.height = height;
    // }

    if(this.labelText) {
        var scaleY = height / this._height;
        this.labelText.style.fontSize = this.theme.textStyle.fontSize * scaleY;
        this.labelText.style = this.labelText.style; // trigger setter
        this.updateLabelDimensions();
    }
    this.runUpdateDimensions = false;
};

DropDownList.prototype.updateLabelDimensions = function () { //todo
    // if (this.labelText && this.labelText.text &&
    //     (this.worldWidth - this.labelText.width) >= 0 &&
    //     (this.worldHeight - this.labelText.height) >= 0) {
    //     // this.labelText.x = Math.floor((this.worldWidth - this.labelText.width) / 2);
    //     // this.labelText.y = Math.floor((this.worldHeight - this.labelText.height) / 2);
    //     this.labelText.x = 60;
    //     this.labelText.y = 5;
    // }
};

DropDownList.prototype.redraw = function() {
    if(this.runUpdateDimensions){
        this.updateDimensions();
    }
    if(this.updateElementList){
        this.createDropDown();
    }
    if (this.updateLabel) {
        this.createLabel();
    }
    this.redrawSkinable();
};

/**
 * create/update a label for this button //todo
 *
 * @method createLabel
 */
DropDownList.prototype.createLabel = function() {
    var wrapper = new PIXI.Graphics();
    wrapper.beginFill(0xff7f08);
    wrapper.drawRect(20, 0, 420, 40);
    wrapper.x = 15;
    wrapper.y = 0;
    wrapper.endFill();

    if(this.labelText) {
        this.labelText.text = this._label;
        this.labelText.style = this.theme.textStyle.clone();
    } else {
        //this.labelText = new PIXI.Text(this._label, this.theme.textStyle.clone());
        this.labelText = new PIXI.Text(this._label, {fontFamily : 'Arial', fontSize: 12, fill : 0xffffff, align : 'center'});
        this.labelText.interactive = true;
        this.labelText.click = this.toggleDropDown.bind(this);
        this.labelText.x = 60;
        this.labelText.y = 5;
        wrapper.addChild(this.labelText);

        this.addChild(wrapper);
    }
    this.updateLabelDimensions();
    this.updateLabel = false;
};

/**
 * create/update DropDownList
 *
 * @method createDropDown
 */

DropDownList.prototype.createDropDown = function () { //TODO
    if(this.elementList) {
        if(this.showDropDown){
            var wrapper = new PIXI.Graphics();
            wrapper.beginFill(0x574f46);
            wrapper.drawRect(20, 20, 420, 220);
            wrapper.x = 15;
            wrapper.y = 25;
            wrapper.endFill();

            var container = new PIXI.Graphics();
            container.beginFill(0x383430);
            container.drawRect(10, 10, 400, 200);
            container.x = 20;
            container.y = 20;
            container.endFill();

            this.elementList.forEach(function (el, i) {
                var labelText = new PIXI.Text(el.text,{fontFamily : 'Arial', fontSize: 18, fill : 0xe4e4e4, align : 'center'}); // use own styles
                labelText.x = 40;
                labelText.y = 20 + 30 * i;
                labelText.interactive = true;
                labelText.click = this.selectDropDownElement.bind(this, labelText._text);

                var line = new PIXI.Graphics();
                line.beginFill(0x24211e);
                line.drawRect(10, 50 + 30 * i, 400, 2);
                line.endFill();

                container.addChild(labelText);
                container.addChild(line);
            }.bind(this));
            wrapper.addChild(container);
            this.addChild(wrapper);
        }
    }
    this.updateLabelDimensions();
    this.updateElementList = false;
};

/**
 * show/hide DropDown
 */
DropDownList.prototype.toggleDropDown = function () {
    this.showDropDown = !this.showDropDown;
    this.cleanChilds();
    this.updateElementList = true;
    this.updateLabel = true;
};


/**
 * remove DropDown childs
 */
DropDownList.prototype.cleanChilds = function () {
    while(this.children.length > 0){
        var child = this.getChildAt(0);
        this.removeChild(child);
    }
    this.labelText = null;
};

/**
 * select DropDown element
 */
DropDownList.prototype.selectDropDownElement = function (text) {
    this.toggleDropDown();
    this.label = text;
};



/**
 * Create/Update the label of the dropDownList.
 *
 * @property label
 * @type String
 */
Object.defineProperty(DropDownList.prototype, 'label', {
    get: function() {
        return this._label;
    },
    set: function(label) {
        if(this._label === label) {
            return;
        }
        this._label = label;
        this.updateLabel = true;
    }
});


/**
 * Create/Update the elementList of the dropDownList. //todo
 *
 * @property elementList
 * @type Array
 */
Object.defineProperty(DropDownList.prototype, 'elementList', {
    get: function() {
        return this._elementList;
    },
    set: function(elementList) {
        if(this._elementList === elementList) {
            return;
        }
        this._elementList = elementList;
        this.updateElementList = true;
    }
});

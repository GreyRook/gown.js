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

    this.selectedValue = null;
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
    //var height = this.worldHeight;
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
       // var scaleY = height / this._height;
       // this.labelText.style.fontSize = this.theme.textStyle.fontSize * scaleY;
        //this.labelText.style = this.labelText.style; // trigger setter
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

/**
 * update before draw call
 *
 * @method redraw
 */
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
 * create/update a label for this dropDown
 *
 * @method createLabel
 */
DropDownList.prototype.createLabel = function() {//todo refactoring
    var wrapper = new PIXI.Graphics();
    wrapper.beginFill(0xff7f08);
    wrapper.lineStyle(2, 0x000000, 1);
    wrapper.drawRoundedRect(110, 0, 250, 40, 4);
    wrapper.x = 0;
    wrapper.y = 0;
    wrapper.endFill();
    wrapper.interactive = true;
    wrapper.click = this.toggleDropDown.bind(this);

    if(this.labelText) {
        this.labelText.text = this._label;
        this.labelText.style = {fontFamily : 'Arial', fontSize: 12, fill : 0x000000, align : 'center'};
    } else {
        this.labelText = new PIXI.Text(this._label, {fontFamily : 'Arial', fontSize: 12, fill : 0x000000, align : 'center'});
        this.labelText.x = 145;
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

DropDownList.prototype.createDropDown = function () { //TODO refactoring add constans
    if(this.elementList) {
        if(this.showDropDown){
            var wrapper = new PIXI.Graphics();
            wrapper.beginFill(0x574f46);
            wrapper.lineStyle(2, 0x000000, 1);
            wrapper.x = 15;
            wrapper.y = 55;
            wrapper.moveTo(0,0);
            wrapper.lineTo(0, 250);
            wrapper.lineTo(450, 250);
            wrapper.lineTo(450, 0);
            wrapper.lineTo(235, 0);
            wrapper.lineTo(225, -15);
            wrapper.lineTo(215, 0);
            wrapper.lineTo(0, 0);
            wrapper.endFill();




            var dropDownContainer = new PIXI.Graphics();
            dropDownContainer.beginFill(0x383430);
            dropDownContainer.drawRect(10, 15, 420, 220);
            dropDownContainer.x = 0;
            dropDownContainer.y = 0;
            dropDownContainer.endFill();

            var grp = new GOWN.LayoutGroup();
            grp.y = 15;
            grp.x = 5;
            var inner = new GOWN.LayoutGroup();
            inner.layout = new GOWN.VerticalLayout();
            inner.layout.gap = 15;

            this.elementList.forEach(function (el) {
                var container = new PIXI.Container();
                var line = new PIXI.Graphics();
                line.beginFill(0x000000);
                line.drawRect(5, 0, 410, 2);
                line.x = 5;
                line.y = 65;
                line.endFill();

                var labelText = new PIXI.Text(el.text, {fontFamily : 'Arial', fontSize: 18, fill : 0xe4e4e4, align : 'center'}); // use own styles
                labelText.x = 40;
                labelText.y = 14;
                container.hitArea = new PIXI.Rectangle(0, 0, 410, 73);

                container.interactive = true;
                container.click = this.selectDropDownElement.bind(this, labelText._text);

                if(this.selectedValue && this.selectedValue === labelText._text){
                    var circle = new PIXI.Graphics();
                    circle.lineStyle(0);
                    circle.beginFill(0xff7f08);
                    circle.drawCircle(370, 31,10);
                    circle.endFill();
                    container.addChild(circle);
                }

                container.addChild(labelText);
                container.addChild(line);

                inner.addChild(container);
            }.bind(this));

            var innerScroll = new GOWN.ScrollArea(inner);
            innerScroll.width = dropDownContainer.width;
            innerScroll.height = dropDownContainer.height;
            grp.addChild(innerScroll);


            var sb = new GOWN.ScrollBar(innerScroll);
            grp.addChild(sb);
            sb.x = innerScroll.width;
            sb.height = innerScroll.height;

            dropDownContainer.addChild(grp);
            wrapper.addChild(dropDownContainer);

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
    this.selectedValue = text;
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
 * Create/Update the elementList of the dropDownList.
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

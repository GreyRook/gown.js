var Skinable = require('../Skinable');

/**
 * The basic DropDownList
 *
 * @class DropDownList
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 */
function DropDownList(theme) {
    this.skinName = DropDownList.SKIN_NAME;
    Skinable.call(this, theme);

    this.showDropDown = false;

    this.events = [];

    this.runUpdateDimensions = true;

    this.updateLabel = false; // label text changed

    this.updateDropDown = true; // list changed

    this.currentState = DropDownList.NORMAL;

    this.hoveredElementIndex = null;

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
    this.runUpdateDimensions = false;
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
    if(this.updateDropDown){
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
    wrapper.drawRoundedRect(0, 0, 250, 55, 4);
    wrapper.x = 5;
    wrapper.y = 5;
    wrapper.interactive = true;
    wrapper.click = this.toggleDropDown.bind(this);
    wrapper.hitArea = new PIXI.Rectangle(0, 15, 250, 35);
    wrapper.interactive = true;
    wrapper.buttonMode = true;
    wrapper.defaultCursor = 'pointer';

    this.labelText = new PIXI.Text('Label', this.theme.textStyle.clone());
    this.labelText.y = 0;
    this.labelText.x = 0;
    if(this.showDropDown){
        this.labelText.style.fill = '#FF0000';
    }

    var mark = new PIXI.Text('^', this.theme.textStyle.clone());
    mark.x = 220;
    mark.y = 30;

    var line = new PIXI.Graphics();
    line.beginFill(0xf1f2f3);
    line.drawRect(0, 0, 230, 2);
    line.x = 0;
    line.y = 45;
    line.endFill();


    wrapper.addChild(this.labelText);
    wrapper.addChild(mark);
    wrapper.addChild(line);



    this.selectedItemText = new PIXI.Text(this._label, this.theme.textStyle.clone());
    this.selectedItemText.x = 0;
    this.selectedItemText.y = 25;

    wrapper.addChild(this.selectedItemText);

    this.addChild(wrapper);

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
            wrapper.beginFill(0xFFFFFF);
            wrapper.lineStyle(6, 0x000000, 0.3);
            wrapper.y = 20;
            wrapper.moveTo(0,0);
            wrapper.lineTo(0, 230);
            wrapper.lineTo(240, 230);
            wrapper.lineTo(240, 0);
            wrapper.lineTo(0, 0);
            wrapper.endFill();


            var grp = new GOWN.LayoutGroup();
            var inner = new GOWN.LayoutGroup();
            inner.layout = new GOWN.VerticalLayout();
            inner.y = 40;
            inner.layout.gap = 60;

            this.elementList.forEach(function (el, i) {
                var container = new PIXI.Container();

                if(this.currentState === DropDownList.HOVER_CONTAINER){
                    if(typeof this.hoveredElementIndex === 'number' && this.hoveredElementIndex === i){
                        var background = new PIXI.Graphics();
                        background.beginFill(0xD3D3D3);
                        background.drawRect(4, 0, 232, 40);
                        background.endFill();
                        container.addChild(background);
                    }
                }

                var itemText = new PIXI.Text(el.text, this.theme.textStyle.clone()); // use own styles
                itemText.x = 5;
                itemText.y = 14;
                container.hitArea = new PIXI.Rectangle(4, 0, 232, 40);

                container.interactive = true;
                container.click = this.selectDropDownElement.bind(this, itemText._text);
                container.mouseover = function() {
                    this.handleEvent(DropDownList.HOVER_CONTAINER, i);
                }.bind(this);

                container.mouseout = function() {
                    this.handleEvent(DropDownList.NORMAL);
                }.bind(this);


                container.addChild(itemText);
                inner.addChild(container);
            }.bind(this));


            grp.addChild(inner);

            wrapper.addChild(grp);

            this.addChild(wrapper);
        }
    }
    this.updateDropDown = false;
};


/**
 * Hover state: mouse pointer hovers over the VariantContainer
 * (ignored on mobile)
 *
 * @property HOVER
 * @static
 * @final
 * @type String
 */
DropDownList.HOVER_CONTAINER = 'hover_container';

/**
 * Hover state: initial state
 * (ignored on mobile)
 *
 * @property NORMAL
 * @static
 * @final
 * @type String
 */
DropDownList.NORMAL = 'normal';



/**
 * names of possible states for a button
 *
 * @property stateNames
 * @static
 * @final
 * @type String
 */
DropDownList.stateNames = [
    DropDownList.HOVER_CONTAINER,DropDownList.NORMAL
];
/**
 * handleEvent
 */
DropDownList.prototype.handleEvent = function(type, option) {
    this.handelSubscribedCallouts(type);

    if(type === DropDownList.HOVER_CONTAINER){
        if(typeof option === 'number'){
            this.currentState = DropDownList.HOVER_CONTAINER;
            this.hoveredElementIndex = option;
            this.cleanChilds();
            this.updateDropDown = true;
            this.updateLabel = true;
        }
    }
    if(type === DropDownList.NORMAL){
        this.currentState = DropDownList.NORMAL;
        this.hoveredElementIndex = null;
        this.cleanChilds();
        this.updateDropDown = true;
        this.updateLabel = true;
    }
};

/**
 * show/hide DropDown
 */
DropDownList.prototype.toggleDropDown = function () {
    this.showDropDown = !this.showDropDown;
    this.cleanChilds();
    this.updateDropDown = true;
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
    this.selectedItemText = null;
};

/**
 * select DropDown element
 */
DropDownList.prototype.selectDropDownElement = function (text) {
    this.toggleDropDown();
    this.label = text;

    this.handelSubscribedCallouts(Event.CHANGE, text);
};

/**
 * DropDown addEventListener
 */
DropDownList.prototype.addEventListener = function (event, callback) {
    this.events.push({event : event, callback: callback});
};

/**
 * DropDown handelSubscribedCallouts
 */
DropDownList.prototype.handelSubscribedCallouts = function (eventName,text) {
    this.events.forEach(function (event) {
        if(event.event === eventName){
            event.callback(text);
        }
    });
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
        this.label = this._elementList[0].text;
        this.updateDropDown = true;
    }
});

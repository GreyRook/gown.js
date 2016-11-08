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

    this.updateLabel = false; // label text changed

    this.updateDropDown = true; // list changed

    this.currentState = DropDownList.NORMAL;

    this.hoveredElementIndex = null;

    this.initiated = false;

}

DropDownList.prototype = Object.create( Skinable.prototype );
DropDownList.prototype.constructor = DropDownList;
module.exports = DropDownList;

// name of skin that will be applied
DropDownList.SKIN_NAME = 'dropDownList';

// performance increase to avoid using call.. (10x faster)
DropDownList.prototype.redrawSkinable = Skinable.prototype.redraw;

DropDownList.prototype.skinableSetTheme = Skinable.prototype.setTheme;



/**
 * update before draw call
 *
 * @method redraw
 */
DropDownList.prototype.redraw = function() {
    if(!this.initiated){
        this.initiate();
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

    this.labelText = new PIXI.Text('Label', this.theme.labelStyle ? this.theme.labelStyle.clone() : {font:'15px Arial', fill : 0xDDDDDD});
    this.labelText.y = 0;
    this.labelText.x = 0;

    if(this.showDropDown){
        this.labelText.style.fill = this.theme.labelTextColors ? this.theme.labelTextColors.active : '#FF93A7';
    }else{
        this.labelText.style.fill = this.theme.labelTextColors ? this.theme.labelTextColors.normal : '#DDDDDD';
    }

    var mark = new PIXI.Graphics();
    mark.beginFill(0x000000);
    mark.lineStyle(3, 0x000000);
    mark.moveTo(0,0);
    mark.lineTo(3,0);
    mark.lineTo(1.5,1.5);
    mark.lineTo(0,0);
    mark.endFill();
    mark.x = 215;
    mark.y = 30;

    var line = new PIXI.Graphics();
    line.beginFill( this.theme.line  ? this.theme.line.lineColor : 0xf1f2f3);
    line.drawRect(0, 0, this.theme.line  ? this.theme.line.width : 222, this.theme.line  ? this.theme.line.height : 2);
    line.x = 2;
    line.y = 60;
    line.endFill();


    wrapper.addChild(this.labelText);
    wrapper.addChild(mark);
    wrapper.addChild(line);

    this.selectedItemText = new PIXI.Text(this._label, this.theme.textStyle ? this.theme.textStyle.clone() : {font:'20px Arial', fill : 0x4E5769});
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
            wrapper.beginFill(this.theme.background ? this.theme.background.color : 0xFFFFFF);
            wrapper.y = 20;
            wrapper.moveTo(0,0);
            wrapper.lineTo(0, 43 + this.elementList.length * 40 );
            wrapper.lineTo(240, 43 + this.elementList.length * 40 );
            wrapper.lineTo(240, 0);
            wrapper.lineTo(0, 0);
            wrapper.endFill();

            var border = this.theme.getImage('text-input-background-disabled-skin');
            border = border();
            border.x = -1;
            border.y = 0;

            border.scale.x= 1.57;
            border.scale.y= 2.45 * (this.elementList.length - 0.2);


            var inner = new PIXI.Container();
            inner.y = 40;

            this.elementList.forEach(function (el, i) {

                var itemText = new PIXI.Text(el.text, this.theme.textStyle ? this.theme.textStyle.clone() : {font:'20px Arial', fill : 0x4E5769}); // use own styles


                if(typeof this.hoveredElementIndex === 'number' && this.hoveredElementIndex === i){
                    var background = new PIXI.Graphics();
                    background.beginFill(0xEEEEEE);
                    background.drawRect(0, 5 + i * 40 , 237, 40);
                    background.endFill();

                    itemText.x = 5;
                    itemText.y = 10 + i * 40;


                    background.interactive = true;
                    background.click = this.selectDropDownElement.bind(this, itemText._text);
                    background.on('mouseenter' ,function() {
                        this.handleEvent(DropDownList.HOVER_CONTAINER, i);
                    }.bind(this));

                    background.on('mouseout',function() {
                        this.handleEvent(DropDownList.NORMAL);
                    }.bind(this));

                    background.addChild(itemText);
                    inner.addChild(background);
                }
                else{
                    var container = new PIXI.Container();

                    itemText.x = 5;
                    itemText.y = 10 + i * 40;

                    container.hitArea = new PIXI.Rectangle(0, 5 + i * 40, 240, 40);

                    container.interactive = true;
                    container.click = this.selectDropDownElement.bind(this, itemText._text);
                    container.mouseover = function() { //TODO add throttle. cant use mouseenter
                        this.handleEvent(DropDownList.HOVER_CONTAINER, i);
                    }.bind(this);

                    container.mouseout = function() {
                        this.handleEvent(DropDownList.NORMAL);
                    }.bind(this);


                    container.addChild(itemText);
                    inner.addChild(container);
                }
            }.bind(this));


            wrapper.addChild(border);
            wrapper.addChild(inner);

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
 * State: initial state
 * (ignored on mobile)
 *
 * @property NORMAL
 * @static
 * @final
 * @type String
 */
DropDownList.NORMAL = 'normal';

/**
 * State: clicked state
 *
 * @property NORMAL
 * @static
 * @final
 * @type String
 */
DropDownList.CLICKED = 'clicked';


/**
 * names of possible states for a dropddown
 *
 * @property stateNames
 * @static
 * @final
 * @type String
 */
DropDownList.stateNames = [
    DropDownList.HOVER_CONTAINER,DropDownList.NORMAL,DropDownList.CLICKED
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
 * override events handlers
 */
DropDownList.prototype.mousedown = function(event) {
    event.originalTarget = 'DropDown';      //Workaround trigger of stage event on dropdown click
    this.handleEvent(DropDownList.CLICKED);
};

/**
 * override events handlers
 */
DropDownList.prototype.touchstart = function(event) {
    event.originalTarget = 'DropDown';      //Workaround trigger of stage event on dropdown click
    this.handleEvent(DropDownList.CLICKED);
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
 * initiate DropDown
 * add event on stage that close dropDown on click
 */
DropDownList.prototype.initiate = function () {
    if(this.parent){
        this.parent.interactive = true;
        var stage = this.getStage(this);
        var self = this;
        stage.interactive = true;

        stage.on('mousedown', function (e) {
            if(e.target !== self && e.originalTarget !== 'DropDown'){
                if(self.showDropDown){
                    self.toggleDropDown();
                }
            }
            e.originalTarget = undefined; //Workaround trigger of stage event on dropdown click
        });

        stage.on('touchstart', function (e) {
            if(e.target !== self && e.originalTarget !== 'DropDown'){
                if(self.showDropDown){
                    self.toggleDropDown();
                }
            }
            e.originalTarget = undefined;
        });
    }

    this.initiated = true;
};

/**
 * find stage where dropDown placed
 */
DropDownList.prototype.getStage = function (element) {
    if(element.parent && element.parent.children.length > 0){
      return this.getStage(element.parent);
    }else{
        return element;
    }
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

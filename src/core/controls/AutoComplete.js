var Skinable = require('../Skinable'),
    DropDownList = require('./DropDownList'),
    TextInput = require('./TextInput');
TextInput = require('./DropDownList');

/**
 * The basic AutoComplete. Needed for input with suggestions
 *
 * @class DropDownList
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 */
function AutoComplete(text, theme) {
    this.skinName = AutoComplete.SKIN_NAME;
    this.theme = theme;
    Skinable.call(this, this.theme);
    this.showDropDown = false;
    this.label = text || '';
    this.events = [];
    this.updateLabel = false; // label text changed
    this.updateDropDown = true; // list changed
    this._autoCompleteDelay = 0.5;
    this._minimumAutoCompleteLength = 2;
    this._limitTo = 5;
    this.currentState = AutoComplete.NORMAL;
    this.hoveredElementIndex = null;
    this.initiated = false;
}

AutoComplete.prototype = Object.create( DropDownList.prototype );
AutoComplete.prototype.constructor = AutoComplete;
module.exports = AutoComplete;

// name of skin that will be applied
AutoComplete.SKIN_NAME = 'autoComplete';

// performance increase to avoid using call.. (10x faster)
AutoComplete.prototype.redrawSkinable = Skinable.prototype.redraw;

AutoComplete.prototype.skinableSetTheme = Skinable.prototype.setTheme;

/**
 * create/update a label for this dropDown
 *
 * @method createLabel
 */
AutoComplete.prototype.createLabel = function() {//todo refactoring
    var wrapper = new TextInput(this.label, false, this.theme);
    wrapper.x = 5;
    wrapper.y = 5;
    wrapper.width = 260;
    wrapper.height = 4;
    wrapper.click = this.toggleDropDown.bind(this);
    wrapper.hitArea = new PIXI.Rectangle(0, 15, 260, 47);
    wrapper.interactive = true;
    wrapper.buttonMode = true;
    wrapper.text = this.label;

    this.addChild(wrapper);

    this.updateLabel = false;
};

/**
 * create/update AutoComplete
 *
 * @method createDropDown
 */
AutoComplete.prototype.createDropDown = function () { //TODO refactoring add constans
    if(this.elementList) {
        if(this.showDropDown){
            var wrapper = new PIXI.Graphics();
            wrapper.beginFill(this.theme.background ? this.theme.background.color : 0xFFFFFF);
            wrapper.y = 20;
            wrapper.moveTo(0,0);
            wrapper.lineTo(0, 43 + this.elementList.length * 40 );
            wrapper.lineTo(260, 43 + this.elementList.length * 40 );
            wrapper.lineTo(260, 0);
            wrapper.lineTo(0, 0);
            wrapper.endFill();

            var border = this.theme.getImage('text-input-background-disabled-skin');
            border = border();
            border.x = -1;
            border.y = 0;

            border.scale.x= 1.7;
            border.scale.y= 1.9 + 1.9 * (this.elementList.length);


            var inner = new PIXI.Container();
            inner.y = 35;

            var results = [];
            var text = this.text;

            if (this.text.length >= this.minAutoCompleteLength) {
                results = this.elementList.filter(function (element) {
                    return element.text.indexOf(text) >= 0;
                });
            }

            if (this.limitTo) {
                results = results.slice(0, this.limitTo);
            }

            results.forEach(function (el, i) {

                var itemText = new PIXI.Text(el.text, this.theme.textStyle ? this.theme.textStyle.clone() : {font:'20px Arial', fill : 0x4E5769}); // use own styles

                if(typeof this.hoveredElementIndex === 'number' && this.hoveredElementIndex === i){
                    var background = new PIXI.Graphics();
                    background.beginFill(0xEEEEEE);
                    background.drawRect(0, 5 + i * 40 , 257, 40);
                    background.endFill();

                    itemText.x = 5;
                    itemText.y = 10 + i * 40;

                    background.interactive = true;
                    background.click = this.selectDropDownElement.bind(this, itemText._text);
                    background.on('mouseenter' ,function() {
                        this.handleEvent(AutoComplete.HOVER_CONTAINER, i);
                    }.bind(this));

                    background.on('mouseout',function() {
                        this.handleEvent(AutoComplete.NORMAL);
                    }.bind(this));

                    background.addChild(itemText);
                    inner.addChild(background);
                } else {
                    var container = new PIXI.Container();

                    itemText.x = 5;
                    itemText.y = 10 + i * 40;

                    container.hitArea = new PIXI.Rectangle(0, 5 + i * 40, 260, 40);

                    container.interactive = true;
                    container.click = this.selectDropDownElement.bind(this, itemText._text);
                    container.mouseover = function() { //TODO add throttle. cant use mouseenter
                        this.handleEvent(AutoComplete.HOVER_CONTAINER, i);
                    }.bind(this);

                    container.mouseout = function() {
                        this.handleEvent(AutoComplete.NORMAL);
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
 * The time, in seconds, after the text has changed before
 * requesting suggestions from the AutoCompleteList.
 *
 * @property autoCompleteDelay
 * @type Number
 */
Object.defineProperty(AutoComplete.prototype, 'autoCompleteDelay', {
    get: function () {
        return this._autoCompleteDelay;
    },
    set: function (autoCompleteDelay) {
        if (this._autoCompleteDelay === autoCompleteDelay) {
            return;
        }
        this._autoCompleteDelay = autoCompleteDelay;
    }
});

/**
 * The minimum number of entered characters required to request
 * suggestions from the AutoCompleteList.
 *
 * @property minAutoCompleteLength
 * @type Number
 */
Object.defineProperty(AutoComplete.prototype, 'minAutoCompleteLength', {
    get: function () {
        return this._minAutoCompleteLength;
    },
    set: function (minAutoCompleteLength) {
        if (this._minAutoCompleteLength === minAutoCompleteLength) {
            return;
        }
        this._minAutoCompleteLength = minAutoCompleteLength;
    }
});

/**
 * The maximum number of suggestions that show at one time from the AutoCompleteList.
 * If 0, all suggestions will be shown.
 *
 * @property limitTo
 * @type Number
 */
Object.defineProperty(AutoComplete.prototype, 'limitTo', {
    get: function () {
        return this._limitTo;
    },
    set: function (limitTo) {
        if (this._limitTo === limitTo) {
            return;
        }
        this._limitTo = limitTo;
    }
});

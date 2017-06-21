var InputControl = require('./InputControl'),
    TextInput = require('./TextInput');

/**
 * The basic AutoComplete. Needed for input with suggestions
 *
 * @class AutoComplete
 * @extends GOWN.TextInput
 * @memberof GOWN
 * @constructor
 * @param text Default display text {String}
 * @param [theme] theme for auto complete {GOWN.Theme}
 * @param [skinName=AutoComplete.SKIN_NAME] name of the auto complete skin {String}
 */
function AutoComplete(text, theme, skinName) {
    this.skinName = skinName || AutoComplete.SKIN_NAME;

    /**
     * The valid auto complete states
     *
     * @private
     * @type String[]
     * @default AutoComplete.stateNames
     */
    this._validStates = this._validStates || AutoComplete.stateNames;

    /**
     * Display the text as an password field
     *
     * @private
     * @type bool
     * @default false
     */
    this._displayAsPassword = false;

    /**
     * Result elements (source elements filtered by the text attribute)
     *
     * @private
     * @type String[]
     * @default []
     */
    this.results = [];

    /**
     * Source elements from which the auto complete filters the elements corresponding to the current text
     *
     * @private
     * @type String[]
     * @default []
     */
    this.source = [];

    /**
     * Hovered element text
     *
     * @type String
     * @default null
     * @private
     */
    this.hoveredElementText = null;

    TextInput.call(this, theme, skinName);

    /**
     * The displayed text
     *
     * @type String
     */
    this.text = text;

    /**
     * The minimum number of entered characters required to request
     * suggestions from the AutoCompleteList.
     *
     * @private
     * @type Number
     * @default 2
     */
    this._minAutoCompleteLength = 2;

    /**
     * The maximum number of suggestions that show at one time from the AutoCompleteList.
     * If 0, all suggestions will be shown.
     *
     * @private
     * @type Number
     * @default 5
     */
    this._limitTo = 5;
}

AutoComplete.prototype = Object.create(TextInput.prototype);
AutoComplete.prototype.constructor = AutoComplete;
module.exports = AutoComplete;

/**
 * Hover state
 *
 * @static
 * @final
 * @type String
 */
AutoComplete.HOVER_CONTAINER = 'hoverContainer';

/**
 * Click state
 *
 * @static
 * @final
 * @type String
 */
AutoComplete.CLICKED = 'clicked';

/**
 * Names of possible states for an auto complete element
 *
 * @static
 * @final
 * @type String[]
 * @private
 */
AutoComplete.stateNames = InputControl.stateNames.concat([
    AutoComplete.HOVER_CONTAINER, AutoComplete.CLICKED
]);

/**
 * Create a new suggestion item
 *
 * @param text Text of the suggestion item {String}
 * @param width Width of the suggestion item {Number}
 * @param height Height of the suggestion item {Number}
 * @returns {PIXI.Container}
 * @private
 */
AutoComplete.prototype.createSuggestionItem = function (text, width, height) {
    var itemText = new PIXI.Text(text, this.theme.textStyle ? this.theme.textStyle.clone() : {
            font: '20px Arial',
            fill: 0x4E5769
        }); // use own styles
    var container = new PIXI.Container();
    if (this.hoveredElementText && this.hoveredElementText === itemText.text) {
        var background = new PIXI.Graphics()
            .beginFill(this.theme.hover ? this.theme.hover.color : 0xDDDDDD)
            .drawRect(0, 0, width, height)
            .endFill();
        container.addChild(background);
    }

    itemText.x = this.textOffset.x;
    itemText.y = this.textOffset.y;

    container.hitArea = new PIXI.Rectangle(0, 0, width, height);

    container.interactive = true;
    container.click = this.selectResultElement.bind(this, itemText.text);
    container.tap = this.selectResultElement.bind(this, itemText.text);
    container.mouseover = this.hoverResultElement.bind(this, itemText.text);
    container.mouseout = this.removeHoverResultElement.bind(this);

    container.addChild(itemText);

    return container;
};

/**
 * Draw the results
 *
 * @param text Text to filter the source elements {String}
 */
AutoComplete.prototype.drawResults = function (text) {
    if (text.length < this._minAutoCompleteLength) {
        this.results = [];
    } else {
        var lowerCaseText = text.toString().toLowerCase();
        var results = this.source.filter(function (el) {
            var elementText = el.text.toString().toLowerCase();
            return elementText.indexOf(lowerCaseText) >= 0;
        });
        if (results.length === 1 && results[0].text.toString() === text.toString()) {
            results = [];
        }
        if (this.limitTo) {
            results = results.slice(0, this.limitTo);
        }
        this.results = results;
    }

    var wrapper = new PIXI.Graphics();
    wrapper.beginFill(this.theme.background ? this.theme.background.color : 0xFFFFFF, 1);
    wrapper.lineStyle(1, this.theme.border ? this.theme.border.color : 0xDDDDDD);
    wrapper.y = 20;
    wrapper.moveTo(0, 0);
    wrapper.lineTo(0, this.results.length * 20);
    wrapper.lineTo(260, this.results.length * 20);
    wrapper.lineTo(260, 0);
    wrapper.lineTo(0, 0);
    wrapper.endFill();

    var inner = new PIXI.Container();

    for (var i = 0; i < this.results.length; i++) {
        var container = this.createSuggestionItem(this.results[i].text, 260, 20);
        container.y = i * 20;
        inner.addChild(container);
    }
    wrapper.addChild(inner);

    this.wrapper = wrapper;
    this.addChild(this.wrapper);
};

/**
 * Close results and set the text
 *
 * @param text Display text {String}
 */
AutoComplete.prototype.selectResultElement = function (text) {
    this.toggleResults();
    this.text = text;
};

/**
 * Close the results
 */
AutoComplete.prototype.toggleResults = function () {
    this.results = [];
    this.removeChild(this.wrapper);
};

/**
 * Update the hover result element
 * @param elementText
 */
AutoComplete.prototype.hoverResultElement = function (elementText) {
    if (elementText !== this.hoveredElementText) {
        //this.currentState = AutoComplete.HOVER_CONTAINER;
        this.hoveredElementText = elementText;
        this.redrawResult();
    }
};

/**
 * Remove the hover result element
 */
AutoComplete.prototype.removeHoverResultElement = function () {
    //this.currentState = AutoComplete.CLICKED;
    this.hoveredElementText = null;
    this.redrawResult();
};

/**
 * Redraw the results
 */
AutoComplete.prototype.redrawResult = function () {
    this.removeChild(this.wrapper);
    this.drawResults(this.text);
};

/**
 * Closes the results when the mouse is released outside
 *
 * @protected
 */
AutoComplete.prototype.onMouseUpOutside = function () {
    if (this.hasFocus && !this._mouseDown) {
        this.blur();
    }
    this._mouseDown = false;
    this.toggleResults();
};

/**
 * Set the auto complete text. Draws the auto complete results afterwards.
 *
 * @param text The text to set {String}
 */
AutoComplete.prototype.setText = function(text) {
    TextInput.prototype.setText.call(this,text);
    if (this._source) {
        this.toggleResults();
        this.drawResults(text);
    }
};

/**
 * Source elements from which the auto complete filters the elements corresponding to the current text
 *
 * @name GOWN.AutoComplete#source
 * @type String[]
 * @default []
 */
Object.defineProperty(AutoComplete.prototype, 'source', {
    get: function () {
        return this._source;
    },
    set: function (source) {
        if (this._source === source) {
            return;
        }
        this._source = source;
    }
});


/**
 * Result elements (source elements filtered by the text attribute)
 *
 * @name GOWN.AutoComplete#results
 * @type String[]
 * @default []
 */
Object.defineProperty(AutoComplete.prototype, 'results', {
    get: function () {
        return this._results;
    },
    set: function (results) {
        if (this._results === results) {
            return;
        }
        this._results = results;
    }
});

/**
 * The minimum number of entered characters required to draw suggestions.
 *
 * @name GOWN.AutoComplete#minAutoCompleteLength
 * @type Number
 * @default 2
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
 * The maximum number of suggestions that show at one time.
 * If 0, all suggestions will be shown.
 *
 * @name GOWN.AutoComplete#limitTo
 * @type Number
 * @default 5
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

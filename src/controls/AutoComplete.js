var InputControl = require('./InputControl'),
    TextInput = require('./TextInput'),
    InputWrapper = require('../../utils/InputWrapper');

/**
 * The basic AutoComplete. Needed for input with suggestions
 *
 * @class AutoComplete
 * @extends GOWN.TextInput
 * @memberof GOWN
 * @constructor
 */
function AutoComplete(text, theme) {
    this.skinName = AutoComplete.SKIN_NAME;
    this._validStates = this._validStates || AutoComplete.stateNames;
    this._currentState = 'normal';
    this.invalidState = true;
    this._displayAsPassword = false;
    this.results = this.source = [];
    this.hoveredElementText = null;

    InputControl.call(this, text, theme);

    this._minAutoCompleteLength = 2;
    this._limitTo = 5;
    /**
     * timer used to indicate if the cursor is shown
     *
     * @property _cursorTimer
     * @type {Number}
     * @private
     */
    this._cursorTimer = 0;

    /**
     * indicates if the cursor position has changed
     *
     * @property _cursorNeedsUpdate
     * @type {Boolean}
     * @private
     */

    this._cursorNeedsUpdate = true;

    /**
     * interval for the cursor (in milliseconds)
     *
     * @property blinkInterval
     * @type {number}
     */
    this.blinkInterval = 500;

    /**
     * selected area (start and end)
     *
     * @type {Array}
     * @private
     */
    this.selection = [0, 0];

    // caret/selection sprite
    this.cursor = new PIXI.Text('|', this.theme.textStyle);
    this.addChild(this.cursor);

    // selection background
    this.selectionBg = new PIXI.Graphics();
    this.addChildAt(this.selectionBg, 0);

    // set up events
    this.boundOnMouseUp = this.onMouseUp.bind(this);
    this.boundOnMouseUpOutside = this.onMouseUpOutside.bind(this);
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);

    this.mousemove = this.touchmove = this.boundOnMouseMove;
    this.mousedown = this.touchstart = this.boundOnMouseDown;
    this.mouseup = this.touchend = this.boundOnMouseUp;
    this.mouseupoutside = this.touchendoutside = this.boundOnMouseUpOutside;
}

AutoComplete.prototype = Object.create(TextInput.prototype);
AutoComplete.prototype.constructor = AutoComplete;
module.exports = AutoComplete;

// name of skin that will be applied
AutoComplete.SKIN_NAME = 'autoComplete';

/**
 * Hover state: mouse pointer hovers over the VariantContainer
 * (ignored on mobile)
 *
 * @property HOVER
 * @static
 * @final
 * @type String
 */
AutoComplete.HOVER_CONTAINER = 'hover_container';

/**
 * State: initial state
 * (ignored on mobile)
 *
 * @property BACKGROUND
 * @static
 * @final
 * @type String
 */
AutoComplete.BACKGROUND = 'background';

/**
 * State: clicked state
 *
 * @property CLICKED
 * @static
 * @final
 * @type String
 */
AutoComplete.CLICKED = 'clicked';

AutoComplete.stateNames = [
    AutoComplete.HOVER_CONTAINER, AutoComplete.BACKGROUND, AutoComplete.CLICKED
];

AutoComplete.prototype.drawResults = function (text) {
    if (text.length < this._minAutoCompleteLength) {
        this.results = [];
    } else {
        text = text.toString().toLowerCase();
        var results = this.source.filter(function (el) {
            var elementText = el.text.toString().toLowerCase();
            return elementText.indexOf(text) >= 0;
        });
        if (results.length === 1 && results[0].text === text) {
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
        var itemText = new PIXI.Text(this.results[i].text, this.theme.textStyle ? this.theme.textStyle.clone() : {
                font: '20px Arial',
                fill: 0x4E5769
            }); // use own styles
        var container = new PIXI.Container();
        if (this.hoveredElementText && this.hoveredElementText === itemText.text) {
            var background = new PIXI.Graphics()
                .beginFill(this.theme.hover ? this.theme.hover.color : 0xDDDDDD)
                .drawRect(0, i * 20, 260, 20)
                .endFill();
            container.addChild(background);
        }

        itemText.x = 0;
        itemText.y = i * 20 + 5;

        container.hitArea = new PIXI.Rectangle(0, i * 20, 260, 20);

        container.interactive = true;
        container.click = this.selectResultElement.bind(this, itemText.text);
        container.mouseover = this.hoverResultElement.bind(this, itemText.text);
        container.mouseout = this.removeHoverResultElement.bind(this);

        container.addChild(itemText);
        inner.addChild(container);
    }
    wrapper.addChild(inner);

    this.wrapper = wrapper;
    this.addChild(this.wrapper);
};

AutoComplete.prototype.selectResultElement = function (text) {
    this.toggleResults();
    this.text = text;
};

AutoComplete.prototype.toggleResults = function () {
    this.results = [];
    this.removeChild(this.wrapper);
};

AutoComplete.prototype.hoverResultElement = function (elementText) {
    if (elementText !== this.hoveredElementText) {
        this.currentState = AutoComplete.HOVER_CONTAINER;
        this.hoveredElementText = elementText;
        this.redrawResult();
    }
};

AutoComplete.prototype.removeHoverResultElement = function () {
    this.currentState = AutoComplete.CLICKED;
    this.hoveredElementText = null;
    this.redrawResult();
};

AutoComplete.prototype.redrawResult = function () {
    this.removeChild(this.wrapper);
    this.drawResults(this.text);
};

AutoComplete.prototype.onMouseUpOutside = function () {
    if (this.hasFocus && !this._mouseDown) {
        this.blur();
    }
    this._mouseDown = false;
    this.toggleResults();
};

/**
 * set the text that is shown inside the input field.
 * calls onTextChange callback if text changes
 *
 * @property text
 * @type String
 */
Object.defineProperty(AutoComplete.prototype, 'text', {
    get: function () {
        return this._text;
    },
    set: function (text) {
        text += ''; // add '' to assure text is parsed as string
        if (this._origText === text) {
            // return if text has not changed
            return;
        }
        this._origText = text;
        this._text = text || '';
        if (!this.pixiText) {
            this.pixiText = new PIXI.Text(text, this.theme.textStyle);
            this.addChild(this.pixiText);
        } else {
            this.pixiText.text = text;
        }

        // update text input if this text field has the focus
        if (this.hasFocus) {
            InputWrapper.setText(this.value);
        }

        // reposition cursor
        this._cursorNeedsUpdate = true;
        if (this.change) {
            this.change(text);
        }
        if (this._source) {
            this.toggleResults();
            this.drawResults(text);
        }
    }
});


/**
 *
 * @property source
 * @type Array
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
 *
 * @property results
 * @type Array
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

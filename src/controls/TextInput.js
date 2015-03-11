/**
 * @author Andreas Bresser
 */

/**
 * The basic Text Input - based on PIXI.Input Input by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class TextInput
 * @constructor
 */
PIXI_UI.TextInput = function(text, theme) {
    // show and load background image as skin (exploiting skin states)
    this.skinName = this.skinName || PIXI_UI.TextInput.SKIN_NAME;
    this._validStates = this._validStates || PIXI_UI.TextInput.stateNames;
    this._currentState = 'background';
    this.invalidState = true;

    PIXI_UI.InputControl.call(this, text, theme);

    // caret/selection sprite
    this.cursor = new PIXI.Text('|', this.theme.textStyle );
    this.addChild(this.cursor);

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

    // set up events
    this.boundOnMouseUp = this.onMouseUp.bind(this);
    this.boundOnMouseUpOutside = this.onMouseUpOutside.bind(this);
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);

    this.mousemove = this.touchmove = this.boundOnMouseMove;
    this.mousedown = this.touchstart = this.boundOnMouseDown;
    this.mouseup = this.touchend = this.boundOnMouseUp;
    this.mouseupoutside = this.touchendoutside = this.boundOnMouseUpOutside;
};

PIXI_UI.TextInput.prototype = Object.create( PIXI_UI.InputControl.prototype );
PIXI_UI.TextInput.prototype.constructor = PIXI_UI.TextInput;

// name of skin
PIXI_UI.TextInput.SKIN_NAME = 'text_input';

// define width
Object.defineProperty(PIXI_UI.TextInput.prototype, 'width', {
    get: function()
    {
        return this._width;
    },
    set: function(value)
    {
        this._width = value;
    }
});

// define height
Object.defineProperty(PIXI_UI.TextInput.prototype, 'height', {
    get: function()
    {
        return this._height;
    },
    set: function(value)
    {
        this._height = value;
    }
});

/**
 * set the text that is shown inside the input field
 *
 * @property text
 * @type String
 */
Object.defineProperty(PIXI_UI.TextInput.prototype, 'text', {
    get: function() {
        return this._text;
    },
    set: function(text) {
        this._text = text || ' ';
        if (!this.pixiText) {
            this.pixiText = new PIXI.Text(text, this.theme.textStyle);
            this.addChild(this.pixiText);
        } else {
            this.pixiText.setText(text);
        }
    }
});

/**
 * set selected text
 *
 * @param start
 * @param end
 * @returns {boolean}
 */
PIXI_UI.TextInput.prototype.updateSelection = function(start, end) {
    if (this.selection[0] !== start || this.selection[1] !== end) {
        this.selection[0] = start;
        this.selection[1] = end;
        PIXI_UI.InputWrapper.setSelection(start, end);
        this._cursorNeedsUpdate = true;
        return true;
    } else {
        return false;
    }
};

PIXI_UI.TextInput.prototype.onSubmit = function() {
};

PIXI_UI.TextInput.prototype.onKeyDown = function(e) {
    var keyCode = e.which;

    // ESC
    if (e.which === 27) {
        this.blur();
        return;
    }

    // add support for Ctrl/Cmd+A selection - select whole input text
    if (keyCode === 65 && (e.ctrlKey || e.metaKey))
    {
        e.preventDefault();
        this.updateSelection(0, this.text.length);
        return;
    }

    // block keys that shouldn't be processed
    if (keyCode === 17 || e.metaKey || e.ctrlKey) {
        return;
    }

    // enter key
    if (keyCode === 13) {
        e.preventDefault();
        this.onSubmit(e);
    }

    // update the canvas input state information from the hidden input
    this.updateTextState();
};

PIXI_UI.TextInput.prototype.onKeyUp = function() {
    // update the canvas input state information from the hidden input
    this.updateTextState();
};

/**
 * draw the cursor
 *
 * @method drawCursor
 */
PIXI_UI.TextInput.prototype.drawCursor = function() {
    if(this.hasFocus || this._mouseDown) {
        var time = Date.now();

        // blink interval for cursor
        if((time-this._cursorTimer) >= this.blinkInterval) {
            this._cursorTimer = time;
            this.cursor.visible = !this.cursor.visible;
        }

        // update cursor position
        if(this.cursor.visible && this._cursorNeedsUpdate) {
            this.cursor.x = this.textWidth(this.text.substring(0, this.cursorPos)) | 0;
            this._cursorNeedsUpdate = false;
        }
    } else {
        this.cursor.visible = false;
    }
};

PIXI_UI.TextInput.prototype.redraw = function()
{
    this.drawCursor();
    PIXI_UI.Control.prototype.redraw.call(this);
};

PIXI_UI.TextInput.prototype.onMouseMove = function(e) {

    if(!this.hasFocus || !this._mouseDown || this.selectionStart < 0 ||
            !this.stage.interactionManager.hitTest(this, e)) {
        return false;
    }

    var mouse = this.mousePos(e);
    var curPos = this.clickPos(mouse.x, mouse.y),
        start = Math.min(this.selectionStart, curPos),
        end = Math.max(this.selectionStart, curPos);

    if (this.updateSelection(start, end)) {
        this.cursorPos = curPos;
        this._cursorNeedsUpdate = true;
    }
    return true;
};

PIXI_UI.TextInput.prototype.onMouseDown = function(e) {
    if(e.originalEvent.which === 2 || e.originalEvent.which === 3)
    {
        e.originalEvent.preventDefault();
        return false;
    }

    // focus input
    this.focus();

    this._mouseDown = true;
    var mouse = this.mousePos(e);

    // start the selection drag if inside the input
    this.selectionStart = this.clickPos(mouse.x, mouse.y);
    this.updateSelection(this.selectionStart, this.selectionStart);
    this.cursorPos = this.selectionStart;
    return true;
};

PIXI_UI.TextInput.prototype.onMouseUp = function(e) {

    if(e.originalEvent.which === 2 || e.originalEvent.which === 3)
    {
        e.originalEvent.preventDefault();
        return false;
    }

    var mouse = this.mousePos(e);

    // update selection if a drag has happened
    var clickPos = this.clickPos(mouse.x, mouse.y);

    // update the cursor position
    if(!(this.selectionStart >= 0 && clickPos !== this.selectionStart))
    {
        this.cursorPos = clickPos;
        this.updateSelection(this.cursorPos, this.cursorPos);
    }

    this.selectionStart = -1;
    this._mouseDown = false;
    return true;
};

/**
 * synchronize TextInput with DOM element
 *
 * @method updateTextState
 */
PIXI_UI.TextInput.prototype.updateTextState = function() {
    var text = PIXI_UI.InputWrapper.getText();

    if (text !== this.text)
    {
        this.text = text;
    }

    var sel = PIXI_UI.InputWrapper.getSelection();
    if (this.updateSelection(sel[0], sel[1])) {
        this.cursorPos = sel[0];
    }
};

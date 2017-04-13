var InputWrapper = require('./InputWrapper');

/**
 * Wrapper for InputControl to use the Browser Keyboard events.
 * used for text input outside of the browser (e.g. cocoon.js).
 *
 * we handle selection and text input on our own!
 *
 * Prefered input Method is to use a DOM text input, see DOMInputWrapper.
 *
 * @class KeyboardInputWrapper
 * @memberof GOWN
 */
function KeyboardInputWrapper(manager) {
    InputWrapper.call(this, manager, KeyboardInputWrapper.name);

    // the text that is stored internally
    // (for password fields this should be the cleartext password, for numberinputs
    //  the number as string)
    this._text = '';

    // current cursor position
    this.cursorPos = 0;

    this.maxChars = 0;

    // character position that marks the beginning of the current selection
    this.selectionStart = 0;

    this._selection = [0, 0];

    /**
     * Fired when a key is pressed (usually a touch on a virtual keyboard
     * on the screen)
     */
     this.addEventListener();
}
KeyboardInputWrapper.prototype = Object.create( InputWrapper.prototype );
KeyboardInputWrapper.prototype.constructor = KeyboardInputWrapper;
module.exports = KeyboardInputWrapper;

KeyboardInputWrapper.name = 'keyboard';

/**
* Registers all the DOM events
*
* @private
*/
KeyboardInputWrapper.prototype.addEventListener = function () {
    if (!this.eventsAdded) {
        this._onKeyDown = this.onKeyDown.bind(this);
        this._onKeyUp = this.onKeyUp.bind(this);
        if (window.document.body) {
            // Ineternet Explorer only listens to key-events on a dom-object,
            // it ignores them when we listen on document
            window.document.body.addEventListener('keydown', this._onKeyDown, true);
            window.document.body.addEventListener('keyup', this._onKeyUp, true);
        } else {
            window.document.addEventListener('keydown', this._onKeyDown, true);
            window.document.addEventListener('keyup', this._onKeyUp, true);
        }
    }

   this.eventsAdded = true;
};

/**
 * Removes all the DOM events that were previously registered
 *
 * @private
 */
KeyboardInputWrapper.prototype.removeEventListener = function () {
    if (this.eventsAdded) {
        if (window.document.body) {
            window.document.body.removeEventListener('keydown', this._onKeyDown, true);
            window.document.body.removeEventListener('keyup', this._onKeyUp, true);
        } else {
            window.document.removeEventListener('keydown', this._onKeyDown, true);
            window.document.removeEventListener('keyup', this._onKeyUp, true);
        }
        this._onKeyUp = null;
        this._onKeyDown = null;
    }
    this.eventsAdded = false;
};

/**
 * Is called when the key is pressed down
 *
 * This will call manager.processKeyboard on all displayObjects that
 * have receiveKeys set to true  and it will emit the event 'keyDown'
 * on the manager
 *
 * @param event {Event} The DOM event of a key being pressed down
 * @private
 */
KeyboardInputWrapper.prototype.onKeyDown = function (event) {
    this.processKeyDown(event);
    this.manager._keyDownEvent(event);
};

/**
 * Is called when the key is released
 *
 * This will call manager.processKeyboard on all displayObjects that
 * have receiveKeys set to true  and it will emit the event 'keyDown'
 * on the manager
 *
 * @param event {Event} The DOM event of a key being released
 * @private
 */

KeyboardInputWrapper.prototype.onKeyUp = function (event) {
    this.manager._keyUpEvent(event);
};


/**
 * handle keyboard input
 */
KeyboardInputWrapper.prototype.processKeyDown = function (event) {
    var key = event.key;
    // TODO implement the insert key to overwrite text? it is gnored for now!
    if (key === 'WakeUp' || key === 'CapsLock' ||
        key === 'Shift' || key === 'Control' || key === 'Alt' ||
        key === 'AltGraph' ||
        key.match(/^F\d{1,2}$/) || // F1-F12
        key === 'Insert' ||
        key === 'Escape' || key === 'NumLock' ||
        key === 'Meta' || // Chrome Meta/Windows Key
        key === 'Win' || // Internet Explorer Meta/Windows Key
        key === 'Dead' || // Chrome Function/Dead Key
        key === 'Unidentified' || // Internet Explorer Function Key
        key === 'AudioVolumeDown' ||
        key === 'AudioVolumeUp' ||
        key === 'AudioVolumeMute' ||
        key === 'Enter' || // TODO: implement submit in InputControl
        key === 'Tab' // TODO: implement Tab / TabIndex in InputControl
        ) {
        // ignore special system and control keys
        return;
    }

    // check for selected Text
    var selected = this.selection && (
        this.selection[0] !== this.selection[1]);

    switch (key) {
        case 'Left': // Internet Explorer left arrow
        case 'ArrowLeft': // Chrome left arrow

            this.moveCursorLeft();
            if (event.shiftKey) {
                this.updateSelection(this.cursorPos, this.selection[1]);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }

            break;
        case 'Right':
        case 'ArrowRight':

            this.moveCursorRight();
            if (event.shiftKey) {
                this.updateSelection(this.selection[0], this.cursorPos);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            break;
        case 'PageUp':
        case 'Home':
            // jump to last character
            this.cursorPos = 0;
            if (event.shiftKey) {
                this.updateSelection(this.cursorPos, this.selection[1]);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            break;
        case 'PageDown':
        case 'End':
            // jump to last character
            this.cursorPos = this._text.length;
            if (event.shiftKey) {
                this.updateSelection(this.selection[0], this.cursorPos);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            break;
        case 'Up':
        case 'ArrowUp':
            /*this.moveCursorUp();
            if (eventData.data.shiftKey) {
                if (maxLines === 0) {
                    this.cursorPos = 0;
                }
                this.updateSelection(this.cursorPos, this.selection[1]);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            this._cursorNeedsUpdate = true;*/
            break;
        case 'Down':
        case 'ArrowDown':
            /*this.moveCursorDown();
            if (eventData.data.shiftKey) {
                if (maxLines === 0) {
                    this.cursorPos = this.text.length;
                }
                this.updateSelection(this.selection[0], this.cursorPos);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            this._cursorNeedsUpdate = true;*/
            break;
        case 'Backspace':
            if (selected) {
                // remove only the selected Text
                this.deleteSelection();
                this.updateSelection(this.cursorPos, this.cursorPos);
            } else if (this.cursorPos > 0) {
                //if (eventData.data.ctrlKey) {
                    // TODO: delete previous word!
                //}
                // remove last char at cursorPosition
                this.moveCursorLeft();
                this.deleteText(this.cursorPos, this.cursorPos+1);
            }
            // ignore browser-back
            event.preventDefault();
            break;
        case 'Del': // Internet Explorer Delete Key
        case 'Delete': // Chrome Delete Key
            if (selected) {
                this.deleteSelection();
                this.updateSelection(this.cursorPos, this.cursorPos);
            } else if (this.cursorPos < this.text.length) {
                //if (eventData.data.ctrlKey) {
                    // TODO: delete previous word!
                //}
                // remove next char after cursorPosition
                this.deleteText(this.cursorPos, this.cursorPos+1);
            }
            break;
        default:
            // select all text
            if (event.ctrlKey && key.toLowerCase() === 'a') {
                this.cursorPos = this.text.length;
                this.updateSelection(0, this.cursorPos);
                // this._cursorNeedsUpdate = true;
                return;
            }
            // allow µ or ² but ignore keys for browser refresh / show Developer Tools
            // TODO: AltGraph?
            if (event.ctrlKey && (key.toLowerCase() === 'j' || key.toLowerCase() === 'r')) {
                return;
            }
            if (selected) {
                this.deleteSelection();
            }
            // Internet Explorer space bar
            if (key === 'Spacebar') {
                key = ' ';
            }
            if (key === ' ') {
                 // do not scroll down when//overrides the space bar has been pressed.
                 event.preventDefault();
             }

             if (key.length !== 1) {
                 throw new Error('unknown key ' + key);
             }

             this.insertChar(key);
             // TODO: update selection
    }
};

KeyboardInputWrapper.prototype.moveCursorLeft = function() {
    this.cursorPos = Math.max(this.cursorPos-1, 0);
};

KeyboardInputWrapper.prototype.moveCursorRight = function() {
    this.cursorPos = Math.min(this.cursorPos+1, this.text.length);
};


KeyboardInputWrapper.prototype.insertChar = function(chr) {
    if (this.maxChars > 0 && this.pixiText.text >= this.maxChars) {
        this._text = this._text.substring(0, this.maxChars);
        return;
    }

    this._text = this._text.slice(0, this.cursorPos) + chr +
        this._text.slice(this.cursorPos, this._text.length);
    this.moveCursorRight();
};

/**
 * deletion from to multiple lines
 */
KeyboardInputWrapper.prototype.deleteText = function(fromPos, toPos) {
    this._text = [this._text.slice(0, fromPos), this._text.slice(toPos)].join('');
    return this._text;
};

/**
 * set selected text
 *
 * @method updateSelection
 * @param start start position in the text
 * @param end end position in the text
 * @returns {boolean}
 */
// TODO: throw an event for the InputControl so it only updates the ui
KeyboardInputWrapper.prototype.updateSelection = function (start, end) {
    if (this._selection[0] !== start || this._selection[1] !== end) {
        this._selection[0] = start;
        this._selection[1] = end;
        return true;
    }
    return false;
};

/**
 * The text content
 *
 * @property text
 * @type String
 */
Object.defineProperty(KeyboardInputWrapper.prototype, 'text',{
    get: function() {
        return this._text;
    },
    set: function(value) {
        this._text = value;
    }
});

/**
 * current selection
 *
 * @property selection
 * @type Array
 */
Object.defineProperty(KeyboardInputWrapper.prototype, 'selection',{
    get: function() {
        return this._selection;
    },
    set: function(value) {
        this._selection = value;
    }
});


/**
 * delete selected text
 *
 */
KeyboardInputWrapper.prototype.deleteSelection = function() {
     var start = this._selection[0];
     var end = this._selection[1];
     if (start < end) {
         this.cursorPos = start;
         return this.deleteText(start, end);
     } else if (start > end) {
         this.cursorPos = end;
         return this.deleteText(end, start);
     }
     throw new Error('can not delete text! (start & end are the same)');
 };

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

    /**
     * An event data object to handle all the event tracking/dispatching
     *
     * @member {object}
     */
    this.eventData = {
        stopped: false,
        target: null,
        type: null,
        data: {},
        stopPropagation:function(){
            this.stopped = true;
        }
    };

    /**
     * Fired when a key is pressed (usually a touch on a virtual keyboard
     * on the screen)
     */
     this.addEvents();
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
KeyboardInputWrapper.prototype.addEvents = function () {
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
KeyboardInputWrapper.prototype.removeEvents = function () {
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
 * @param event {Event} The DOM event of a key being pressed down
 * @private
 */
KeyboardInputWrapper.prototype.onKeyDown = function (event) {
    if (this.autoPreventDefault) {
        event.preventDefault();
    }
    this._keyEvent(event);
    this.processKeyDown();
    // TODO: call processInteractive in KeyboardManager after a change
    // (same behavior for KeyboardInputWrapper and DOMInputWrapper)
    //this.processInteractive(this.renderer._lastObjectRendered, this.keyDownProcess);
    //this.emit('keydown', this.eventData);
};

/**
 * Is called when the key is released
 *
 * @param event {Event} The DOM event of a key being released
 * @private
 */

KeyboardInputWrapper.prototype.onKeyUp = function (event) {
    if (this.autoPreventDefault) {
        event.preventDefault();
    }
/*    this._keyEvent(event);
    // TODO: call processInteractive in KeyboardManager after a change
    // (same behavior for KeyboardInputWrapper and DOMInputWrapper)
    //this.processInteractive(this.renderer._lastObjectRendered, this.keyUpProcess);
    this.emit('keyup', this.eventData);*/
};


/**
 * Handle original key event and forward it to gown
 *
 * @param event {Event} The DOM event of a key being released
 * @param type {string} type of the event (keyup or keydown)
 * @private
 */
KeyboardInputWrapper.prototype._keyEvent = function(event) {
    this.eventData.stopped = false;
    this.eventData.originalEvent = event;
    this.eventData.data = this.getKeyData(event);

    if (this.autoPreventDefault) {
        event.preventDefault();
    }
};

/**
 * Grabs the data from the keystroke
 * @private
 */
KeyboardInputWrapper.prototype.getKeyData = function (event) {
    return {
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        key: event.key,
        originalEvent: event
    };
};

// TODO: dispatch event after text has been altered
/**
 * Dispatches an event on the display object that has resizable set to true
 *
 * @param displayObject {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} the display object in question
 * @param eventString {string} the name of the event (e.g, resize or orientation)
 * @param eventData {object} the event data object
 * @private
 */
/*
KeyboardInputWrapper.prototype.dispatchEvent = function ( displayObject, eventString, eventData )
{
    if(!eventData.stopped)
    {
        eventData.target = displayObject;
        eventData.type = eventString;

        displayObject.emit( eventString, eventData );

        if( displayObject[eventString] )
        {
            displayObject[eventString]( eventData );
        }
    }
};

KeyboardInputWrapper.prototype.keyUpProcess = function(displayObject) {
    this.dispatchEvent( displayObject, 'keyup', this.eventData );
};

KeyboardInputWrapper.prototype.keyDownProcess = function(displayObject) {
    this.dispatchEvent( displayObject, 'keydown', this.eventData );

    // TODO: store text, if a key has been pressed append it to the text and dispatch
    // event on manager thet the text has been changed (so the manager can
    // forward it to the InputControl)
};
*/

/**
 * handle keyboard input
 */
KeyboardInputWrapper.prototype.processKeyDown = function () {
    var eventData = this.eventData;
    var key = eventData.data.key;
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
        key === 'AudioVolumeMute'
        ) {
        // ignore special system and control keys
        return;
    }

    if (key === 'Tab') {
        // TODO: implement Tab / TabIndex
        return;
    }
    if (key === 'Enter') {
        this.emit('enter', this);
        return;
    }

    // check for selected Text
    var selected = this.selection && (
        this.selection[0] !== this.selection[1]);

    switch (key) {
        case 'Left': // Internet Explorer left arrow
        case 'ArrowLeft': // Chrome left arrow
            this.moveCursorLeft();
            if (eventData.data.shiftKey) {
                this.updateSelection(this.cursorPos, this.selection[1]);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            break;
        case 'Right':
        case 'ArrowRight':
            this.moveCursorRight();
            if (eventData.data.shiftKey) {
                this.updateSelection(this.selection[0], this.cursorPos);
            } else {
                this.updateSelection(this.cursorPos, this.cursorPos);
            }
            break;
        case 'PageDown':
        case 'PageUp':
        case 'Home':
        case 'End':
            // TODO: implement jump to first/last character
            // ignored for now (because you normally don't have those keys on
            // a mobile device)
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
            eventData.originalEvent.preventDefault();
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
            if (eventData.data.ctrlKey && key.toLowerCase() === 'a') {
                this.cursorPos = this.text.length;
                this.updateSelection(0, this.cursorPos);
                this._cursorNeedsUpdate = true;
                return;
            }
            // allow µ or ² but ignore keys for browser refresh / show Developer Tools
            // TODO: AltGraph?
            if (eventData.data.ctrlKey && (key.toLowerCase() === 'j' || key.toLowerCase() === 'r')) {
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
                 eventData.originalEvent.preventDefault();
             }

             if (key.length !== 1) {
                 throw new Error('unknown key ' + key);
             }

             this.insertChar(key);
             this.updateSelection(this.cursorPos, this.cursorPos);
    }
};


KeyboardInputWrapper.prototype.insertChar = function(chr) {
    this._text.split(this._cursorPos, 0, chr);
    //TODO: dispatch Event that text has been changed
};

KeyboardInputWrapper.prototype.destroy = function () {
    this.removeEvents();
};

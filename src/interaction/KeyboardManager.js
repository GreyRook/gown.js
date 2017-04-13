var EventEmitter = require('eventemitter3');
var DOMInputWrapper = require('../utils/DOMInputWrapper');
var KeyboardInputWrapper = require('../utils/KeyboardInputWrapper');

/**
 * The keyboard manager deals with key events. Any DisplayObject can be interactive
 * if its interactive parameter is set to true (similar to the InteractionManager
 * in PIXI)
 *
 * @class
 * @extends EventEmitter
 * @memberof GOWN.interaction
 * @param renderer {PIXI.CanvasRenderer|PIXI.WebGLRenderer} A reference to the current renderer
 * @param [options] {object}
 * @param [options.autoPreventDefault=true] {boolean} Should the manager automatically prevent default browser actions.
 */
// TODO: show keyboard in Cocoon.io - see Cocoon.Dialog.showKeyboard
function KeyboardManager(renderer, options) {
    EventEmitter.call(this);

    options = options || {};

    /**
     * Used to create events that will be dispatched on the KeyboardManager
     * so the InputControl can process it. This should be the only way how
     * the InputWrapper communicates with the InputControl.
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
     * The renderer this interaction manager works for.
     *
     * @member {PIXI.SystemRenderer}
     */
    this.renderer = renderer;

    /**
     * Should default browser actions automatically be prevented.
     *
     * @member {boolean}
     * @default false
     */
    this.autoPreventDefault = options.autoPreventDefault !== undefined ? options.autoPreventDefault : false;

    this.processKeyboard = this.processKeyboard.bind(this);

    // detect if we use DOMInputWrapper or KeyboardInputWrapper
    if (window.cordova || window.cocoonjsCheckArgs) {
        // TODO: this provides just basic functionality, test and implement
        // it some more, see https://github.com/GreyRook/gown.js/issues/99
        KeyboardManager.wrapper = new KeyboardInputWrapper(this);
    } else {
        KeyboardManager.wrapper = new DOMInputWrapper(this);
    }
}

KeyboardManager.prototype = Object.create(EventEmitter.prototype);
KeyboardManager.prototype.constructor = KeyboardManager;
module.exports = KeyboardManager;

/**
 * Handle original keyboard event from wrapper and forward it
 *
 * @param event {Event} The event from the wrapper
 * @private
 */
KeyboardManager.prototype._keyDownEvent = function(event) {
    this._keyEvent(event, 'keydown');
};

/**
 * Handle original keyboard event from wrapper and forward it
 *
 * @param event {Event} The event from the wrapper
 * @private
 */
KeyboardManager.prototype._keyUpEvent = function(event) {
    this._keyEvent(event, 'keyup');
};

KeyboardManager.prototype._keyEvent = function(event, eventString) {
    this.eventData.stopped = false;
    this.eventData.originalEvent = event;
    this.eventData.data = KeyboardManager.wrapper.getKeyData(event);

    if (this.autoPreventDefault) {
        event.preventDefault();
    }

    this.processInteractive(this.renderer._lastObjectRendered, this.processKeyboard, eventString);
    this.emit(eventString, this.eventData);
};

KeyboardManager.prototype.processKeyboard = function(displayObject, eventString) {
    this.dispatchEvent( displayObject, eventString, this.eventData );
};

/**
 * Dispatches an event on the display object that has resizable set to true
 *
 * @param displayObject {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} the display object in question
 * @param eventString {string} the name of the event (e.g, resize or orientation)
 * @param eventData {object} the event data object
 * @private
 */
KeyboardManager.prototype.dispatchEvent = function ( displayObject, eventString, eventData )
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

/**
 * instance of the wrapper (e.g. KeyboardWrapper or DOMInputWrapper)
 */
KeyboardManager.wrapper = null;

/**
 * traverse through the scene graph to call given function on all displayObjects
 * that can receive keys
 *
 * @param displayObject {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite} the displayObject that will be resized (recurcsivly crawls its children)
 * @param [func] {Function} the function that will be called on each resizable object. The displayObject will be passed to the function
 */
KeyboardManager.prototype.processInteractive = function (displayObject, func, eventString)
{
    if(!displayObject || !displayObject.visible || displayObject.enabled === false)
    {
        return false;
    }

    var children = displayObject.children;

    for (var i = children.length-1; i >= 0; i--) {
        // unlike the InteractionManager we iterate over ALL children
        // and check every one if it is resizable, because
        // we assume that resize is something that could affect every component
        // not only the one that has focus.
        var child = children[i];
        this.processInteractive(child, func, eventString);
    }

    // only the ones who can receive keys (e.g. InputControl) will listen to
    if (displayObject.receiveKeys) {
        func(displayObject, eventString);
    }
};

KeyboardManager.prototype.destroy = function(){
    KeyboardManager.wrapper.destroy();
    this.removeAllListeners();
    this.renderer = null;
    this.eventData = null;
    this.onKeyUp = null;
    this.onKeyDown = null;
};

PIXI.WebGLRenderer.registerPlugin('keyboard', KeyboardManager);
PIXI.CanvasRenderer.registerPlugin('keyboard', KeyboardManager);

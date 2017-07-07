var EventEmitter = require('eventemitter3');

/**
 * The keyboard manager deals with key events. Any DisplayObject can be interactive
 * if its interactive parameter is set to true (similar to the InteractionManager
 * in PIXI)
 *
 * @class
 * @extends EventEmitter
 * @memberof GOWN.interaction
 * @param renderer A reference to the current renderer {PIXI.CanvasRenderer|PIXI.WebGLRenderer}
 * @param [options] {object}
 * @param [options.autoPreventDefault=false] {boolean} Should the manager automatically prevent default browser actions.
 */
// TODO (maybe): move this to an own external lib for PIXI-Keyboard interaction
// TODO: show keyboard in Cocoon.io - see Cocoon.Dialog.showKeyboard
function KeyboardManager(renderer, options) {
    EventEmitter.call(this);

    options = options || {};

    /**
     * The renderer this interaction manager works for.
     *
     * @type PIXI.SystemRenderer
     */
    this.renderer = renderer;

    /**
     * Should default browser actions automatically be prevented.
     *
     * @type bool
     * @default false
     */
    this.autoPreventDefault = options.autoPreventDefault !== undefined ? options.autoPreventDefault : false;

    /**
     * An event data object to handle all the event tracking/dispatching
     *
     * @type Object
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

    this.onKeyUp = this.onKeyUp.bind(this);
    this.keyUpProcess = this.keyUpProcess.bind(this);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.keyDownProcess = this.keyDownProcess.bind(this);

    this.addEvents();
}

KeyboardManager.prototype = Object.create(EventEmitter.prototype);
KeyboardManager.prototype.constructor = KeyboardManager;
module.exports = KeyboardManager;

 /**
 * Registers all the DOM events
 *
 * @private
 */
KeyboardManager.prototype.addEvents = function () {
    if (window.document.body) {
        // Ineternet Explorer only listens to key-events on a dom-object,
        // it ignores them when we listen on document
        window.document.body.addEventListener('keydown', this.onKeyDown, true);
        window.document.body.addEventListener('keyup', this.onKeyUp, true);
    } else {
        window.document.addEventListener('keydown', this.onKeyDown, true);
        window.document.addEventListener('keyup', this.onKeyUp, true);
    }

    this.eventsAdded = true;
};

/**
 * Removes all the DOM events that were previously registered
 *
 * @private
 */
KeyboardManager.prototype.removeEvents = function () {
    if (window.document.body) {

        window.document.body.removeEventListener('keydown', this.onKeyDown, true);
        window.document.body.removeEventListener('keyup', this.onKeyUp, true);
    } else {
        window.document.removeEventListener('keydown', this.onKeyDown, true);
        window.document.removeEventListener('keyup', this.onKeyUp, true);
    }
    this.eventsAdded = false;
};

/**
 * Is called when the key is pressed down
 *
 * @param event The DOM event of a key being pressed down {Event}
 * @private
 */
KeyboardManager.prototype.onKeyDown = function (event) {
    if (this.autoPreventDefault) {
        event.preventDefault();
    }
    this._keyEvent(event);
    this.processInteractive(this.renderer._lastObjectRendered, this.keyDownProcess);
    this.emit('keydown', this.eventData);
};

/**
 * Is called when the key is released
 *
 * @param event The DOM event of a key being released {Event}
 * @private
 */
KeyboardManager.prototype.onKeyUp = function (event) {
    if (this.autoPreventDefault) {
        event.preventDefault();
    }
    this._keyEvent(event);
    this.processInteractive(this.renderer._lastObjectRendered, this.keyUpProcess);
    this.emit('keyup', this.eventData);
};

/**
 * Handle original key event and forward it to gown
 *
 * @param event The DOM event of a key being released {Event}
 * @private
 */
KeyboardManager.prototype._keyEvent = function(event) {

    this.eventData.stopped = false;
    this.eventData.originalEvent = event;
    this.eventData.data = this.getKeyData(event);

    if (this.autoPreventDefault) {
        event.preventDefault();
    }
};

/**
 * Grabs the data from the keystroke
 *
 * @param event The event to get the key data from {Event}
 * @return {Object}
 * @private
 */
KeyboardManager.prototype.getKeyData = function (event) {
    return {
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        key: event.key,
        originalEvent: event
    };
};

/**
 * Dispatches a key up event
 *
 * @param displayObject The object to dispatch the key event for {PIXI.DisplayObject}
 * @private
 */
KeyboardManager.prototype.keyUpProcess = function(displayObject) {
    this.dispatchEvent( displayObject, 'keyup', this.eventData );
};

/**
 * Dispatches a key down event
 *
 * @param displayObject The object to dispatch the key event for {PIXI.DisplayObject}
 * @private
 */
KeyboardManager.prototype.keyDownProcess = function(displayObject) {
    this.dispatchEvent( displayObject, 'keydown', this.eventData );
};

/**
 * Traverse through the scene graph to call the given function on all displayObjects
 * that can receive keys
 *
 * @param displayObject The displayObject that will be resized (recurcsivly crawls its children)
 * {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite}
 * @param [func] The function that will be called on each resizable object.
 * The displayObject will be passed to the function {Function}
 */
KeyboardManager.prototype.processInteractive = function (displayObject, func) {
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
        this.processInteractive(child, func);
    }

    // only the ones who can receive keys (e.g. InputControl) will listen to
    if (displayObject.receiveKeys) {
        func(displayObject);
    }
};

/**
 * Dispatches an event on the display object that has resizable set to true
 *
 * @param displayObject The display object in question {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite}
 * @param eventString The name of the event (e.g, resize or orientation) {String}
 * @param eventData The event data object {Object}
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
 * Remove events and listener etc.
 */
KeyboardManager.prototype.destroy = function(){
    this.removeEvents();
    this.removeAllListeners();
    this.renderer = null;
    this.eventData = null;
    this.onKeyUp = null;
    this.keyUpProcess = null;
    this.onKeyDown = null;
    this.keyDownProcess = null;
};

PIXI.WebGLRenderer.registerPlugin('keyboard', KeyboardManager);
PIXI.CanvasRenderer.registerPlugin('keyboard', KeyboardManager);

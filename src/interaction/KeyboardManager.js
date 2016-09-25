var EventEmitter = require('eventemitter3');

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

function KeyboardManager(renderer, options) {
    EventEmitter.call(this);

    options = options || {};

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
     * @default true
     */
    this.autoPreventDefault = options.autoPreventDefault !== undefined ? options.autoPreventDefault : true;

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
     * Fired when a key (usually from a keyboard) is pressed
     *
     * @event mouseout
     * @memberof PIXI.interaction.InteractionManager#
     */


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
    window.document.addEventListener('keydown', this.onKeyDown, true);
    window.document.addEventListener('keyup', this.onKeyUp, true);
    this.eventsAdded = true;
};

/**
 * Removes all the DOM events that were previously registered
 *
 * @private
 */
KeyboardManager.prototype.removeEvents = function () {
    window.document.removeEventListener('keydown', this.onKeyDown, true);
    window.document.removeEventListener('keyup', this.onKeyUp, true);
    this.eventsAdded = false;
};

/**
 * Is called when the key is pressed down
 *
 * @param event {Event} The DOM event of a key being pressed down
 * @private
 */
KeyboardManager.prototype.onKeyDown = function (event) {
    this.eventData.data.originalEvent = event;
    this.eventData.stopped = false;

    if (this.autoPreventDefault) {
        event.preventDefault();
    }


    this.emit(event);
};

KeyboardManager.prototype.onKeyUp = function (event) {

};

PIXI.WebGLRenderer.registerPlugin('interaction', KeyboardManager);
PIXI.CanvasRenderer.registerPlugin('interaction', KeyboardManager);

var EventEmitter = require('eventemitter3');

/**
 * The resize manager deals with changes in the Application size
 * e.g. if the browser window has been resized because the keyboard is shown
 * or the device has been rotated on mobile or the user resized it on the
 * desktop with his mouse.
 *
 * @class
 * @extends EventEmitter
 * @memberof GOWN.interaction
 * @param renderer A reference to the current renderer {PIXI.CanvasRenderer|PIXI.WebGLRenderer}
 * @param [options] {object}
 * @param [options.autoPreventDefault=true] Should the manager automatically prevent default browser actions. {boolean}
 * @param [options.fullscreen=false] Should we use the whole browser width/height (window.innerHeight/Width). {boolean}
 */
 // TODO: orientation change for cordova and cocoon ('orientationchange' and Cocoon.Device.getOrientation())
 // TODO: take a look at phaser ScaleManager - see https://github.com/photonstorm/phaser/blob/v2.4.2/src/core/ScaleManager.js
 // TODO: check single Canvas-DOM-Element, not only whole window (see https://github.com/marcj/css-element-queries )
function ResizeManager(renderer, options) {
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
     * @default true
     */
    this.autoPreventDefault = options.autoPreventDefault !== undefined ? options.autoPreventDefault : true;

    /**
     * Should we use the whole browser width/height (window.innerHeight/Width)
     *
     * @type bool
     * @default false
     */
    this.fullscreen = options.fullscreen || false;

    /**
     * TODO
     */
    this.element = null;

    /**
     * Time to wait after every resize event to prevent flickering
     *
     * @type Number
     * @default 0
     */
    this.resizeTimeout = 0;

    /**
     * Should the resize manager wait after every resize event
     *
     * @type bool
     * @default true
     */
    this.useResizeDoneTimeout = options.useResizeDoneTimeout !== undefined ? options.useResizeDoneTimeout : true;

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

     this.onResize = this.onResize.bind(this);
     this.processResize = this.processResize.bind(this);

     this.addEvents();
}

ResizeManager.prototype = Object.create(EventEmitter.prototype);
ResizeManager.prototype.constructor = ResizeManager;
module.exports = ResizeManager;

/**
 * The waiting time after the resize event before updating
 * (prevent the canvas from flickering when resizing)
 *
 * @static
 * @final
 * @type String
 */
ResizeManager.RESIZE_DONE_TIMEOUT = 100;

 /**
 * Registers all the DOM events
 *
 * @private
 */
ResizeManager.prototype.addEvents = function () {
    window.addEventListener('resize', this.onResize, true);
    this.eventsAdded = true;
};

/**
 * Removes all the DOM events that were previously registered
 *
 * @private
 */
ResizeManager.prototype.removeEvents = function () {
    window.removeEventListener('resize', this.onResize, true);
    this.eventsAdded = false;
};

/**
 * Is called when the application/browser window gets resized
 *
 * @param _event The DOM event {Event}
 * @private
 */
ResizeManager.prototype.onResize = function (_event) {
    if (!this.element && this.fullscreen === false) {
        // we assume you have a fixed size?!
        // TODO: do not add resizeManager in the first place?
        return;
    }
    if (this.autoPreventDefault) {
        _event.preventDefault();
    }

    if (this.useResizeDoneTimeout) {
        var scope = this;
        if (this.resizeTimeout) {
            clearInterval(this.resizeTimeout);
        }
        this.resizeTimeout = setInterval(function () {
            clearInterval(scope.resizeTimeout);
            scope._resizeEvent(_event);
        }, ResizeManager.RESIZE_DONE_TIMEOUT);
    } else {
        this._resizeEvent(_event);
    }

};

/**
 * Handle the original resize event and forward it
 *
 * @param event The DOM event {Event}
 * @private
 */
ResizeManager.prototype._resizeEvent = function(event) {
    this.eventData.stopped = false;

    this.eventData.data = this.getSizeData(event);

    if (this.autoPreventDefault) {
        event.preventDefault();
    }

    this.processInteractive(this.renderer._lastObjectRendered, this.processResize);
    this.emit('resize', this.eventData);
};

/**
 * Grabs the size from the browser window
 *
 * @private
 */
ResizeManager.prototype.getSizeData = function (event) {
    var eventData = {
        originalEvent: event
    };
    if (this.fullscreen) {
        eventData.width = window.innerWidth;
        eventData.height = window.innerHeight;
    } else {
        eventData.width = this.element.clientWidth;
        eventData.height = this.element.clientHeight;
    }
    return eventData;
};

/**
 * Dispatch a resize event for a given display object
 *
 * @param displayObject {PIXI.DisplayObject}
 * @private
 */
ResizeManager.prototype.processResize = function(displayObject) {
    this.dispatchEvent( displayObject, 'resize', this.eventData );
};

/**
 * Dispatches an event on the display object that has resizable set to true
 *
 * @param displayObject The display object in question {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite}
 * @param eventString The name of the event (e.g, resize or orientation) {string}
 * @param eventData The event data object {object}
 * @private
 */
ResizeManager.prototype.dispatchEvent = function (displayObject, eventString, eventData) {
    if (!eventData.stopped) {
        eventData.target = displayObject;
        eventData.type = eventString;

        displayObject.emit(eventString, eventData);

        if (displayObject[eventString]) {
            displayObject[eventString](eventData);
        }
    }
};

/**
 * Traverse through the scene graph to call given function on all displayObjects
 * that are resizable
 *
 * @param displayObject the displayObject that will be resized (recursivly crawls its children)
 * {PIXI.Container|PIXI.Sprite|PIXI.extras.TilingSprite}
 * @param [func] the function that will be called on each resizable object. The displayObject will be passed to the function {Function}
 */
ResizeManager.prototype.processInteractive = function (displayObject, func)
{
    if(!displayObject || !displayObject.visible)
    {
        return false;
    }

    // resize parent first
    if (displayObject.resizable) {
        func(displayObject);
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
};

/**
 * Remove events and listener etc.
 */
ResizeManager.prototype.destroy = function(){
    this.removeEvents();
    this.removeAllListeners();
    this.renderer = null;
    this.eventData = null;
    this.onResize = null;
};

PIXI.WebGLRenderer.registerPlugin('resize', ResizeManager);
PIXI.CanvasRenderer.registerPlugin('resize', ResizeManager);

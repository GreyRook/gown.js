/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 55);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var Button = __webpack_require__(4);

/**
 * Basic button that has a selected state which indicates if the button
 * is pressed or not.
 *
 * @class ToggleButton
 * @extends GOWN.Button
 * @memberof GOWN
 * @constructor
 */
function ToggleButton(theme, skinName) {
    skinName = skinName || ToggleButton.SKIN_NAME;

    /**
     * The valid toggle button states
     *
     * @private
     * @type String[]
     * @default ToggleButton.stateNames
     */
    this._validStates = ToggleButton.stateNames;

    Button.call(this, theme, skinName);

    /**
     * The pressed state of the Button
     *
     * @private
     * @type Boolean
     * @default false
     */
    this._selected = false;
}

ToggleButton.prototype = Object.create( Button.prototype );
ToggleButton.prototype.constructor = ToggleButton;
module.exports = ToggleButton;

/**
 * Dispatched when the button is selected or deselected either
 * programmatically or as a result of user interaction.The value of the
 * <code>selected</code> property indicates whether the button is selected.
 * or not.
 *
 * @static
 * @final
 * @type String
 */
ToggleButton.CHANGE = 'change';

/**
 * Default toggle button skin name
 *
 * @static
 * @final
 * @type String
 */
ToggleButton.SKIN_NAME = 'toggle_button';

/**
 * Selected up state: mouse button is released or finger is removed from the screen + the toggle button is selected
 *
 * @static
 * @final
 * @type String
 */
ToggleButton.SELECTED_UP = 'selected_up';

/**
 * Selected down state: mouse button is pressed or finger touches the screen + the toggle button is selected
 *
 * @static
 * @final
 * @type String
 */
ToggleButton.SELECTED_DOWN = 'selected_down';

/**
 * Selected hover state: mouse pointer hovers over the button + the toggle button is selected
 * (ignored on mobile)
 *
 * @static
 * @final
 * @type String
 */
ToggleButton.SELECTED_HOVER = 'selected_hover';

/**
 * Names of possible states for a toggle button
 *
 * @static
 * @final
 * @type String[]
 * @private
 */
ToggleButton.stateNames = Button.stateNames.concat([
    ToggleButton.SELECTED_UP,
    ToggleButton.SELECTED_DOWN,
    ToggleButton.SELECTED_HOVER]);

/**
 * @private
 */
var originalCurrentState = Object.getOwnPropertyDescriptor(Button.prototype, 'currentState');

/**
 * The current state
 *
 * @name GOWN.ToggleButton#currentState
 * @type String
 */
Object.defineProperty(ToggleButton.prototype, 'currentState',{
    get: function() {
        return this._currentState;
    },
    set: function(value) {
        if (this._selected) {
            value = 'selected_' + value;
        }
        originalCurrentState.set.call(this, value);
    }
});

/**
 * Set the selection state
 *
 * @param selected value of selection {bool}
 * @param [emit] set to true if you want to emit the change signal
 *        (used to prevent infinite loop in ToggleGroup) {bool}
 * @private
 */
ToggleButton.prototype.setSelected = function(selected, emit) {
    var state = this._currentState;
    this.invalidState = this._selected !== selected || this.invalidState;
    if (state.indexOf('selected_') === 0) {
        state = state.substr(9, state.length);
    }
    if (this._selected !== selected) {
        this._selected = selected;
        if (emit) {
            this.emit(ToggleButton.CHANGE, this, selected);
        }
    }
    this._pressed = false; //to prevent toggling on touch/mouse up
    this.currentState = state;
};

/**
 * Indicate if the button is selected (pressed)
 *
 * @name GOWN.ToggleButton#selected
 * @type Boolean
 * @default false
 */
Object.defineProperty(ToggleButton.prototype, 'selected', {
    set: function(selected) {
        this.setSelected(selected, true);
    },
    get: function() {
        return this._selected;
    }
});

/**
 * Toggle the state
 */
ToggleButton.prototype.toggle = function() {
    this.selected = !this._selected;
};

/**
 * @private
 */
ToggleButton.prototype.buttonHandleEvent = Button.prototype.handleEvent;

/**
 * handle the touch/tap event
 *
 * @param type the type of the press/touch. {Object}
 * @protected
 **/
ToggleButton.prototype.handleEvent = function(type) {
    if (!this._enabled) {
        return;
    }
    this.buttonHandleEvent(type);
    if (type === Button.UP && this._over) {
        this.toggle();
    }
};

/**
 * The fallback skin if the other skin does not exist (e.g. if a mobile theme
 * that does not provide a "hover" state is used on a desktop system)
 *
 * @name GOWN.ToggleButton#skinFallback
 * @type String
 */
Object.defineProperty(ToggleButton.prototype, 'skinFallback', {
    get: function() {
        var selected = '';
        if (this._currentState && this._currentState.indexOf('selected_') === 0) {
            selected = 'selected_';
        }
        return selected + this._skinFallback;
    },
    set: function(value) {
        this._skinFallback = value;
    }
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Shape base class
 *
 * @class Shape
 * @extends PIXI.Graphics
 * @memberof GOWN.shapes
 * @constructor
 * @param color Color of the shape {Number}
 * @param [alpha=1.0] Alpha value of the shape {Number}
 * @param width Width of the shape {Number}
 * @param height Height of the shape {Number}
 */
function Shape(color, alpha, width, height) {
    PIXI.Graphics.call(this);

    /**
     * Color of the shape
     *
     * @private
     * @type Number
     */
    this._color = color;

    /**
     * Alpha value of the shape
     *
     * @private
     * @type Number
     * @default 1.0
     */
    this._alpha = alpha || 1.0;

    /**
     * Width of the shape
     *
     * @private
     * @type Number
     */
    this._width = width;

    /**
     * Height of the shape
     *
     * @private
     * @type Number
     */
    this._height = height;

    /**
     * Alpha value of the border
     *
     * @private
     * @type Number
     * @default 1.0
     */
    this._borderAlpha = 1.0;

    /**
     * Invalidate shape so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalid = true;
}

Shape.prototype = Object.create( PIXI.Graphics.prototype );
Shape.prototype.constructor = Shape;
module.exports = Shape;

/**
 * The width of the shape, setting this will redraw the component.
 *
 * @name GOWN.shapes.Shape#width
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(width) {
        this._width = width;
        this.invalid = true;
    }
});

/**
 * The height of the shape, setting this will redraw the component.
 *
 * @name GOWN.shapes.Shape#height
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(height) {
        this._height = height;
        this.invalid = true;
    }
});

/**
 * The fill color of the shape, setting this will redraw the component.
 *
 * Setting the color to a negative value or 'null', the shape will not be filled
 * (comes in handy when you only want to draw the border).
 *
 * @name GOWN.shapes.Shape#color
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'color', {
    get: function() {
        return this._color;
    },
    set: function(color) {
        this._color = color;
        this.invalid = true;
    }
});

/**
 * The alpha of the shape, setting this will redraw the component.
 *
 * @name GOWN.shapes.Shape#alpha
 * @type Number
 * @default 1.0
 */
Object.defineProperty(Shape.prototype, 'alpha', {
    get: function() {
        return this._alpha;
    },
    set: function(alpha) {
        this._alpha = alpha;
        this.invalid = true;
    }
});

/**
 * Apply the color to the shape (called during redraw)
 *
 * @private
 */
Shape.prototype.applyColor = function() {
    if (this.color > 0 && typeof this.color !== null) {
        this.beginFill(this.color, this.alpha);
    }
};

/**
 * Apply the border around shape (called during redraw)
 *
 * @private
 */
Shape.prototype.drawBorder = function() {
    if (this.border) {
        this.lineStyle(this.border, this.borderColor, this.borderAlpha);
    }
};

/**
 * Change the border color of shape
 *
 * @property borderColor
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'borderColor', {
    get: function() {
        return this._borderColor;
    },
    set: function(borderColor) {
        this._borderColor = borderColor;
        this.invalid = true;
    }
});

/**
 * Change the border alpha of shape (between 0.0 - 1.0)
 *
 * @property borderAlpha
 * @type Number
 * @default 1.0
 */
Object.defineProperty(Shape.prototype, 'borderAlpha', {
    get: function() {
        return this._borderAlpha;
    },
    set: function(borderAlpha) {
        this._borderAlpha = borderAlpha;
        this.invalid = true;
    }
});

/**
 * Change the border size
 *
 * @property border
 * @type Number
 */
Object.defineProperty(Shape.prototype, 'border', {
    get: function() {
        return this._border;
    },
    set: function(border) {
        this._border = border;
        this.invalid = true;
    }
});

/**
 * Draw the shape during redraw. Defaults to a simple rect.
 *
 * @private
 */
Shape.prototype._drawShape = function() {
    // default shape is a rect
    this.drawRect(
        Math.min(this._width, 0),
        Math.min(this._height, 0),
        Math.abs(this._width),
        Math.abs(this._height));
};

/**
 * PIXI method to update the object transform for rendering
 * Used to call redraw() before rendering
 *
 * @private
 */
Shape.prototype.updateTransform = function() {
    this.redraw();

    PIXI.Graphics.prototype.updateTransform.call(this);
};


/**
 * Update before draw call.
 * Redraw control for current state from theme
 *
 * @private
 */
Shape.prototype.redraw = function() {
    if(!this.invalid) {
        return;
    }

    this.clear();
    this.applyColor();
    this.drawBorder();
    this._drawShape();

    this.invalid = false;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var resizeScaling = __webpack_require__(29);
var mixin = __webpack_require__(27);

/**
 * Base for all UI controls.
 *
 * Based on pixi-DisplayContainer that supports adding children, so all
 * controls are container.
 * @class Control
 * @extends PIXI.Container
 * @memberof GOWN
 * @constructor
 */
function Control() {
    PIXI.Container.call(this);
    this.enabled = this.enabled !== false;
    // assume all controls are interactive
    this.interactive = true;

    this.initResizeScaling();
}

Control.prototype = Object.create( PIXI.Container.prototype );
Control.prototype.constructor = Control;
module.exports = Control;

/**
 * Change the theme (every control can have a theme, even if it does not
 * inherit Skinable, e.g. if there is only some color in the skin that will
 * be taken or if it has some skinable components as children)
 *
 * @param theme the new theme {GOWN.Theme}
 */
Control.prototype.setTheme = function(theme) {
    if (theme === this.theme && theme) {
        return;
    }

    this.theme = theme;
    this.invalidSkin = true;
};

/**
 * @private
 */
Control.prototype.updateTransformContainer = PIXI.Container.prototype.updateTransform;

/**
 * PIXI method to update the object transform for rendering
 * Used to call redraw() before rendering
 *
 * @private
 */
Control.prototype.updateTransform = function() {
    if (!this.parent) {
        return;
    }
    if (this.redraw) {
        this.redraw();
    }
    this.updateTransformContainer();
};

/**
 * Get the local mouse position from PIXI.InteractionData
 *
 * @returns {PIXI.Point}
 */
Control.prototype.mousePos = function(e) {
    return e.data.getLocalPosition(this);
};

/**
 * Enables/Disables the control.
 * (not implemented yet)
 *
 * @name GOWN.Control#enabled
 * @type Boolean
 */
Object.defineProperty(Control.prototype, 'enabled', {
    get: function() {
        return this._enabled;
    },
    set: function(value) {
        this._enabled = value;
    }
});

mixin(Control.prototype, resizeScaling);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var Skinable = __webpack_require__(7);

/**
 * The basic Button with 3 states (up, down and hover) and a label that is
 * centered on it
 *
 * @class Button
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the button {GOWN.Theme}
 * @param [skinName=Button.SKIN_NAME] name of the button skin {String}
 */
function Button(theme, skinName) {
    Skinable.call(this, theme);

    /**
     * The valid button states
     *
     * @private
     * @type String[]
     * @default Button.stateNames
     */
    this._validStates = this._validStates || Button.stateNames;

    /**
     * The skin name
     *
     * @type String
     * @default Button.SKIN_NAME
     */
    this.skinName = skinName || Button.SKIN_NAME;

    this.handleEvent(Button.UP);

    /**
     * Invalidate label when the label text changed
     * so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.updateLabel = true;

    this.on('touchstart', this.onDown, this);
    this.on('mousedown', this.onDown, this);

    this.on('mouseover', this.onHover, this);
    this.on('touchmove', this.onTouchMove, this);
}

Button.prototype = Object.create( Skinable.prototype );
Button.prototype.constructor = Button;
module.exports = Button;

/**
 * Default button skin name
 *
 * @static
 * @final
 * @type String
 */
Button.SKIN_NAME = 'button';

/**
 * Up state: mouse button is released or finger is removed from the screen
 *
 * @static
 * @final
 * @type String
 */
Button.UP = 'up';

/**
 * Down state: mouse button is pressed or finger touches the screen
 *
 * @static
 * @final
 * @type String
 */
Button.DOWN = 'down';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @static
 * @final
 * @type String
 */
Button.HOVER = 'hover';

/**
 * Out state: mouse pointer leaves the button
 * (ignored on mobile)
 *
 * @static
 * @final
 * @type String
 */
Button.OUT = 'out';

/**
 * Names of possible states for a button
 *
 * @static
 * @final
 * @type String[]
 * @private
 */
Button.stateNames = [
    Button.DOWN, Button.HOVER, Button.UP
];

/**
 * Dispatched when the button is triggered.
 *
 * @static
 * @final
 * @type String
 */
Button.TRIGGERED = 'triggered';

/**
 * Initiate all skins first
 * (to prevent flickering)
 *
 * @protected
 */
Button.prototype.preloadSkins = function() {
    if (!this._validStates) {
        return;
    }
    for (var i = 0; i < this._validStates.length; i++) {
        var name = this._validStates[i];
        this.fromSkin(name, this.skinLoaded);
    }
};

/**
 * Skin has been loaded (see preloadSkins) and stored into the skinCache.
 * add to container, hide and resize
 *
 * @param skin the loaded skin
 * @protected
 */
Button.prototype.skinLoaded = function(skin) {
    this.addChildAt(skin, 0);
    skin.alpha = 0.0;
    if (this.width) {
        skin.width = this.width;
    } else if (skin.minWidth) {
        this.width = skin.width = skin.minWidth;
    }
    if (this.height) {
        skin.height = this.height;
    } else if (skin.minHeight) {
        this.height = skin.height = skin.minHeight;
    }
};

/**
 * onDown callback
 *
 * @protected
 */
Button.prototype.onDown = function() {
    this.handleEvent(Button.DOWN);
    this.on('touchend', this.onUp, this);
    this.on('mouseupoutside', this.onUp, this);
    this.on('mouseup', this.onUp, this);

    this.on('touchendoutside', this.onOut, this);
    this.on('mouseout', this.onOut, this);
};

/**
 * onUp callback
 *
 * @protected
 */
Button.prototype.onUp = function() {
    this.handleEvent(Button.UP);
    this.off('touchend', this.onUp, this);
    this.off('mouseupoutside', this.onUp, this);
    this.off('mouseup', this.onUp, this);
};

/**
 * onHover callback
 *
 * @protected
 */
Button.prototype.onHover = function() {
    this.handleEvent(Button.HOVER);
    this.on('touchendoutside', this.onOut, this);
    this.on('mouseout', this.onOut, this);
};

/**
 * onOut callback
 *
 * @protected
 */
Button.prototype.onOut = function() {
    this.handleEvent(Button.OUT);
    this.off('touchendoutside', this.onOut, this);
    this.off('mouseout', this.onOut, this);
};

/**
 * onTouchMove callback
 *
 * @protected
 */
Button.prototype.onTouchMove = function(eventData) {
    // please note that if the user takes his finger from the screen when
    // he is over the button, the button skin for "hovered" will be used.
    // In a mobile UI you might not want to have any hovered skins/use the
    // same skin for "hover" and "up".
    if (eventData.data.target === this) {
        this.handleEvent(Button.HOVER);
    }
};

/**
 * Update width/height of the button
 *
 * @protected
 */
Button.prototype.updateDimensions = function() {
    var width = this.worldWidth;
    var height = this.worldHeight;
    if (this.hitArea) {
        this.hitArea.width = width;
        this.hitArea.height = height;
    } else {
        this.hitArea = new PIXI.Rectangle(0, 0, width, height);
    }
    for (var i = 0; i < this._validStates.length; i++) {
        var name = this._validStates[i];
        var skin = this.skinCache[name];
        if (skin) {
            skin.width = width;
            skin.height = height;
        }
    }

    if(this.labelText) {
        var scaleY = height / this._height;
        var style = this._textStyle || this.theme.textStyle;
        style.fontSize = style.fontSize * scaleY;
        this.labelText.style = style; // trigger setter
        this.updateLabelDimensions();
    }
};

/**
 * Handle one of the mouse/touch events
 *
 * @param type one of the valid states
 * @protected
 */
Button.prototype.handleEvent = function(type) {
    if (!this._enabled) {
        return;
    }
    if (type === Button.DOWN) {
        this.currentState = Button.DOWN;
        // click / touch DOWN so the button is pressed and the pointer has to
        // be over the Button
        this._pressed = true;
        this._over = true;
    } else if (type === Button.UP) {
        this._pressed = false;

        if (this._over) {
            // the user taps or clicks the button
            this.emit(Button.TRIGGERED, this);
            if (this.theme.hoverSkin) {
                this.currentState = Button.HOVER;
            }
        } else {
            // user releases the mouse / touch outside of the button boundaries
            this.currentState = Button.UP;
        }
    } else if (type === Button.HOVER) {
        this._over = true;
        if (this._pressed) {
            this.currentState = Button.DOWN;
        } else if (this.theme.hoverSkin) {
            this.currentState = Button.HOVER;
        }
    } else  { // type === rollout and default
        if (this._over) {
            this._over = false;
        }
        this.currentState = Button.UP;
    }
};

/**
 * @private
 */
// performance increase to avoid using call.. (10x faster)
Button.prototype.redrawSkinable = Skinable.prototype.redraw;

/**
 * Update before draw call (position label)
 *
 * @protected
 */
Button.prototype.redraw = function() {
    if (this.updateLabel) {
        this.createLabel();
    }
    this.redrawSkinable();
};

/**
 * Create/update a label for this button
 *
 * @private
 */
Button.prototype.createLabel = function() {
    if(this.labelText) {
        this.labelText.text = this._label;
        this.labelText.style = this._textStyle || this.theme.textStyle.clone();
    } else {
        this.labelText = new PIXI.Text(
            this._label,
            this._textStyle || this.theme.textStyle.clone());
        this.addChild(this.labelText);
    }
    this.updateLabelDimensions();
    this.updateLabel = false;
};

/**
 * Create/update the position of the label
 *
 * @private
 */
Button.prototype.updateLabelDimensions = function () {
    if (this.labelText && this.labelText.text &&
        (this.worldWidth - this.labelText.width) >= 0 &&
        (this.worldHeight - this.labelText.height) >= 0) {
        this.labelText.x = Math.floor((this.worldWidth - this.labelText.width) / 2);
        this.labelText.y = Math.floor((this.worldHeight - this.labelText.height) / 2);
    }
};

/**
 * @private
 */
Button.prototype.skinableSetTheme = Skinable.prototype.setTheme;

/**
 * Change the theme
 *
 * @param theme the new theme {GOWN.Theme}
 */
Button.prototype.setTheme = function(theme) {
    // this theme has other font or color settings - update the label
    if (this.labelText) {
        this.updateLabel = (this.updateLabel ||
            this.labelText.font !== this.theme.labelFont ||
            this.labelText.color !== this.theme.labelColor );
    }
    this.skinableSetTheme(theme);
};

/**
 * The current state
 *
 * @name GOWN.Button#currentState
 * @type String
 */
Object.defineProperty(Button.prototype, 'currentState',{
    get: function() {
        return this._currentState;
    },
    set: function(value) {
        if (this._currentState === value) {
            return;
        }
        if (this._validStates.indexOf(value) < 0) {
            throw new Error('Invalid state: ' + value + '.');
        }
        this._currentState = value;
        // invalidate state so the next draw call will redraw the control
        this.invalidState = true;
    }
});

/**
 * Create/Update the label of the button.
 *
 * @name GOWN.Button#label
 * @type String
 */
Object.defineProperty(Button.prototype, 'label', {
    get: function() {
        return this._label;
    },
    set: function(label) {
        if(this._label === label) {
            return;
        }
        this._label = label;
        this.updateLabel = true;
    }
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var Skinable = __webpack_require__(7),
    InputWrapper = __webpack_require__(23);

/**
 * InputControl used for TextInput, TextArea and everything else that
 * is capable of entering text
 *
 * roughly based on PIXI.Input InputObject by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class InputControl
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the input control {GOWN.Theme}
 */
function InputControl(theme) {
    Skinable.call(this, theme);

    /**
     * TODO
     *
     * @type bool
     * @default true
     */
    this.receiveKeys = true;

    /**
     * Prevent other interaction (touch/move) on this component
     *
     * @type bool
     * @default false
     */
    this.autoPreventInteraction = false;

    /**
     * Current position of the cursor in the text
     *
     * @type Number
     * @default 0
     * @private
     */
    this.cursorPos = 0;

    /**
     * Character position of selected area in the text (start and end)
     *
     * @type Number[]
     * @default [0, 0]
     * @private
     */
    this.selection = [0, 0];

    /**
     * Character position that marks the beginning of the current selection
     *
     * @type Number
     * @default 0
     * @private
     */
    this.selectionStart = 0;

    /**
     * Text offset
     *
     * @type PIXI.Point
     * @default new PIXI.Point(5, 4)
     * @private
     */
    this.textOffset = new PIXI.Point(5, 4);

    this.text = this.text || '';

    // create DOM Input (if we need one)
    InputWrapper.createInput();

    /**
     * Determine if the input has the focus
     *
     * @type bool
     * @default false
     * @private
     */
    this._hasFocus = false;

    /**
     * Indicates if the mouse button is being pressed
     *
     * @type bool
     * @default false
     * @private
     */
    this._mouseDown = false;

    /**
     * The current state
     *
     * @type String
     * @default InputControl.UP
     * @private
     */
    this._currentState = InputControl.UP;

    /**
     * Timer used to indicate if the cursor is shown
     *
     * @type Number
     * @default 0
     * @private
     */
    this._cursorTimer = 0;

    /**
     * Indicates if the cursor position has changed
     *
     * @type bool
     * @default true
     * @private
     */
    this._cursorNeedsUpdate = true;

    /**
     * Interval for the cursor (in milliseconds)
     *
     * @type Number
     * @default 500
     */
    this.blinkInterval = 500;

    /**
     * Caret/selection sprite
     *
     * @type PIXI.Text
     * @default new PIXI.Text('|', this.cursorStyle)
     * @private
     */
    this.cursor = new PIXI.Text('|', this.cursorStyle);
    if (this.pixiText) {
        this.cursor.y = this.pixiText.y;
    }
    this.addChild(this.cursor);

    /**
     * Text selection background
     *
     * @type PIXI.Graphics
     */
    this.selectionBg = new PIXI.Graphics();
    this.addChildAt(this.selectionBg, 0);

    // TODO: remove events on destroy
    // setup events
    this.on('touchstart', this.onDown, this);
    this.on('mousedown', this.onDown, this);

    // this.on('keydown', this.onKeyDown, this);
    // this.on('keyup', this.onKeyUp, this);
}

InputControl.prototype = Object.create( Skinable.prototype );
InputControl.prototype.constructor = InputControl;
module.exports = InputControl;

/**
 * Up state: mouse button is released or finger is removed from the screen
 *
 * @static
 * @final
 * @type String
 */
InputControl.UP = 'up';

/**
 * Down state: mouse button is pressed or finger touches the screen
 *
 * @static
 * @final
 * @type String
 */
InputControl.DOWN = 'down';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @static
 * @final
 * @type String
 */
InputControl.HOVER = 'hover';

/**
 * Hover state: mouse pointer hovers over the button
 * (ignored on mobile)
 *
 * @static
 * @final
 * @type String
 */
InputControl.OUT = 'out';

/**
 * Names of possible states for an input control
 *
 * @static
 * @final
 * @type String[]
 * @private
 */
InputControl.stateNames = [
    InputControl.DOWN, InputControl.HOVER, InputControl.UP
];

/**
 * Currently selected input control (used for tab index)
 *
 * @static
 * @type GOWN.InputControl
 */
InputControl.currentInput = null;

/**
 * Input changed callback
 *
 * @protected
 */
InputControl.prototype.onInputChanged = function () {
    if (!this.hasFocus) {
        return;
    }

    var text = InputWrapper.getText();

    //overrides the current text with the user input from the InputWrapper
    if(text !== this.text) {
        this.text = text;
    }

    var sel = InputWrapper.getSelection();
    if (this.updateSelection(sel[0], sel[1])) {
        this.cursorPos = sel[0];
    }
    this.setCursorPos();
};

/**
 * Move the cursor left
 */
InputControl.prototype.moveCursorLeft = function() {
    this.cursorPos = Math.max(this.cursorPos-1, 0);
    this._cursorNeedsUpdate = true;
};

/**
 * Move the cursor right
 */
InputControl.prototype.moveCursorRight = function() {
    this.cursorPos = Math.min(this.cursorPos+1, this.text.length);
    this._cursorNeedsUpdate = true;
};

/**
 * Insert a char at the current cursor position
 *
 * @param char The char that gets inserted {String}
 */
InputControl.prototype.insertChar = function(char) {
    if (this.maxChars > 0 && this.pixiText.text >= this.maxChars) {
        this.pixiText.text = this.pixiText.text.substring(0, this.maxChars);
        return;
    }
    this.text = [this.value.slice(0, this.cursorPos), char, this.value.slice(this.cursorPos)].join('');
    this.moveCursorRight();
    this.emit('change', this);
};

/**
 * Delete the selected text
 */
InputControl.prototype.deleteSelection = function() {
    var start = this.selection[0];
    var end = this.selection[1];
    if (start < end) {
        this.cursorPos = start;
        return this.deleteText(start, end);
    } else if (start > end) {
        this.cursorPos = end;
        return this.deleteText(end, start);
    }
    throw new Error('can not delete text! (start & end are the same)');
};

/**
 * Delete text from a start position to an end position
 *
 * @param fromPos start position {Number}
 * @param toPos end position {Number}
 * @returns {String}
 */
InputControl.prototype.deleteText = function(fromPos, toPos) {
    this.text = [this.text.slice(0, fromPos), this.text.slice(toPos)].join('');
    InputWrapper.setText(this.value);
    // InputWrapper.setCursorPos(this.cursorPos);
    this.emit('change', this);
    return this.text;
};

/**
 * @private
 */
InputControl.prototype.skinableSetTheme = Skinable.prototype.setTheme;

/**
 * Change the theme
 *
 * @param theme the new theme {GOWN.Theme}
 */
InputControl.prototype.setTheme = function(theme) {
    if (theme === this.theme || !theme) {
        return;
    }
    this.skinableSetTheme(theme);
    // copy text so we can force wordwrap
    this.style = theme.textStyle;
};

/**
 * Set the input control text.
 *
 * @param text The text to set {String}
 */
InputControl.prototype.setText = function(text) {
    this._displayText = text || '';
    if (!this.pixiText) {
        this.pixiText = new PIXI.Text(text, this.textStyle);
        this.pixiText.position = this.textOffset;
        this.addChild(this.pixiText);
    } else {
        this.pixiText.text = text;
    }
};

/**
 * Set the selected text
 *
 * @param start Start position in the text {Number}
 * @param end End position in the text {Number}
 * @returns {boolean}
 */
InputControl.prototype.updateSelection = function (start, end) {
    if (this.selection[0] !== start || this.selection[1] !== end) {
        this.selection[0] = start;
        this.selection[1] = end;
        this._selectionNeedsUpdate = true;
        InputWrapper.setSelection(this.selection[0], this.selection[1]);
        return true;
    }
    return false;
};

/**
 * Get the width of a text
 *
 * @param text The text to get the width from {String}
 * @returns {Number}
 */
InputControl.prototype.textWidth = function(text) {
    // TODO: support BitmapText for PIXI v3+
    var ctx = this.pixiText.context;
    return ctx.measureText(text || '').width;
};

/**
 * Focus on this input and set it as current
 */
InputControl.prototype.focus = function () {
    // is already current input
    if (GOWN.InputControl.currentInput === this) {
        return;
    }

    // drop focus
    if (GOWN.InputControl.currentInput) {
        GOWN.InputControl.currentInput.blur();
    }

    // set focus
    GOWN.InputControl.currentInput = this;
    this.hasFocus = true;

    // check custom focus event
    this.onfocus();

    this.emit('focusIn', this);

    InputWrapper.focus();

    /*
     //TODO: disable/ is read only
     if(this.readonly) {
        return;
     }
     */
};

/**
 * Blurs the input when the mouse is released outside
 *
 * @protected
 */
InputControl.prototype.onMouseUpOutside = function() {
    if (this.hasFocus && !this._mouseDown) {
        this.blur();
    }
};

/**
 * Callback to execute code on focus
 *
 * @protected
 */
InputControl.prototype.onfocus = function () {
};

/**
 * Blur the text input (remove focus)
 */
InputControl.prototype.blur = function() {
    if (GOWN.InputControl.currentInput === this) {
        GOWN.InputControl.currentInput = null;
        this.hasFocus = false;

        // blur hidden input
        InputWrapper.blur();

        this.onblur();
    }
};

/**
 * Set the cursor position on the text
 */
InputControl.prototype.setCursorPos = function () {
    this.textToPixelPos(this.cursorPos, this.cursor.position);
    this.cursor.position.x += this.pixiText.x;
    this.cursor.position.y += this.pixiText.y;
};

/**
 * Height of the line in pixel
 * (assume that every character of pixi text has the same line height)
 *
 * @returns {Number}
 */
InputControl.prototype.lineHeight = function() {
    var style = this.pixiText._style;
    var lineHeight = style.lineHeight || style.fontSize + style.strokeThickness;
    return lineHeight;
};

/**
 * Draw the cursor
 *
 * @private
 */
InputControl.prototype.drawCursor = function () {
    // TODO: use Tween instead!
    if (this.hasFocus || this._mouseDown) {
        var time = Date.now();

        // blink interval for cursor
        if ((time - this._cursorTimer) >= this.blinkInterval) {
            this._cursorTimer = time;
            this.cursor.visible = !this.cursor.visible;
        }

        // update cursor position
        if (this.cursor.visible && this._cursorNeedsUpdate) {
            this.setCursorPos();
            this._cursorNeedsUpdate = false;
        }
    } else {
        this.cursor.visible = false;
    }
};

/**
 * onMove callback
 *
 * @protected
 */
InputControl.prototype.onMove = function (e) {
    if (this.autoPreventInteraction) {
        e.stopPropagation();
    }

    var mouse = e.data.getLocalPosition(this.pixiText);
    if (!this.hasFocus || !this._mouseDown) { // || !this.containsPoint(mouse)) {
        return false;
    }

    var curPos = this.pixelToTextPos(mouse),
        start = this.selectionStart,
        end = curPos;

    if (this.updateSelection(start, end)) {
        this.cursorPos = curPos;
        this._cursorNeedsUpdate = true;
    }
    return true;
};

/**
 * onDown callback
 *
 * @protected
 */
InputControl.prototype.onDown = function (e) {
    if (this.autoPreventInteraction) {
        e.stopPropagation();
    }

    var mouse = e.data.getLocalPosition(this.pixiText);
    var originalEvent = e.data.originalEvent;
    if (originalEvent.which === 2 || originalEvent.which === 3) {
        originalEvent.preventDefault();
        return false;
    }

    // focus input
    this.focus();

    this._mouseDown = true;

    // start the selection drag if inside the input
    this.selectionStart = this.pixelToTextPos(mouse);
    this.updateSelection(this.selectionStart, this.selectionStart);
    this.cursorPos = this.selectionStart;
    this._cursorNeedsUpdate = true;

    this.on('touchend', this.onUp, this);
    this.on('mouseupoutside', this.onUp, this);
    this.on('mouseup', this.onUp, this);

    this.on('mousemove', this.onMove, this);
    this.on('touchmove', this.onMove, this);

    // update the hidden input
    InputWrapper.setMaxLength(this.maxChars);
    InputWrapper.setText(this.value);
    InputWrapper.setCursorPos(this.cursorPos);

    return true;
};

/**
 * onUp callback
 *
 * @protected
 */
InputControl.prototype.onUp = function (e) {
    if (this.autoPreventInteraction) {
        e.stopPropagation();
    }

    var originalEvent = e.data.originalEvent;
    if (originalEvent.which === 2 || originalEvent.which === 3) {
        originalEvent.preventDefault();
        return false;
    }

    this._mouseDown = false;

    this.off('touchend', this.onUp, this);
    this.off('mouseupoutside', this.onUp, this);
    this.off('mouseup', this.onUp, this);

    this.off('mousemove', this.onMove, this);
    this.off('touchmove', this.onMove, this);

    this.focus();

    // update the hidden input cursor position and selection
    InputWrapper.setCursorPos(this.cursorPos);
    InputWrapper.setSelection(this.selectionStart, this.cursorPos);

    this.selectionStart = -1;

    return true;
};

/**
 * From position in the text to pixel position
 * (for cursor/selection positioning)
 *
 * @param textPos Current character position in the text {Number}
 * @param [position] point that will be set with the pixel position and returned {PIXI.Point}
 * @returns {PIXI.Point} Pixel position
 */
InputControl.prototype.textToPixelPos = function(textPos, position) {
    var lines = this.getLines();
    var x = 0;
    for (var y = 0; y < lines.length; y++) {
        var lineLength = lines[y].length;
        if (lineLength < textPos) {
            textPos -= lineLength + 1;
        } else {
            var text = lines[y];
            x = this.textWidth(text.substring(0, textPos));
            break;
        }
    }

    if (!position) {
        position = new PIXI.Point(x, y * this.lineHeight());
    } else {
        position.x = x;
        position.y = y * this.lineHeight();
    }
    return position;
};

/**
 * From pixel position on the text to character position inside the text
 * (used when clicked on the text)
 *
 * @param pixelPos Pixel position of the mouse on the text
 * @returns {Number} Position in the text
 */
InputControl.prototype.pixelToTextPos = function(pixelPos) {
    var textPos = 0;
    var lines = this.getLines();
    // calculate current line we are in
    var currentLine = Math.min(
        Math.max(
            parseInt(pixelPos.y / this.lineHeight()),
            0),
        lines.length - 1);
    // sum all characters of previous lines
    for (var i = 0; i < currentLine; i++) {
        textPos += lines[i].length + 1;
    }

    var displayText = lines[currentLine];
    var totalWidth = 0;
    if (pixelPos.x < this.textWidth(displayText)) {
        // loop through each character to identify the position
        for (i = 0; i < displayText.length; i++) {
            totalWidth += this.textWidth(displayText[i]);
            if (totalWidth >= pixelPos.x) {
                textPos += i;
                break;
            }
        }
    } else {
        textPos += displayText.length;
    }
    return textPos;
};

/**
 * Callback that will be executed once the text input is blurred
 *
 * @protected
 */
InputControl.prototype.onblur = function() {
    this.updateSelection(0, 0);
    this.emit('focusOut', this);
};

/**
 * @private
 */
// performance increase to avoid using call.. (10x faster)
InputControl.prototype.redrawSkinable = Skinable.prototype.redraw;

/**
 * Update before draw call (draw cursor and selection)
 *
 * @protected
 */
InputControl.prototype.redraw = function () {
    if (this.drawCursor) {
        this.drawCursor();
    }
    if (this._selectionNeedsUpdate) {
        this.updateSelectionBg();
    }
    this.redrawSkinable();
};

/**
 * Set the text that is shown inside the input field.
 * Calls onTextChange callback if text changes.
 *
 * @name GOWN.InputControl#text
 * @type String
 * @default ''
 */
Object.defineProperty(InputControl.prototype, 'text', {
    get: function () {
        if (this.pixiText) {
            return this.pixiText.text;
        }
        return this._origText;
    },
    set: function (text) {
        text += ''; // add '' to assure text is parsed as string

        if (this.maxChars > 0 && text.length > this.maxChars) {
            //reset hidden input to previous state
            InputWrapper.setText(this._origText);
            InputWrapper.setSelection(this.selection[0], this.selection[1]);
            return;
        }

        if (this._origText === text) {
            // return if text has not changed
            return;
        }
        this._origText = text;
        this.setText(text);

        // reposition cursor
        this._cursorNeedsUpdate = true;
    }
});

/**
 * The maximum number of characters that may be entered. If 0,
 * any number of characters may be entered.
 * (same as maxLength for DOM inputs)
 *
 * @name GOWN.InputControl#maxChars
 * @type String
 * @default 0
 */
Object.defineProperty(InputControl.prototype, 'maxChars', {
    get: function () {
        return this._maxChars;
    },
    set: function (value) {
        if (this._maxChars === value) {
            return;
        }
        if (this.pixiText.text > value) {
            this.pixiText.text = this.pixiText.text.substring(0, value);
            if (this.cursorPos > value) {
                this.cursorPos = value;
                this._cursorNeedsUpdate = true;
            }
            this.updateSelection(
                Math.max(this.selection[0], value),
                Math.max(this.selection[1], value)
            );
        }
        this._maxChars = value;
        InputWrapper.setMaxLength(value);

    }
});

Object.defineProperty(InputControl.prototype, 'value', {
    get: function() {
        return this._origText;
    }
});

/**
 * Determine if the input has the focus
 *
 * @name GOWN.InputControl#hasFocus
 * @type bool
 * @default false
 */
Object.defineProperty(InputControl.prototype, 'hasFocus', {
    get: function() {
        return this._hasFocus;
    },
    set: function(focus) {
        this._hasFocus = focus;
    }
});

/**
 * Set the text style (size, font etc.) for text and cursor
 *
 * @name GOWN.InputControl#style
 * @type PIXI.TextStyle
 */
Object.defineProperty(InputControl.prototype, 'style', {
    get: function() {
        return this.textStyle;
    },
    set: function(style) {
        this.cursorStyle = style;
        if (this.cursor) {
            this.cursor.style = style;
        }
        this.textStyle = style;
        if (this.pixiText) {
            this.pixiText.style = style;
            this._cursorNeedsUpdate = true;
        }
        this._cursorNeedsUpdate = true;
    }
});

/**
 * The current state
 * TODO: move to skinable?
 *
 * @name GOWN.InputControl#currentState
 * @type String
 * @default InputControl.UP
 */
Object.defineProperty(InputControl.prototype, 'currentState',{
    get: function() {
        return this._currentState;
    },
    set: function(value) {
        if (this._currentState === value) {
            return;
        }
        if (this._validStates.indexOf(value) < 0) {
            throw new Error('Invalid state: ' + value + '.');
        }
        this._currentState = value;
        // invalidate state so the next draw call will redraw the control
        this.invalidState = true;
    }
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Skinable = __webpack_require__(7),
    ScrollThumb = __webpack_require__(17),
    SliderData = __webpack_require__(25);

/**
 * A scrollabe control provides a thumb that can be be moved along a fixed track.
 * This is the common ground for ScrollBar and Slider
 *
 * @class Scrollable
 * @extends GOWN.Skinable
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the radio button {GOWN.Theme}
 */
// TODO: remove setting value (value manipulation is for Slider only)
function Scrollable(theme) {
    /**
     * The scrollable mode
     *
     * @type String
     * @default Scrollable.DESKTOP_MODE
     */
    this.mode = this.mode || Scrollable.DESKTOP_MODE;

    Skinable.call(this, theme);

    /**
     * The scrollable direction
     *
     * @type String
     * @default Scrollable.HORIZONTAL
     */
    this.direction = this.direction || Scrollable.HORIZONTAL;

    /**
     * Invalidate track so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidTrack = true;

    /**
     * Inverse the progress bar
     *
     * @private
     * @type bool
     * @default false
     */
    this._inverse = false;

    /**
     * Point where the mouse hit the scrollable
     *
     * @private
     * @type Number[]
     * @default null
     */
    this._start = null;

    /**
     * The minimum
     *
     * @private
     * @type Number
     * @default 0
     */
    this._minimum = this._minimum || 0;

    /**
     * The maximum
     *
     * @private
     * @type Number
     * @default 100
     */
    this._maximum = this._maximum || 100;

    /**
     * Step size (not implemented yet)
     *
     * @private
     * @type Number
     * @default 1
     */
    this.step = this.step || 1; //TODO: implement me!

    /**
     * Pagination jump (not implemented yet)
     *
     * @private
     * @type Number
     * @default 10
     */
    this.page = this.page || 10; //TODO: implement me!

    /**
     * Value
     *
     * @private
     * @type Number
     * @default 0
     */
    this._value = this.minimum;

    /**
     * Number of pixels you scroll at a time (if the event delta is 1 / -1)
     *
     * @type Number
     * @default 10
     */
    this.scrolldelta = 10;

    this.on('touchstart', this.handleDown, this);
    this.on('mousedown', this.handleDown, this);

    this.on('touchend', this.handleUp, this);
    this.on('touchendoutside', this.handleUp, this);
    this.on('mouseupoutside', this.handleUp, this);
    this.on('mouseup', this.handleUp, this);

    /**
     * Invalidate thumb factory so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.thumbFactoryInvalid = true;
}

Scrollable.prototype = Object.create( Skinable.prototype );
Scrollable.prototype.constructor = Scrollable;
module.exports = Scrollable;

/**
 * In desktop mode mouse wheel support is added (default)
 *
 * @static
 * @final
 * @type String
 */
Scrollable.DESKTOP_MODE = 'desktop';

/**
 * In mobile mode mouse wheel support is disabled
 *
 * @static
 * @final
 * @type String
 */
Scrollable.MOBILE_MODE = 'mobile';

/**
 * Show horizontal scrollbar/slider
 *
 * @static
 * @final
 * @type String
 */
Scrollable.HORIZONTAL = 'horizontal';

/**
 * Show vertical scrollbar/slider
 *
 * @static
 * @final
 * @type String
 */
Scrollable.VERTICAL = 'vertical';

/**
 * Create the thumb
 *
 * @private
 */
Scrollable.prototype.createThumb = function() {
    this._thumbFactory = this._thumbFactory || this.defaultThumbFactory;
    this.thumb = this._thumbFactory();
    this.addChild(this.thumb);
    this.positionThumb(this.value);
};

/**
 * A function that is expected to return a new GOWN.ScrollThumb
 *
 * @returns {ScrollThumb}
 * @private
 */
Scrollable.prototype.defaultThumbFactory = function() {
    return new ScrollThumb(this, this.theme);
};

/**
 * Scroll to a specific position (not implemented yet)
 */
Scrollable.prototype.scrollToPosition = function() {
};

/**
 * Handle mouse down/touch start.
 * Move scroll thumb.
 *
 * @param mouseData mouse data provided by PIXI
 * @protected
 */
Scrollable.prototype.handleDown = function(mouseData) {
    var local = mouseData.data.getLocalPosition(this);
    var center = {
        x: local.x - this.thumb.width / 2,
        y: local.y - this.thumb.height / 2
    };
    if (mouseData.target === this &&
        this.moveThumb(center.x, center.y)) {
        this._start = [local.x, local.y];
        this.thumbMoved(center.x, center.y);
    }
};

/**
 * @private
 */
Scrollable.prototype.decrement = function() {
  this.value -= this._step;
};

/**
 * @private
 */
Scrollable.prototype.increment = function() {
  this.value += this._step;
};

/**
 * Handle mouse up/touch end
 *
 * @protected
 */
Scrollable.prototype.handleUp = function() {
    this._start = null;
};

/**
 * Handle mouse move. Moves the thumb.
 *
 * @param mouseData mouse data provided by PIXI
 * @protected
 */
Scrollable.prototype.handleMove = function(mouseData) {
    if (this._start) {
        var local = mouseData.data.getLocalPosition(this);
        var x = this.thumb.x + local.x - this._start[0];
        var y = this.thumb.y + local.y - this._start[1];
        if (this.moveThumb(x, y)) {
            // do not override localX/localY in start
            // if we do not move the thumb
            this.thumbMoved(x, y);
            this._start[0] = local.x;
            this._start[1] = local.y;
        }
    }
};

/**
 * Handle mouse wheel. Moves thumb on track.
 *
 * @param event mouse wheel event from browser
 * @protected
 */
Scrollable.prototype.handleWheel = function (event) {
    var x = this.thumb.x - event.delta * this.scrolldelta;
    var y = this.thumb.y - event.delta * this.scrolldelta;
    if (this.moveThumb(x, y)) {
        this.thumbMoved(x, y);
    }
};

/**
 * Thumb has new x/y position
 *
 * @param x x-position that has been scrolled to (ignored when vertical) {Number}
 * @param y y-position that has been scrolled to (ignored when horizontal) {Number}
 */
Scrollable.prototype.thumbMoved = function(x, y) {
    var pos = this.direction === Scrollable.HORIZONTAL ? x : y;
    this.value = this.pixelToValue(pos);
};

/**
 * Show the progress skin from the start/end of the scroll track to the current
 * position of the thumb.
 *
 * @private
 */
Scrollable.prototype._updateProgressSkin = function() {
    if (!this.progressSkin) {
        return;
    }
    if(this.direction === Scrollable.HORIZONTAL) {
        var progressPosX = this.thumb.x + this.thumb.width / 2;
        if (this.inverse) {
            this.progressSkin.x = progressPosX;
            this.progressSkin.width = this.width - progressPosX;
            this.progressSkin.height = this.skin.height;
        } else {
            this.progressSkin.x = 0;
            this.progressSkin.width = progressPosX;
            this.progressSkin.height = this.skin.height;
        }
    } else {
        var progressPosY = this.thumb.y + this.thumb.height / 2;
        if (this.inverse) {
            this.progressSkin.y = progressPosY;
            this.progressSkin.height = this.height - progressPosY;
            this.progressSkin.width = this.skin.width;
        } else {
            this.progressSkin.y = 0;
            this.progressSkin.height =progressPosY;
            this.progressSkin.width = this.skin.width;
        }
    }
};

/**
 * Returns the max. width in pixel
 * (normally this.width - thumb width)
 *
 * @returns {Number}
 */
Scrollable.prototype.maxWidth = function() {
    return this.width - this.thumb.width;
};

/**
 * Returns the max. height in pixel
 * (normally this.height - thumb height)
 *
 * @returns {Number}
 */
Scrollable.prototype.maxHeight = function() {
    return this.height - this.thumb.height;
};

/**
 * Move the thumb on the scroll bar within its bounds
 *
 * @param x New x position of the thumb {Number}
 * @param y New y position of the thumb {Number}
 * @returns {boolean} Returns true if the position of the thumb has been
 * moved
 */
Scrollable.prototype.moveThumb = function(x, y) {
    if (this.thumb.move(x, y)) {
        this._updateProgressSkin();
        return true;
    }
    return false;
};

/**
 * Show scroll track
 *
 * @param skin The track skin {PIXI.DisplayObject}
 * @private
 */
Scrollable.prototype.showTrack = function(skin) {
    if (this.skin !== skin) {
        if(this.skin) {
            this.removeChild(this.skin);
        }

        this.addChildAt(skin, 0);
        this.skin = skin;
        if (this.progressSkin) {
            this._updateProgressSkin();
        }
    }
};

/**
 * Show progress on track (from the start/end of the track to the
 * current position of the thumb)
 *
 * @param skin The progress skin {PIXI.DisplayObject}
 * @private
 */
Scrollable.prototype.showProgress = function(skin) {
    if (this.progressSkin !== skin) {
        if(this.progressSkin) {
            this.removeChild(this.progressSkin);
        }
        skin.width = skin.height = 0;
        this.addChildAt(skin, 0);
        this.progressSkin = skin;
        if (this.skin) {
            this._updateProgressSkin();
        }
    }
};

/**
 * Update before draw call. Redraw track and progressbar and create thumb.
 *
 * @protected
 */
Scrollable.prototype.redraw = function() {
    if (this.thumbFactoryInvalid) {
        this.createThumb();
        this.thumbFactoryInvalid = false;
    }
    if (this.invalidTrack) {
        this.fromSkin(this.direction+'_progress', this.showProgress);
        this.fromSkin(this.direction+'_track', this.showTrack);
        if (this.skin) {
            if (this.direction === Scrollable.HORIZONTAL) {
                this.skin.width = this.width;
            } else {
                this.skin.height = this.height;
            }
            this.invalidTrack = false;
        }
    }
};

/**
 * Calculate value of slider based on the current pixel position of the thumb
 *
 * @param position current pixel position of the thumb {Number}
 * @returns {Number} Value between minimum and maximum
 */
Scrollable.prototype.pixelToValue = function(position) {
    var max = 0;
    if (this.direction === Scrollable.HORIZONTAL) {
        max = this.maxWidth();
    } else {
        max = this.maxHeight();
    }
    if (this._inverse) {
        position = max - position;
    }
    return position / max * (this.maximum - this.minimum) + this.minimum;
};

/**
 * Calculate current pixel position of thumb based on given value
 *
 * @param value The value of the thumb position {Number}
 * @returns {Number} Position of the scroll thumb in pixel
 */
Scrollable.prototype.valueToPixel = function(value) {
    var max = 0;
    if (this.direction === Scrollable.HORIZONTAL) {
        max = this.maxWidth();
    } else {
        max = this.maxHeight();
    }
    var position = (value - this.minimum) / (this.maximum - this.minimum) * max;
    if (this._inverse) {
        position = max - position;
    }
    return position;
};

/**
 * Position the thumb to a given value
 *
 * @param value The value to which the thumb gets moved {Number}
 */
Scrollable.prototype.positionThumb = function(value) {
    if (this.thumb) {
        var pos = this.valueToPixel(value);
        if (this.direction === Scrollable.HORIZONTAL) {
            this.moveThumb(pos, 0);
        } else {
            this.moveThumb(0, pos);
        }
    }
};

/**
 * The width of the Scrollable, setting this will redraw the track and thumb.
 *
 * @name GOWN.Scrollable#width
 * @type Number
 */
Object.defineProperty(Scrollable.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(width) {
        this._width = width;
        this.invalidTrack = true;
        if (this.thumb) {
            this.thumb.invalidTrack = true;
        }
    }
});

/**
 * Inverse the progress bar
 *
 * @name GOWN.Scrollable#inverse
 * @type Boolean
 */
Object.defineProperty(Scrollable.prototype, 'inverse', {
    get: function() {
        return this._inverse;
    },
    set: function(inverse) {
        if (inverse !== this._inverse) {
            this._inverse = inverse;

            if (this.direction === Scrollable.HORIZONTAL) {
                this.moveThumb(this.width - this.thumb.x, 0);
            } else {
                this.moveThumb(0, this.height - this.thumb.y);
            }

            this.invalidTrack = true;
            if (this.thumb) {
                this.thumb.invalidTrack = true;
            }
        }
    }
});

/**
 * The height of the Scrollable, setting this will redraw the track and thumb.
 *
 * @name GOWN.Scrollable#height
 * @type Number
 */
Object.defineProperty(Scrollable.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(height) {
        this._height = height;
        this.invalidTrack = true;
        if (this.thumb) {
            this.thumb.invalidTrack = true;
        }
    }
});

/**
 * Set value (between minimum and maximum)
 *
 * @name GOWN.Scrollable#value
 * @type Number
 * @default 0
 */
Object.defineProperty(Scrollable.prototype, 'value', {
    get: function() {
        return this._value;
    },
    set: function(value) {
        if (isNaN(value)) {
            return;
        }
        value = Math.min(value, this.maximum);
        value = Math.max(value, this.minimum);
        if (this._value === value) {
            return;
        }

        // inform system that value has been changed
        var sliderData = new SliderData();
        sliderData.value = value;
        sliderData.target = this;
        if (this.change) {
            this.change(sliderData);
        }
        this.emit('change', sliderData, this);

        // move thumb
        this.positionThumb(value);

        this._value = value;
    }
});

/**
 * Set minimum and update value if necessary
 *
 * @name GOWN.Scrollable#minimum
 * @type Number
 * @default 0
 */
Object.defineProperty(Scrollable.prototype, 'minimum', {
    get: function() {
        return this._minimum;
    },
    set: function(minimum) {
        if(!isNaN(minimum) && this.minimum !== minimum && minimum < this.maximum) {
            this._minimum = minimum;
        }
        if (this._value < this.minimum) {
            this.value = this._value;
        }
    }
});

/**
 * Set maximum and update value if necessary
 *
 * @name GOWN.Scrollable#maximum
 * @type Number
 * @default 100
 */
Object.defineProperty(Scrollable.prototype, 'maximum', {
    get: function() {
        return this._maximum;
    },
    set: function(maximum) {
        if(!isNaN(maximum) && this.maximum !== maximum && maximum > this.minimum) {
            this._maximum = maximum;
        }
        if (this._value > this.maximum) {
            this.value = maximum;
        }
    }
});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var Control = __webpack_require__(2);

/**
 * Control with a managed skin
 * (e.g. a button that has different skins for up/hover/down states)
 *
 * @class Skinable
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 * @param [theme=GOWN.theme] theme for the skinable {GOWN.Theme}
 */
function Skinable(theme) {
    Control.call(this);

    /**
     * The skin cache
     *
     * @private
     * @type Object
     * @default {}
     */
    this.skinCache = {};

    this.setTheme(theme || GOWN.theme);

    if (this.theme === undefined) {
        throw new Error('you need to define a theme first');
    }

    /**
     * Invalidate state so the control will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidState = true; // draw for the first time

    /**
     * Overwrite skin values before next draw call.
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidSkinData = true;

    /**
     * Will destroy the skin cache when the skinable gets destroyed
     *
     * @type bool
     * @default true
     */
    this.allowDestroyCache = true;

    /**
     * The fallback skin if the other skin does not exist (e.g. if a mobile theme
     * that does not provide a "hover" state is used on a desktop system)
     * (normally the default "up"-state skin)
     *
     * @type String
     * @default 'up'
     * @private
     */
    this._skinFallback = 'up';
}

Skinable.prototype = Object.create( Control.prototype );
Skinable.prototype.constructor = Skinable;
module.exports = Skinable;

/**
 * @private
 */
Skinable.prototype.controlSetTheme = Control.prototype.setTheme;

/**
 * Change the theme
 *
 * @param theme the new theme {GOWN.Theme}
 */
Skinable.prototype.setTheme = function(theme) {
    if (theme === this.theme || !theme) {
        return;
    }

    this.controlSetTheme(theme);
    this.preloadSkins();
    // force states to redraw
    this.invalidState = true;
};

/**
 * Overwrite data from theme for this specific component.
 * (usable if you want to change e.g. background color based on selected items)
 *
 * @param data updated skin data
 */
Skinable.prototype.updateTheme = function(data) {
    this.skinData = data;
    this.invalidSkinData = true;
};

/**
 * Remove old skin and add new one
 *
 * @param skin {DisplayObject}
 */
Skinable.prototype.changeSkin = function(skin) {
    if (this._currentSkin !== skin) {
        this._lastSkin = this._currentSkin;
        this.addChildAt(skin, 0);
        skin.alpha = 1.0;
        this._currentSkin = skin;

    }
    this.invalidState = false;
};

/**
 * Initiate all skins first
 */
Skinable.prototype.preloadSkins = function() {
};

/**
 * Get image from skin (will execute a callback with the loaded skin
 * when it is loaded or call it directly when it already is loaded)
 *
 * @param name name of the state {String}
 * @param callback callback that is executed if the skin is loaded {function}
 */
Skinable.prototype.fromSkin = function(name, callback) {
    var skin;
    if (this.skinCache[name]) {
        skin = this.skinCache[name];
    } else {
        skin = this.theme.getSkin(this.skinName, name);
        this.skinCache[name] = skin;
    }
    if (skin) {
        callback.call(this, skin);
    } else if (this.skinFallback && this.skinFallback !== name) {
        skin = this.fromSkin(this.skinFallback, callback);
    }
    return skin;
};

/**
 * Empty skin cache and load skins again
 *
 * @private
 */
Skinable.prototype.reloadSkin = function() {
    for (var name in this.skinCache) {
        var skin = this.skinCache[name];
        if (skin && skin.destroy && this.allowDestroyCache) {
            skin.destroy();
        }
    }
    for (name in this.skinCache) {
        delete this.skinCache[name];
    }
    this.skinCache = {};
    if (this.preloadSkins) {
        this.preloadSkins();
    }
    this.invalidState = true;
};

/**
 * Change the skin name.
 * You normally set the skin name as constant in your control, but if you
 * want you can set another skin name to change skins for single components
 * at runtime.
 *
 * @name GOWN.Skinable#skinName
 * @type String
 */
Object.defineProperty(Skinable.prototype, 'skinName', {
    get: function() {
        return this._skinName;
    },
    set: function(value) {
        if ( this._skinName === value ) {
            return;
        }
        this._skinName = value;
        this.reloadSkin();
        this.invalidState = true;
    }
});

/**
 * The fallback skin if the other skin does not exist (e.g. if a mobile theme
 * that does not provide a "hover" state is used on a desktop system)
 * (normally the default "up"-state skin)
 *
 * @name GOWN.Skinable#skinFallback
 * @type String
 * @default 'up'
 */
Object.defineProperty(Skinable.prototype, 'skinFallback', {
    get: function() {
        return this._skinFallback;
    },
    set: function(value) {
        this._skinFallback = value;
    }
});

/**
 * @private
 */
Skinable.prototype.containerDestroy = PIXI.Container.prototype.destroy;

/**
 * Destroy the Skinable and empty the skin cache
 */
Skinable.prototype.destroy = function() {
    for (var name in this.skinCache) {
        var skin = this.skinCache[name];
        if (skin && skin.destroy && this.allowDestroyCache) {
            skin.destroy();
        }
    }
    this._currentSkin = null;
    this.containerDestroy();
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Rounds a number to a certain level of precision. Useful for limiting the number of
 * decimal places on a fractional number.
 *
 * @see Math#round
 *
 * @function GOWN.utils.roundToPrecision
 * @param number The input number to round {Number}
 * @param precision The number of decimal digits to keep {Number}
 * @return {Number} The rounded number, or the original input if no rounding is needed
 */
module.exports = function(number, precision) {
    precision = precision || 0;
    var decimalPlaces = Math.pow(10, precision);
	return Math.round(decimalPlaces * number) / decimalPlaces;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var Control = __webpack_require__(2),
    Tween = __webpack_require__(26),
    Scrollable = __webpack_require__(6),
    ScrollBar = __webpack_require__(16);
// LayoutAlignment = require('../../external/pixi-layout/src/layout/LayoutAlignment');

/**
 * Allows horizontal and vertical scrolling of a view port.
 * Not meant to be used as a standalone container or component.
 * Generally meant to be the super class of another component that needs to
 * support scrolling.
 * To put components in a generic scrollable container (with optional layout),
 * see ScrollContainer. To scroll long passages of text, see ScrollText.
 *
 * @class Scroller
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 */
function Scroller(theme) {
    Control.call(this);
    this.setTheme(theme);
    this.interactive = true;

    /**
     * use mask to clip content
     */
    this._clipContent = true;

    /**
     * offsets for the mask of the viewport
     * (see this._viewport.mask)
     */
    this._viewPortOffset = {left: 0, right: 0, top: 0, bottom: 0};

    /**
     * scroll policy for vertical and horizontal ScrollBar
     * (translates to x/y position of the viewport and scroll positions)
     */
    this._verticalScrollPolicy = Scroller.SCROLL_POLICY_AUTO;
    this._horizontalScrollPolicy = Scroller.SCROLL_POLICY_AUTO;

    /**
     * the default interaction mode is drag-and-drop OR use the scrollbars
     */
    this._interactionMode = Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS;

    /**
     * start touch/mouse position
     * (changed on touchstart/mousedown)
     */
    this._startTouch = new PIXI.Point(0, 0);

    /**
     * calculated horizontal and vertical scroll positions
     */
    this._scrollPosition = new PIXI.Point(0, 0);

    /**
     * scroll positions at the start of an interaction
     * (changed on touchstart/mousedown)
     */
    this._startScrollPosition = new PIXI.Point(0, 0);

    // mouse/ouch has to be moved at least this many pixel to be a valid drag.
    this.minimumDragDistance = 3;

    /**
     * add events
     */
    this.refreshInteractionModeEvents();

    /**
     * scrollInvalid will force viewport to set its x/y position
     * according to horizontal/vertical Scroll Position next redraw
     */
    this.scrollInvalid = false;

    this.scrollBarInvalid = false;

    this.mask = undefined;
    this.enabled = true;
    this.horizontalScrollBarStyleName = Scroller.DEFAULT_CHILD_STYLE_NAME_HORIZONTAL_SCROLL_BAR;
    this.verticalScrollBarStyleName = Scroller.DEFAULT_CHILD_STYLE_NAME_VERTICAL_SCROLL_BAR;
    this._hasHorizontalScrollBar = false;
    this._hasVerticalScrollBar = false;
    this._touchPointID = -1;
    this._isDraggingHorizontally = false;
    this._isDraggingVertically = false;
    this._measureViewPort = true;
    this._snapToPages = false;
    this._horizontalScrollBarFactory = this._verticalScrollBarFactory = this.defaultScrollBarFactory;
    this._horizontalScrollPosition = 0;
    this._minHorizontalScrollPosition = 0;
    this._maxHorizontalScrollPosition = 0;
    this._horizontalPageIndex = 0;
    this._minHorizontalPageIndex = 0;
    this.actualVerticalScrollStep = 1;
    this.explicitVerticalScrollStep = NaN;
    this._verticalScrollPosition = 0;
    this._minVerticalScrollPosition = 0;
    this._maxVerticalScrollPosition = 0;
    this._verticalPageIndex = 0;
    this._minVerticalPageIndex = 0;
    this.actualPageWidth = 0;
    this.explicitPageWidth = NaN;
    this.actualPageHeight = 0;
    this.explicitPageHeight = NaN;
    this._paddingTop = 0;
    this._elasticSnapDuration = 0.5;
    this._isScrolling = false;
    this._isScrollingStopped = false;
    this.pendingHorizontalScrollPosition = NaN;
    this.pendingVerticalScrollPosition = NaN;
    this.hasPendingHorizontalPageIndex = false;
    this.hasPendingVerticalPageIndex = false;
    this._pageThrowDuration = 0.5;
}

Scroller.prototype = Object.create(Control.prototype);
Scroller.prototype.constructor = Scroller;
module.exports = Scroller;

/**
 * The scroller may scroll if the view port is larger than the
 * scroller's bounds. Only than the scroll bar will be visible.
 */
Scroller.SCROLL_POLICY_AUTO = 'auto';

/**
 * The scroller will always scroll, the scroll bar will always be visible.
 */
Scroller.SCROLL_POLICY_ON = 'on';

/**
 * The scroller does not scroll at all, the scroll bar will never be visible.
 */
Scroller.SCROLL_POLICY_OFF = 'off';

/**
 * The user may touch anywhere on the scroller and drag to scroll. The
 * scroll bars will be visual indicator of position, but they will not
 * be interactive.
 */
Scroller.INTERACTION_TOUCH = 'touch';

/**
 * Allow touch and use the Scrollbars
 */
Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS = 'touchAndScrollBars';

/**
 * The user may only interact with the scroll bars to scroll.
 */
Scroller.INTERACTION_MOUSE = Scroller.INTERACTION_SCROLL_BARS = 'scrollBars';

Scroller.HELPER_POINT = new PIXI.Point(0, 0);
Scroller.INVALIDATION_FLAG_SCROLL_BAR_RENDERER = 'scrollBarRenderer';
Scroller.INVALIDATION_FLAG_PENDING_SCROLL = 'pendingScroll';
Scroller.INVALIDATION_FLAG_PENDING_REVEAL_SCROLL_BARS = 'pendingRevealScrollBars';
Scroller.SCROLL_BAR_DISPLAY_MODE_FLOAT = 'float';
Scroller.SCROLL_BAR_DISPLAY_MODE_FIXED = 'fixed';
Scroller.SCROLL_BAR_DISPLAY_MODE_FIXED_FLOAT = 'fixedFloat';
Scroller.SCROLL_BAR_DISPLAY_MODE_NONE = 'none';
Scroller.VERTICAL_SCROLL_BAR_POSITION_RIGHT = 'right';
Scroller.VERTICAL_SCROLL_BAR_POSITION_LEFT = 'left';
Scroller.INTERACTION_MODE_TOUCH = 'touch';
Scroller.INTERACTION_MODE_MOUSE = 'mouse';
Scroller.INTERACTION_MODE_TOUCH_AND_SCROLL_BARS = 'touchAndScrollBars';
Scroller.MOUSE_WHEEL_SCROLL_DIRECTION_VERTICAL = 'vertical';
Scroller.MOUSE_WHEEL_SCROLL_DIRECTION_HORIZONTAL = 'horizontal';
Scroller.INVALIDATION_FLAG_CLIPPING = 'clipping';
Scroller.MINIMUM_VELOCITY = 0.02;
Scroller.CURRENT_VELOCITY_WEIGHT = 2.33;
Scroller.VELOCITY_WEIGHTS = [1, 1.33, 1.66, 2];
Scroller.MAXIMUM_SAVED_VELOCITY_COUNT = 4;
Scroller.DECELERATION_RATE_NORMAL = 0.998;
Scroller.DECELERATION_RATE_FAST = 0.99;
// Scroller.DEFAULT_CHILD_STYLE_NAME_HORIZONTAL_SCROLL_BAR = 'scroller-horizontal-scroll-bar';
// Scroller.DEFAULT_CHILD_STYLE_NAME_VERTICAL_SCROLL_BAR = 'scroller-vertical-scroll-bar';
Scroller.FUZZY_PAGE_SIZE_PADDING = 0.000001;
Scroller.PAGE_INDEX_EPSILON = 0.01;

/**
 * change horizontal scroll position.
 * (will update x position of viewport next redraw)
 */
Object.defineProperty(Scroller.prototype, 'horizontalScrollPosition', {
    get: function () {
        return this._scrollPosition.x;
    },
    set: function (value) {
        if (this._scrollPosition.x === value) {
            return;
        }
        this._scrollPosition.x = value;
        this.scrollInvalid = true;
    }
});

/**
 * change vertical scroll position.
 * (will update y position of viewport next redraw)
 */
Object.defineProperty(Scroller.prototype, 'verticalScrollPosition', {
    get: function () {
        return this._scrollPosition.y;
    },
    set: function (value) {
        if (this._scrollPosition.y === value) {
            return;
        }
        this._scrollPosition.y = value;
        this.scrollInvalid = true;
    }
});

/**
 * us a mask to clip content
 */
Object.defineProperty(Scroller.prototype, 'interactionMode', {
    get: function () {
        return this._interactionMode;
    },
    set: function (value) {
        if (this._interactionMode === value) {
            return;
        }
        this._interactionMode = value;
        this.refreshInteractionModeEvents();
    }
});

/**
 * us a mask to clip the content.
 */
Object.defineProperty(Scroller.prototype, 'clipContent', {
    get: function () {
        return this._clipContent;
    },
    set: function (value) {
        if (this._clipContent === value) {
            return;
        }
        this._clipContent = value;
        this.clippingInvalid = true;
    }
});

/**
 * set the viewport. This is the content you'd like to scroll.
 */
Object.defineProperty(Scroller.prototype, 'viewPort', {
    get: function () {
        return this._viewPort;
    },
    set: function (value) {
        if (this._viewPort === value) {
            return;
        }
        this._viewPort = value;
        if (this._viewPort) {
            this.addChildAt(this._viewPort, 0);
        }
        // position according to horizontal/vertical ScrollPosition
        this.scrollInvalid = true;
        this.clippingInvalid = true;
        this.sizeInvalid = true;
    }
});

/**
 * change scrollbar factory
 */
Object.defineProperty(Scroller.prototype, 'horizontalScrollBarFactory', {
    get: function () {
        return this._horizontalScrollBarFactory;
    },
    set: function (value) {
        if (this._horizontalScrollBarFactory === value) {
            return;
        }
        this._horizontalScrollBarFactory = value;
        this.scrollBarInvalid = true;
    }
});

/**
 * change scrollbar factory
 */
Object.defineProperty(Scroller.prototype, 'verticalScrollBarFactory', {
    get: function () {
        return this._verticalScrollBarFactory;
    },
    set: function (value) {
        if (this._verticalScrollBarFactory === value) {
            return;
        }
        this._verticalScrollBarFactory = value;
        this.scrollBarInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'measureViewPort', {
    get: function () {
        return this._measureViewPort;
    },
    set: function (value) {
        if (this._measureViewPort === value) {
            return;
        }
        this._measureViewPort = value;
        this.sizeInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'snapToPages', {
    get: function () {
        return this._snapToPages;
    },
    set: function (value) {
        if (this._snapToPages === value) {
            return;
        }
        this._snapToPages = value;
        this.sizeInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'horizontalScrollStep', {
    get: function () {
        return this._horizontalScrollStep;
    },
    set: function (value) {
        if (this._horizontalScrollStep === value) {
            return;
        }
        this._horizontalScrollStep = value;
        this.scrollInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'horizontalPageIndex', {
    get: function () {
        if (this.hasPendingHorizontalPageIndex) {
            return this.pendingHorizontalPageIndex;
        }
        return this._horizontalPageIndex;
    }
});

Object.defineProperty(Scroller.prototype, 'horizontalScrollPolicy', {
    get: function () {
        return this._horizontalScrollPolicy;
    },
    set: function (value) {
        if (this._horizontalScrollPolicy === value) {
            return;
        }
        this._horizontalScrollPolicy = value;
        this.scrollInvalid = true;
        this.scrollBarInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'verticalScrollStep', {
    get: function () {
        return this.actualVerticalScrollStep;
    },
    set: function (value) {
        if (this.explicitVerticalScrollStep === value) {
            return;
        }
        this.explicitVerticalScrollStep = value;
        this.scrollInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'verticalPageIndex', {
    get: function () {
        if (this.hasPendingVerticalPageIndex) {
            return this.pendingVerticalPageIndex;
        }
        return this._verticalPageIndex;
    }
});

Object.defineProperty(Scroller.prototype, 'verticalScrollPolicy', {
    get: function () {
        if (this.hasPendingVerticalPageIndex) {
            return this.pendingVerticalPageIndex;
        }
        return this._verticalPageIndex;
    },
    set: function (value) {
        if (this._verticalScrollPolicy === value) {
            return;
        }
        this._verticalScrollPolicy = value;
        this.scrollInvalid = true;
        this.scrollBarInvalid = true;
    }
});

Object.defineProperty(Scroller.prototype, 'pageWidth', {
    get: function () {
        return this.actualPageWidth;
    },
    set: function (value) {
        if (this.explicitPageWidth === value) {
            return;
        }
        var valueIsNaN = isNaN(value);
        if (valueIsNaN && this.explicitPageWidth !== this.explicitPageWidth) {
            return;
        }
        this.explicitPageWidth = value;
        if (valueIsNaN) {
            //we need to calculate this value during validation
            this.actualPageWidth = 0;
        } else {
            this.actualPageWidth = this.explicitPageWidth;
        }
    }
});

Object.defineProperty(Scroller.prototype, 'pageHeight', {
    get: function () {
        return this.actualPageHeight;
    },
    set: function (value) {
        if (this.explicitPageHeight === value) {
            return;
        }
        var valueIsNaN = isNaN(value);
        if (valueIsNaN && this.explicitPageHeight !== this.explicitPageHeight) {
            return;
        }
        this.explicitPageHeight = value;
        if (valueIsNaN) {
            //we need to calculate this value during validation
            this.actualPageHeight = 0;
        } else {
            this.actualPageHeight = this.explicitPageHeight;
        }
    }
});

Object.defineProperty(Scroller.prototype, 'padding', {
    get: function () {
        return this._paddingTop;
    },
    set: function (value) {
        this.paddingTop = value;
        this.paddingRight = value;
        this.paddingBottom = value;
        this.paddingLeft = value;
    }
});

Object.defineProperty(Scroller.prototype, 'pageThrowDuration', {
    get: function () {
        return this._pageThrowDuration;
    },
    set: function (value) {
        this._pageThrowDuration = value;
    }
});

Scroller.prototype.scrollToPageIndex = function (horizontalPageIndex, verticalPageIndex, animationDuration) {
    if (isNaN(animationDuration)) {
        animationDuration = this._pageThrowDuration;
    }
    //cancel any pending scroll to a specific scroll position. we can
    //have only one type of pending scroll at a time.
    this.pendingHorizontalScrollPosition = NaN;
    this.pendingVerticalScrollPosition = NaN;
    this.hasPendingHorizontalPageIndex = this._horizontalPageIndex !== horizontalPageIndex;
    this.hasPendingVerticalPageIndex = this._verticalPageIndex !== verticalPageIndex;
    if (!this.hasPendingHorizontalPageIndex && !this.hasPendingVerticalPageIndex) {
        return;
    }
    this.pendingHorizontalPageIndex = horizontalPageIndex;
    this.pendingVerticalPageIndex = verticalPageIndex;
    this.pendingScrollDuration = animationDuration;
};

Scroller.prototype.refreshInteractionModeEvents = function () {
    if (!this.startEventsAdded &&
        (this._interactionMode === Scroller.INTERACTION_TOUCH ||
        this._interactionMode === Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS)) {
        this.on('touchstart', this.onDown, this);
        this.on('mousedown', this.onDown, this);
        this.startEventsAdded = true;
    } else if (this.startEventsAdded &&
        this._interactionMode === Scroller.INTERACTION_SCROLL_BARS) {
        this.off('touchstart', this.onDown, this);
        this.off('mousedown', this.onDown, this);

        if (this.touchMoveEventsAdded) {
            this.off('touchend', this.onUp, this);
            this.off('mouseupoutside', this.onUp, this);
            this.off('mouseup', this.onUp, this);
            this.off('touchendoutside', this.onUp, this);

            // TODO: global move (add events to root element from pixi renderer?)
            this.off('touchmove', this.onMove, this);
            this.off('mousemove', this.onMove, this);
        }
        this.touchMoveEventsAdded = this.startEventsAdded = false;
    }
    // TODO: interactive scrollbars
};

Scroller.prototype.onDown = function (event) {
    this._startTouch = event.data.getLocalPosition(this);
    this._isScrollingStopped = false;

    if (!this.touchMoveEventsAdded) {
        this.on('touchend', this.onUp, this);
        this.on('mouseupoutside', this.onUp, this);
        this.on('mouseup', this.onUp, this);
        this.on('touchendoutside', this.onUp, this);

        this.on('touchmove', this.onMove, this);
        this.on('mousemove', this.onMove, this);
        this.touchMoveEventsAdded = true;
    }

    this._startScrollPosition.x = this._scrollPosition.x;
    this._startScrollPosition.y = this._scrollPosition.y;
};

Scroller.prototype.onUp = function () {
    this._isScrollingStopped = true;
};

Scroller.prototype.onMove = function (event) {
    var pos = event.data.getLocalPosition(this);
    this.checkForDrag(pos);
};

Scroller.prototype.checkForDrag = function (currentTouch) {
    if (this._isScrollingStopped) {
        return;
    }
    var horizontalMoved = Math.abs(currentTouch.x - this._startTouch.x);
    var verticalMoved = Math.abs(currentTouch.y - this._startTouch.y);

    if ((this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_ON ||
        this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_AUTO) &&
        !this._isDraggingHorizontally && horizontalMoved >= this.minimumDragDistance) {
        if (this.horizontalScrollBar) {
            this.revealHorizontalScrollBar();
        }
        this._startTouch.x = currentTouch.x;
        this._startScrollPosition.x = this._scrollPosition.x;
        this._isDraggingHorizontally = true;
        if (!this._isDraggingVertically) {
            this.startScroll();
        }

    }
    if ((this._verticalScrollPolicy === Scroller.SCROLL_POLICY_ON ||
        this._verticalScrollPolicy === Scroller.SCROLL_POLICY_AUTO) &&
        !this._isDraggingVertically && verticalMoved >= this.minimumDragDistance) {
        if (this.verticalScrollBar) {
            this.revealVerticalScrollBar();
        }
        this._startTouch.y = currentTouch.y;
        this._startScrollPosition.y = this._scrollPosition.y;
        this._isDraggingVertically = true;
        if (!this._isDraggingHorizontally) {
            this.startScroll();
        }
    }

    if (this._isDraggingHorizontally && !this._horizontalAutoScrollTween) {
        this.updateHorizontalScrollFromTouchPosition(currentTouch.x);
    }
    if (this._isDraggingVertically && !this._verticalAutoScrollTween) {
        this.updateVerticalScrollFromTouchPosition(currentTouch.y);
    }
};

// performance increase to avoid using call.. (10x faster)
Scroller.prototype.controlRedraw = Control.prototype.redraw;
/**
 * update before draw call
 *

 */
Scroller.prototype.redraw = function () {
    this.scrollBarInvalid = true;
    if (this.scrollBarInvalid) {
        this.createScrollBars();
    }
    if (this.clippingInvalid) {
        this.refreshMask();
    }

    if (this._viewPort && this._viewPort.updateRenderable) {
        this._viewPort.updateRenderable(
            -this._viewPort.x, -this._viewPort.y,
            this.width, this.height);
    }
    this.controlRedraw();
};

Scroller.prototype.updateHorizontalScrollFromTouchPosition = function (touchX, isScrollBar) {
    var offset;
    if (isScrollBar) {
        offset = this._startTouch.x - touchX;
    } else {
        offset = touchX - this._startTouch.x;
    }
    var position = this._startScrollPosition.x + offset;
    if (this.viewPort.width > this.width) {
        position = Math.min(position, 0);
        if (this.viewPort.width && this.viewPort.x < 0) {
            position = Math.max(position, -(this.viewPort.width - this.width));
        }
        this.viewPort.x = Math.floor(position);
    }
    this.horizontalScrollPosition = position;
};

Scroller.prototype.updateVerticalScrollFromTouchPosition = function (touchY, isScrollBar) {
    var offset;
    if (isScrollBar) {
        offset = this._startTouch.y - touchY;
    } else {
        offset = touchY - this._startTouch.y;
    }
    var position = this._startScrollPosition.y + offset;
    if (this.viewPort.height > this.height) {
        position = Math.min(position, 0);
        if (this.viewPort.height && this.viewPort.y < 0) {
            position = Math.max(position, -(this.viewPort.height - this.height));
        }
        this.viewPort.y = Math.floor(position);
    }
    this.verticalScrollPosition = position;
};

Scroller.prototype.startScroll = function () {
    if (this._isScrolling) {
        return;
    }
    this._isScrolling = true;
};

// 3333
Scroller.prototype.stopScrolling = function () {
    if (this._horizontalAutoScrollTween) {
        this._horizontalAutoScrollTween.remove();
        this._horizontalAutoScrollTween = null;
    }
    if (this._verticalAutoScrollTween) {
        this._verticalAutoScrollTween.remove();
        this._verticalAutoScrollTween = null;
    }
    this._isScrollingStopped = true;
    this.hideHorizontalScrollBar();
    this.hideVerticalScrollBar();
};

Scroller.prototype.scrollToPosition = function (horizontalScrollPosition, verticalScrollPosition, animationDuration) {
    if (isNaN(animationDuration)) {
        if (this._useFixedThrowDuration) {
            animationDuration = this._fixedThrowDuration;
        } else {
            Scroller.HELPER_POINT.setTo(horizontalScrollPosition - this._horizontalScrollPosition, verticalScrollPosition - this._verticalScrollPosition);
            animationDuration = this.calculateDynamicThrowDuration(Scroller.HELPER_POINT.length * this._logDecelerationRate + Scroller.MINIMUM_VELOCITY);
        }
    }
    //cancel any pending scroll to a different page. we can have only
    //one type of pending scroll at a time.
    this.hasPendingHorizontalPageIndex = false;
    this.hasPendingVerticalPageIndex = false;
    if (this.pendingHorizontalScrollPosition === horizontalScrollPosition &&
        this.pendingVerticalScrollPosition === verticalScrollPosition &&
        this.pendingScrollDuration === animationDuration) {
        return;
    }
    this.pendingHorizontalScrollPosition = horizontalScrollPosition;
    this.pendingVerticalScrollPosition = verticalScrollPosition;
    this.pendingScrollDuration = animationDuration;
};

Scroller.prototype.handlePendingScroll = function () {
    if (!isNaN(this.pendingHorizontalScrollPosition) || !isNaN(this.pendingVerticalScrollPosition)) {
        this.throwTo(this.pendingHorizontalScrollPosition, this.pendingVerticalScrollPosition, this.pendingScrollDuration);
        this.pendingHorizontalScrollPosition = NaN;
        this.pendingVerticalScrollPosition = NaN;
    }
    if (this.hasPendingHorizontalPageIndex && this.hasPendingVerticalPageIndex) {
        //both
        this.throwToPage(this.pendingHorizontalPageIndex, this.pendingVerticalPageIndex, this.pendingScrollDuration);
    }
    else if (this.hasPendingHorizontalPageIndex) {
        //horizontal only
        this.throwToPage(this.pendingHorizontalPageIndex, this._verticalPageIndex, this.pendingScrollDuration);
    }
    else if (this.hasPendingVerticalPageIndex) {
        //vertical only
        this.throwToPage(this._horizontalPageIndex, this.pendingVerticalPageIndex, this.pendingScrollDuration);
    }
    this.hasPendingHorizontalPageIndex = false;
    this.hasPendingVerticalPageIndex = false;
};

Scroller.prototype.completeScroll = function () {
    if (!this._isScrolling || this._verticalAutoScrollTween || this._horizontalAutoScrollTween ||
        this._isDraggingHorizontally || this._isDraggingVertically) {
        return;
    }
    this._isScrolling = false;
    this.hideHorizontalScrollBar();
    this.hideVerticalScrollBar();
};

Scroller.prototype.refreshEnabled = function () {
    if (this._viewPort) {
        this._viewPort.enabled = this.enabled;
    }
    if (this.horizontalScrollBar) {
        this.horizontalScrollBar.enabled = this.enabled;
    }
    if (this.verticalScrollBar) {
        this.verticalScrollBar.enabled = this.enabled;
    }
};

Scroller.prototype.refreshScrollValues = function () {
    this.refreshScrollSteps();

    var oldMaxHSP = this._maxHorizontalScrollPosition;
    var oldMaxVSP = this._maxVerticalScrollPosition;
    this.refreshMinAndMaxScrollPositions();
    var maximumPositionsChanged = this._maxHorizontalScrollPosition !== oldMaxHSP || this._maxVerticalScrollPosition !== oldMaxVSP;
    if (maximumPositionsChanged && this._touchPointID < 0) {
        this.clampScrollPositions();
    }

    this.refreshPageCount();
    this.refreshPageIndices();
};

Scroller.prototype.refreshPageCount = function () {
    if (this._snapToPages) {
        var horizontalScrollRange = this._maxHorizontalScrollPosition - this._minHorizontalScrollPosition;
        var roundedDownRange;
        if (horizontalScrollRange === Number.POSITIVE_INFINITY) {
            //trying to put positive infinity into an int results in 0
            //so we need a special case to provide a large int value.
            if (this._minHorizontalScrollPosition === Number.NEGATIVE_INFINITY) {
                this._minHorizontalPageIndex = Number.MIN_SAFE_INTEGER;
            } else {
                this._minHorizontalPageIndex = 0;
            }
        } else {
            this._minHorizontalPageIndex = 0;
            //floating point errors could result in the max page index
            //being 1 larger than it should be.
            roundedDownRange =
                Math.floor(horizontalScrollRange / this.actualPageWidth) * this.actualPageWidth;
            if ((horizontalScrollRange - roundedDownRange) < Scroller.FUZZY_PAGE_SIZE_PADDING) {
                horizontalScrollRange = roundedDownRange;
            }
        }

        var verticalScrollRange = this._maxVerticalScrollPosition - this._minVerticalScrollPosition;
        if (verticalScrollRange === Number.POSITIVE_INFINITY) {
            //trying to put positive infinity into an int results in 0
            //so we need a special case to provide a large int value.
            if (this._minVerticalScrollPosition === Number.NEGATIVE_INFINITY) {
                this._minVerticalPageIndex = Number.MIN_SAFE_INTEGER;
            } else {
                this._minVerticalPageIndex = 0;
            }
        } else {
            this._minVerticalPageIndex = 0;
            //floating point errors could result in the max page index
            //being 1 larger than it should be.
            roundedDownRange =
                Math.floor(verticalScrollRange / this.actualPageHeight) * this.actualPageHeight;
            if ((verticalScrollRange - roundedDownRange) < Scroller.FUZZY_PAGE_SIZE_PADDING) {
                verticalScrollRange = roundedDownRange;
            }
        }
    } else {
        this._minVerticalPageIndex = 0;
    }
};

Scroller.prototype.clampScrollPositions = function () {
    if (!this._horizontalAutoScrollTween) {
        var targetHorizontalScrollPosition = this._horizontalScrollPosition;
        if (targetHorizontalScrollPosition < this._minHorizontalScrollPosition) {
            targetHorizontalScrollPosition = this._minHorizontalScrollPosition;
        }
        else if (targetHorizontalScrollPosition > this._maxHorizontalScrollPosition) {
            targetHorizontalScrollPosition = this._maxHorizontalScrollPosition;
        }
        this.horizontalScrollPosition = targetHorizontalScrollPosition;
    }
};

Scroller.prototype.refreshScrollSteps = function () {
    if (this.explicitHorizontalScrollStep !== this.explicitHorizontalScrollStep) //isNaN
    {
        if (this._viewPort) {
            this.actualHorizontalScrollStep = this._viewPort.horizontalScrollStep;
        }
        else {
            this.actualHorizontalScrollStep = 1;
        }
    }
    else {
        this.actualHorizontalScrollStep = this.explicitHorizontalScrollStep;
    }
    if (this.explicitVerticalScrollStep !== this.explicitVerticalScrollStep) //isNaN
    {
        if (this._viewPort) {
            this.actualVerticalScrollStep = this._viewPort.verticalScrollStep;
        }
        else {
            this.actualVerticalScrollStep = 1;
        }
    }
    else {
        this.actualVerticalScrollStep = this.explicitVerticalScrollStep;
    }
};

Scroller.prototype.refreshMinAndMaxScrollPositions = function () {
    var visibleViewPortWidth = this.actualWidth - (this._viewPortOffset.left + this._viewPortOffset.right);
    var visibleViewPortHeight = this.actualHeight - (this._viewPortOffset.top + this._viewPortOffset.bottom);
    if (this.explicitPageWidth !== this.explicitPageWidth) { //isNaN
        this.actualPageWidth = visibleViewPortWidth;
    }
    if (this.explicitPageHeight !== this.explicitPageHeight) { //isNaN
        this.actualPageHeight = visibleViewPortHeight;
    }
    if (this._viewPort) {
        this._minHorizontalScrollPosition = this._viewPort.content.x;
        if (this._viewPort.width === Number.POSITIVE_INFINITY) {
            //we don't want to risk the possibility of negative infinity
            //being added to positive infinity. the result is NaN.
            this._maxHorizontalScrollPosition = Number.POSITIVE_INFINITY;
        } else {
            this._maxHorizontalScrollPosition = this._minHorizontalScrollPosition + this._viewPort.width - visibleViewPortWidth;
        }
        if (this._maxHorizontalScrollPosition < this._minHorizontalScrollPosition) {
            this._maxHorizontalScrollPosition = this._minHorizontalScrollPosition;
        }
        this._minVerticalScrollPosition = this._viewPort.content.y;
        if (this._viewPort.height === Number.POSITIVE_INFINITY) {
            //we don't want to risk the possibility of negative infinity
            //being added to positive infinity. the result is NaN.
            this._maxVerticalScrollPosition = Number.POSITIVE_INFINITY;
        } else {
            this._maxVerticalScrollPosition = this._minVerticalScrollPosition + this._viewPort.height - visibleViewPortHeight;
        }
        if (this._maxVerticalScrollPosition < this._minVerticalScrollPosition) {
            this._maxVerticalScrollPosition = this._minVerticalScrollPosition;
        }
    } else {
        this._minHorizontalScrollPosition = 0;
        this._minVerticalScrollPosition = 0;
        this._maxHorizontalScrollPosition = 0;
        this._maxVerticalScrollPosition = 0;
    }
};

Scroller.prototype.showOrHideChildren = function () {
    var childCount = this.numRawChildrenInternal;
    if (this._touchBlocker !== null && this._touchBlocker.parent !== null) {
        //keep scroll bars below the touch blocker, if it exists
        childCount--;
    }
    if (this.verticalScrollBar) {
        this.verticalScrollBar.visible = this._hasVerticalScrollBar;
        this.verticalScrollBar.touchable =
            this._hasVerticalScrollBar && this._interactionMode !== Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS;
        // this.setRawChildIndexInternal(DisplayObject(this.verticalScrollBar), childCount - 1);
    }
    if (this.horizontalScrollBar) {
        this.horizontalScrollBar.visible = this._hasHorizontalScrollBar;
        this.horizontalScrollBar.touchable =
            this._hasHorizontalScrollBar && this._interactionMode !== Scroller.INTERACTION_TOUCH_AND_SCROLL_BARS;
        //     if(this.verticalScrollBar) {
        //         this.setRawChildIndexInternal(DisplayObject(this.horizontalScrollBar), childCount - 2);
        //     } else {
        //         this.setRawChildIndexInternal(DisplayObject(this.horizontalScrollBar), childCount - 1);
        //     }
    }

};

Scroller.prototype.calculateViewPortOffsetsForFixedVerticalScrollBar = function (forceScrollBars, useActualBounds) {
    forceScrollBars = forceScrollBars || false;
    useActualBounds = useActualBounds || false;
    if (this.verticalScrollBar && (this._measureViewPort || useActualBounds)) {
        var scrollerHeight = useActualBounds ? this.actualHeight : this._explicitHeight;
        var totalHeight = this._viewPort.height + this._viewPortOffset.top + this._viewPortOffset.bottom;
        this._hasVerticalScrollBar =
            forceScrollBars || this._verticalScrollPolicy === Scroller.SCROLL_POLICY_ON ||
            ((totalHeight > scrollerHeight || totalHeight > this._explicitMaxHeight) &&
            this._verticalScrollPolicy !== Scroller.SCROLL_POLICY_OFF);
    } else {
        this._hasVerticalScrollBar = false;
    }
};

Scroller.prototype.calculateViewPortOffsets = function (forceScrollBars, useActualBounds) {
    forceScrollBars = forceScrollBars || false;
    useActualBounds = useActualBounds || false;
    //in fixed mode, if we determine that scrolling is required, we
    //remember the offsets for later. if scrolling is not needed, then
    //we will ignore the offsets from here forward
    this._viewPortOffset.top = this._paddingTop;
    this._viewPortOffset.rigth = this._paddingRight;
    this._viewPortOffset.bottom = this._paddingBottom;
    this._viewPortOffset.left = this._paddingLeft;
    //we need to double check the horizontal scroll bar if the scroll
    //bars are fixed because adding a vertical scroll bar may require a
    //horizontal one too.
};

Scroller.prototype.throwToPage = function (targetHorizontalPageIndex, targetVerticalPageIndex, duration) {
    duration = duration || 0.5;
    var targetHorizontalScrollPosition = this._horizontalScrollPosition;
    if (targetHorizontalPageIndex >= this._minHorizontalPageIndex) {
        targetHorizontalScrollPosition = this.actualPageWidth * targetHorizontalPageIndex;
    }
    if (targetHorizontalScrollPosition < this._minHorizontalScrollPosition) {
        targetHorizontalScrollPosition = this._minHorizontalScrollPosition;
    }
    if (targetHorizontalScrollPosition > this._maxHorizontalScrollPosition) {
        targetHorizontalScrollPosition = this._maxHorizontalScrollPosition;
    }
    var targetVerticalScrollPosition = this._verticalScrollPosition;
    if (targetVerticalPageIndex >= this._minVerticalPageIndex) {
        targetVerticalScrollPosition = this.actualPageHeight * targetVerticalPageIndex;
    }
    if (targetVerticalScrollPosition < this._minVerticalScrollPosition) {
        targetVerticalScrollPosition = this._minVerticalScrollPosition;
    }
    if (targetVerticalScrollPosition > this._maxVerticalScrollPosition) {
        targetVerticalScrollPosition = this._maxVerticalScrollPosition;
    }
    if (duration > 0) {
        this.throwTo(targetHorizontalScrollPosition, targetVerticalScrollPosition, duration);
    } else {
        this.horizontalScrollPosition = targetHorizontalScrollPosition;
        this.verticalScrollPosition = targetVerticalScrollPosition;
    }
    if (targetHorizontalPageIndex >= this._minHorizontalPageIndex) {
        this._horizontalPageIndex = targetHorizontalPageIndex;
    }
    if (targetVerticalPageIndex >= this._minVerticalPageIndex) {
        this._verticalPageIndex = targetVerticalPageIndex;
    }
};

Scroller.prototype.horizontalScrollBarHideTweenOnComplete = function () {
    this._horizontalScrollBarHideTween = null;
};

Scroller.prototype.verticalScrollBarHideTweenOnComplete = function () {
    this._verticalScrollBarHideTween = null;
};

Scroller.prototype.scrollerEnterFrameHandler = function () {
    this.saveVelocity();
};

/**
 * update the rectangle that defines the clipping area
 */
Scroller.prototype.refreshMask = function () {
    if (!this._clipContent) {
        if (this._viewPort) {
            this._viewPort.mask = null;
        }
        return;
    }
    var clipWidth = this.width - this._viewPortOffset.left - this._viewPortOffset.right;
    if (clipWidth < 0 || isNaN(clipWidth)) {
        clipWidth = 0;
    }
    var clipHeight = this.height - this._viewPortOffset.top - this._viewPortOffset.bottom;
    if (clipHeight < 0 || isNaN(clipHeight)) {
        clipHeight = 0;
    }
    if (!this.mask) {
        this.mask = new PIXI.Graphics();
    }
    var global = this.toGlobal(new PIXI.Point(0, 0));
    this.mask.clear()
        .beginFill('#fff', 1)
        .drawRect(
            global.x,
            global.y,
            clipWidth,
            clipHeight)
        .endFill();
    this.clippingInvalid = false;
};

/**
 * Creates and adds the <code>horizontalScrollBar</code> and
 * <code>verticalScrollBar</code> sub-components and removes the old
 * instances, if they exist.
 *
 * <p>Meant for internal use, and subclasses may override this function
 * with a custom implementation.</p>
 *
 * @see #horizontalScrollBar
 * @see #verticalScrollBar
 * @see #horizontalScrollBarFactory
 * @see #verticalScrollBarFactory
 */
Scroller.prototype.createScrollBars = function () {
    if(this.horizontalScrollBar) {
        this.removeChild(this.horizontalScrollBar);
        this.horizontalScrollBar = null;
    }
    if(this.verticalScrollBar) {
        this.removeChild(this.verticalScrollBar);
        this.verticalScrollBar = null;
    }
    this.horizontalScrollBar = this._horizontalScrollBarFactory(Scrollable.HORIZONTAL);
    this.verticalScrollBar = this._verticalScrollBarFactory(Scrollable.VERTICAL);
};

Scroller.prototype.defaultScrollBarFactory = function (direction) {
    // TODO: SimpleScrollBar (like feathers?)
    var sb = new ScrollBar(direction, this.theme);
    if (direction === Scrollable.HORIZONTAL) {
        sb.skinName = this.horizontalScrollBarStyleName;
    } else {
        sb.skinName = this.verticalScrollBarStyleName;
    }
    return sb;
};

Scroller.prototype.revealHorizontalScrollBar = function () {
    if (this.horizontalScrollBar) {
        this.addChild(this.horizontalScrollBar);
    }
};

Scroller.prototype.revealVerticalScrollBar = function () {
    if (this.verticalScrollBar) {
        this.addChild(this.verticalScrollBar);
    }
};

Scroller.prototype.hideHorizontalScrollBar = function () {
    if (this.horizontalScrollBar) {
        this.removeChild(this.horizontalScrollBar);
    }
};

Scroller.prototype.hideVerticalScrollBar = function () {
    if (this.verticalScrollBar) {
        this.removeChild(this.verticalScrollBar);
    }
};

Scroller.prototype.throwHorizontally = function (pixelsPerMS) {
    var absPixelsPerMS = Math.abs(pixelsPerMS);
    if (absPixelsPerMS <= Scroller.MINIMUM_VELOCITY) {
        this.finishScrollingHorizontally();
        return;
    }

    var duration = this._fixedThrowDuration;
    if (!this._useFixedThrowDuration) {
        duration = this.calculateDynamicThrowDuration(pixelsPerMS);
    }
    this.throwTo(this._horizontalScrollPosition + this.calculateThrowDistance(pixelsPerMS), NaN, duration);
};

Scroller.prototype.throwVertically = function (pixelsPerMS) {
    var absPixelsPerMS = Math.abs(pixelsPerMS);
    if (absPixelsPerMS <= Scroller.MINIMUM_VELOCITY) {
        this.finishScrollingVertically();
        return;
    }

    var duration = this._fixedThrowDuration;
    if (!this._useFixedThrowDuration) {
        duration = this.calculateDynamicThrowDuration(pixelsPerMS);
    }
    this.throwTo(NaN, this._verticalScrollPosition + this.calculateThrowDistance(pixelsPerMS), duration);
};

/**
 * @private
 */
Scroller.prototype.calculateDynamicThrowDuration = function (pixelsPerMS) {
    return (Math.log(Scroller.MINIMUM_VELOCITY / Math.abs(pixelsPerMS)) / this._logDecelerationRate) / 1000;
};

/**
 * @private
 */
Scroller.prototype.calculateThrowDistance = function (pixelsPerMS) {
    return (pixelsPerMS - Scroller.MINIMUM_VELOCITY) / this._logDecelerationRate;
};

/**
 * @private
 */
Scroller.prototype.finishScrollingHorizontally = function () {
    var targetHorizontalScrollPosition = NaN;
    if (this._horizontalScrollPosition < this._minHorizontalScrollPosition) {
        targetHorizontalScrollPosition = this._minHorizontalScrollPosition;
    } else if (this._horizontalScrollPosition > this._maxHorizontalScrollPosition) {
        targetHorizontalScrollPosition = this._maxHorizontalScrollPosition;
    }

    this._isDraggingHorizontally = false;
    if (targetHorizontalScrollPosition !== targetHorizontalScrollPosition) { //isNaN
        this.completeScroll();
    } else if (Math.abs(targetHorizontalScrollPosition - this._horizontalScrollPosition) < 1) {
        //this distance is too small to animate. just finish now.
        this.horizontalScrollPosition = targetHorizontalScrollPosition;
        this.completeScroll();
    } else {
        this.throwTo(targetHorizontalScrollPosition, NaN, this._elasticSnapDuration);
    }
};

/**
 * @private
 */
Scroller.prototype.finishScrollingVertically = function () {
    var targetVerticalScrollPosition = NaN;
    if (this._verticalScrollPosition < this._minVerticalScrollPosition) {
        targetVerticalScrollPosition = this._minVerticalScrollPosition;
    } else if (this._verticalScrollPosition > this._maxVerticalScrollPosition) {
        targetVerticalScrollPosition = this._maxVerticalScrollPosition;
    }

    this._isDraggingVertically = false;
    if (targetVerticalScrollPosition !== targetVerticalScrollPosition) //isNaN
    {
        this.completeScroll();
    }
    else if (Math.abs(targetVerticalScrollPosition - this._verticalScrollPosition) < 1) {
        //this distance is too small to animate. just finish now.
        this.verticalScrollPosition = targetVerticalScrollPosition;
        this.completeScroll();
    }
    else {
        this.throwTo(NaN, targetVerticalScrollPosition, this._elasticSnapDuration);
    }
};

/**
 * manage tween to throw to horizontal or vertical position
 * call finishScrolling when tween reaches the end position
 *
 * @param targetPosition {number} target position in pixel
 * @param direction {String} direction ('horizontal' or 'vertical')
 * @param duration {number} time needed to reach target position (in ms)
 */
Scroller.prototype._throwToTween = function (targetPosition, direction, duration) {
    if (!this.tweens) {
        this.tweens = {};
    }
    // remove old tween
    var tween;
    if (this.tweens.hasOwnProperty(direction)) {
        tween = this.tweens[direction];
        tween.remove();
        delete this.tweens[direction];
    }

    tween = new Tween(this._viewport, duration);
    this.tween[direction] = tween;
    var to = {};
    to[direction + 'ScrollPosition'] = targetPosition;
    this.tween.to(to);

    return targetPosition;
};

/**
 * throw the scroller to the specified position
 * @param targetHorizontalScrollPosition as PIXI.Point
 * @param targetVerticalScrollPosition as PIXI.Point
 * @param duration
 */
//TODO: see https://github.com/BowlerHatLLC/feathers/blob/master/source/feathers/controls/Scroller.as#L4939
Scroller.prototype.throwTo = function (targetHorizontalScrollPosition, targetVerticalScrollPosition, duration) {
    duration = duration || 500;

    var verticalScrollPosition = this._throwToTween(targetHorizontalScrollPosition, 'horizontal');
    var horizontalScrollPosition = this._throwToTween(targetVerticalScrollPosition, 'vertical');
    var changedPosition = false;
    if (verticalScrollPosition !== this.verticalScrollPosition) {
        changedPosition = true;
        this.revealVerticalScrollBar();
        this.startScroll();
        // pass
        if (duration === 0) {
            this.verticalScrollPosition = targetVerticalScrollPosition;
        }
        // else {}
    } else {
        this.finishScrollingVertically();
    }
    if (horizontalScrollPosition !== this.horizontalScrollPosition) {
        changedPosition = true;
        this.revealHorizontalScrollBar();
        this.startScroll();
        // pass
        if (duration === 0) {
            this.horizontalScrollPosition = targetHorizontalScrollPosition;
        }
        // else {}
    } else {
        this.finishScrollingHorizontally();
    }


    if (changedPosition && duration === 0) {
        this.completeScroll();
    }
};

Scroller.prototype.direction = function () {
    var scrollAuto =
        this._verticalScrollPolicy === Scroller.SCROLL_POLICY_AUTO &&
        this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_AUTO;
    var scroll = 'vertical';
    var scrollVertical =
        this._verticalScrollPolicy === Scroller.SCROLL_POLICY_AUTO ||
        this._verticalScrollPolicy === Scroller.SCROLL_POLICY_ON;
    var scrollHorizontal =
        this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_AUTO ||
        this._horizontalScrollPolicy === Scroller.SCROLL_POLICY_ON;


    // if the scroll direction is set to SCROLL_AUTO we check, if the
    // layout of the content is set to horizontal or the content
    // width is bigger than the current
    if (!scrollVertical || scrollHorizontal ||
        (scrollAuto && (this.layoutHorizontalAlign() || this.upright()) )) {
        scroll = 'horizontal';
    }
    return scroll;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Basic layout stub - see GOWN.LayoutAlignment
 *
 * @class Layout
 * @memberof GOWN.layout
 * @constructor
 */
function Layout() {
    this.gap = 0;
    this.padding = 0;
    this.layoutChildren = true;
}

module.exports = Layout;

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the top.
 *
 * @static
 * @final
 * @type String
 */
Layout.VERTICAL_ALIGN_TOP = 'top';

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the middle.
 *
 * @static
 * @final
 * @type String
 */
Layout.VERTICAL_ALIGN_MIDDLE = 'middle';

/**
 * Alignment justified
 *
 * @static
 * @final
 * @type String
 */
Layout.ALIGN_JUSTIFY = 'justify';

/**
 * If the total item height is smaller than the height of the bounds,
 * the items will be aligned to the bottom.
 *
 * @static
 * @final
 * @type String
 */
Layout.VERTICAL_ALIGN_BOTTOM = 'bottom';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the left.
 *
 * @static
 * @final
 * @type String
 */
Layout.HORIZONTAL_ALIGN_LEFT = 'left';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the center.
 *
 * @static
 * @final
 * @type String
 */
Layout.HORIZONTAL_ALIGN_CENTER = 'center';

/**
 * If the total item width is smaller than the width of the bounds, the
 * items will be aligned to the right.
 *
 * @static
 * @final
 * @type String
 */
Layout.HORIZONTAL_ALIGN_RIGHT = 'right';

/**
 * The space, in pixels, between items.
 *
 * @name GOWN.layout.Layout#gap
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'gap', {
    get: function() {
        return this._gap;
    },
    set: function(value) {
        if(this._gap === value) {
            return;
        }
        this._gap = value;
        this._needUpdate = true;
    }
});

/**
 * Indicates if the layout needs to be rearranged.
 *
 * @name GOWN.layout.Layout#needUpdate
 * @readonly
 */
Object.defineProperty(Layout.prototype, 'needUpdate', {
    get: function() {
        return this._needUpdate;
    }
});

/**
 * Shortcut to set all paddings (left, right, top, bottom)
 *
 * @name GOWN.layout.Layout#padding
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'padding', {
    set: function(value) {
        this._paddingLeft = value;
        this._paddingRight = value;
        this._paddingBottom = value;
        this._paddingTop = value;
        this._needUpdate = true;
    },
    get: function (){
        // just return paddingTop, because we do not save the
        // overall padding value (just like feathers)
        return this._paddingTop;
    }
});

/**
 * The minimum space, in pixels, above the items.
 *
 * @name GOWN.layout.Layout#paddingTop
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'paddingTop', {
    get:  function() {
        return this._paddingTop;
    },
    set: function(value) {
        if(this._paddingTop === value) {
            return;
        }
        this._paddingTop = value;
        this._needUpdate = true;
    }
});

/**
 * The minimum space, in pixels, below the items.
 *
 * @name GOWN.layout.Layout#paddingBottom
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'paddingBottom', {
    get:  function() {
        return this._paddingBottom;
    },
    set: function(value) {
        if(this._paddingBottom === value) {
            return;
        }
        this._paddingBottom = value;
        this._needUpdate = true;
    }
});

/**
 * The space, in pixels, that appears to the left, before the first
 * item.
 *
 * @name GOWN.layout.Layout#paddingLeft
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'paddingLeft', {
    get:  function() {
        return this._paddingLeft;
    },
    set: function(value) {
        if(this._paddingLeft === value) {
            return;
        }
        this._paddingLeft = value;
        this._needUpdate = true;
    }
});

/**
 * The space, in pixels, that appears to the right, after the last item.
 *
 * @name GOWN.layout.Layout#paddingLeft
 * @type Number
 * @default 0
 */
Object.defineProperty(Layout.prototype, 'paddingRight', {
    get:  function() {
        return this._paddingRight;
    },
    set: function(value) {
        if(this._paddingRight === value) {
            return;
        }
        this._paddingRight = value;
        this._needUpdate = true;
    }
});

/**
 * Position (and possibly resize) the supplied items.
 *
 * @param items items that will be layouted {Array}
 * @param viewPortBounds {ViewPortBounds}
 */
/* jshint unused: false */
Layout.prototype.layout = function (items, viewPortBounds) {
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var Layout = __webpack_require__(10);
var itemDimensions = __webpack_require__(13);

/**
 * Basic layout
 *
 * @class LayoutAlignment
 * @extends GOWN.layout.Layout
 * @memberof GOWN.layout
 * @constructor
 */
function LayoutAlignment() {
    Layout.call(this);
}

LayoutAlignment.prototype = Object.create( Layout.prototype );
LayoutAlignment.prototype.constructor = LayoutAlignment;
module.exports = LayoutAlignment;

/**
 * Vertical alignment
 *
 * @static
 * @final
 * @type String
 */
LayoutAlignment.VERTICAL_ALIGNMENT = 'vertical';

/**
 * Horizontal alignment
 *
 * @static
 * @final
 * @type String
 */
LayoutAlignment.HORIZONTAL_ALIGNMENT = 'horizontal';

/**
 * Apply percentage width/height to items.
 * This will use the explicit width/height and apply it to all items
 * according to its percentages.
 *
 * Percentages have higher priorities than fixed values.
 * So if you set a width higher than 0 but also percentWidth,
 * the width will be recalculated according to percentWidth.
 *
 * @param items The items which get new width and height according to the percent {Array}
 * @param explicit The space we have for the components {Number}
 * @param [alignment=LayoutAlignment.VERTICAL_ALIGNMENT] The alignment mode {String}
 */
LayoutAlignment.prototype.applyFixedPercent = function(items, explicit, alignment) {
    var itemCount = items.length;
    var i, item, itemPercent;
    for (i = 0; i < itemCount; i++) {
        item = items[i];
        // note: this is the opposide of what we normally want
        itemPercent = 0;
        if (alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT) {
            itemPercent = item.percentWidth;
        } else {
            itemPercent = item.percentHeight;
        }
        if (itemPercent > 0) {
            if (alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT) {
                item.width = explicit * itemPercent / 100;
            } else {
                item.height = explicit * itemPercent / 100;
            }
        }
    }
};

/**
 * Apply percentage width/height to items.
 * This will stack items on top/aside of each other
 *
 * Percentages have higher priorities than fixed values.
 * So if you set a width higher than 0 but also percentWidth,
 * the width will be recalculated according to percentWidth.
 *
 * (this function will handle padding and gap, so the explicitWidth is
 * for the whole available width)
 *
 * @param items The items which get new width and height according to the percent {Array}
 * @param explicit space we have for the components {Number}
 */
LayoutAlignment.prototype.applyPercent = function(items, explicit) {
    var _hor = (this.alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT);

    var itemCount = items.length;
    var remaining = explicit;
    var totalExplicit = 0;
    var totalPercent = 0;

    var i, itemPercent, item;
    // sum up width/height required for all items
    for (i = 0; i < itemCount; i++) {
        item = items[i];
        var itemSpace;

        var dimensions = itemDimensions(item);

        itemPercent = _hor ? item.percentWidth : item.percentHeight;
        itemSpace = _hor ? dimensions[0] : dimensions[1];

        if (!isNaN(itemPercent) && itemPercent !== undefined &&
            itemPercent !== null) {
            totalPercent += itemPercent;
        } else if (!isNaN(itemSpace)) {
            // no percentWidth/percentHeight set for this item
            totalExplicit += itemSpace;
        }
    }

    // add space for all gaps
    totalExplicit += this._firstGap > 0 ? this._firstGap : this._gap;
    totalExplicit += (this._gap * (itemCount - 3));
    totalExplicit += this._lastGap > 0 ? this._lastGap : this._gap;

    var padding = _hor ?
        this._paddingLeft + this._paddingRight :
        this._paddingTop + this._paddingBottom;
    totalExplicit += padding;

    // use whole available space - if we do not sum up to 100 we will
    // stretch the items
    if(totalPercent < 100) {
        totalPercent = 100;
    }

    var percentToPixels = (remaining - totalExplicit) / totalPercent;
    // claculate width/height for each item based on remaining width/height
    this.applyFixedPercent(items, percentToPixels * 100, this.alignment);
};

/**
 * Get the current gap (includes first and last gap)
 *
 * @param i The current item position {Number}
 * @param items The list of items (to determine if we are at the last gap) {Array}
 * @private
 */
LayoutAlignment.prototype._currentGap = function(i, items) {
    if(!isNaN(this._firstGap) && i === 0)
    {
        return this._firstGap;
    }
    else if(!isNaN(this._lastGap) && i > 0 && i === items.length - 2)
    {
        return this._lastGap;
    }
    return this._gap;
};

/**
 * Calculate the layout for a container (and its children)
 *
 * @param container The container to calculate the layout for
 * @return Number[] The width and height
 */
LayoutAlignment.prototype.layoutContainer = function(container) {
    var dimensions = itemDimensions(container);
    return this.layout(container.children, dimensions[0], dimensions[1]);
};

/**
 * Position (and possibly resize) the supplied items.
 *
 * @param items The items that will be layouted {Array}
 * @param maxWidth The maximum width for the items {Number}
 * @param maxHeight The maximum height for the items {Number}
 * @return Number[] The width and height
 */
LayoutAlignment.prototype.layout = function(items, maxWidth, maxHeight) {
    var _hor = (this.alignment === LayoutAlignment.HORIZONTAL_ALIGNMENT);

    // width/height the current layout takes
    var width = 0;
    var height = 0;
    var paddingStart = _hor ? this._paddingLeft : this._paddingTop;

    // recalculate width/height for items with percentages
    this.applyPercent(items, _hor ? maxWidth : maxHeight);
    this.applyFixedPercent(items, _hor ? maxHeight : maxWidth,
        _hor ?
            LayoutAlignment.VERTICAL_ALIGNMENT :
            LayoutAlignment.HORIZONTAL_ALIGNMENT);

    var position = paddingStart;
    var itemSpace, itemWidth, itemHeight;
    var dimensions;
    // calculate item position (x/y coordinates)
    for(var i = 0; i < items.length; i++)
    {
        var item = items[i];

        dimensions = itemDimensions(item);
        itemWidth = dimensions[0];
        itemHeight = dimensions[1];

        // move item to position calculated in previous loop
        if (_hor) {
            item.x = Math.floor(position);
            // set height of highest item
            height = Math.max(itemHeight, height);
        } else {
            item.y = Math.floor(position);
            // set width of widest item
            width = Math.max(itemWidth, width);
        }
        itemSpace = _hor ? itemWidth : itemHeight;
        // calculate position for next item
        position += itemSpace + this._currentGap(i, items);

        // if the item has a layout and children, layout the children
        if (this.layoutChildren && item.children &&
            item.layout && item.layout.layout) {
            item.layout.layout(item.children, itemWidth, itemHeight);
        }
    }
    if (_hor) {
        width = position;
    } else {
        height = position;
    }
    this._needUpdate = false;

    return [width, height];
};

/**
 * The space between the first and second element
 *
 * @name GOWN.layout.LayoutAlignment#firstGap
 * @type Number
 */
Object.defineProperty(LayoutAlignment.prototype, 'firstGap', {
    set: function(value) {
        if (value === this._firstGap) {
            return;
        }
        this._firstGap = value;
        this._needUpdate = true;
    },
    get: function() {
        return this._firstGap;
    }
});

/**
 * The space between the last and second-to-last element
 *
 * @name GOWN.layout.LayoutAlignment#lastGap
 * @type Number
 */
Object.defineProperty(LayoutAlignment.prototype, 'lastGap', {
    set: function(value) {
        if (value === this._lastGap) {
            return;
        }
        this._lastGap = value;
        this._needUpdate = true;
    },
    get: function() {
        return this._lastGap;
    }
});


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var Layout = __webpack_require__(10);
var itemDimensions = __webpack_require__(13);

/**
 * A layout for tiled rows/columns
 *
 * @class TiledLayout
 * @extends GOWN.layout.Layout
 * @memberof GOWN.layout
 * @constructor
 */
function TiledLayout() {
    Layout.call(this);

    /**
     * Use square tiles
     *
     * @private
     * @type bool
     * @default false
     */
    this._useSquareTiles = false;

    /**
     * The size of the horizontal gap between tiles
     *
     * @private
     * @type Number
     * @default 0
     */
    this._horizontalGap = 0;

    /**
     * The size of the vertical gap between tiles
     *
     * @private
     * @type Number
     * @default 0
     */
    this._verticalGap = 0;

    /**
     * Horizontal alignment of the tiles
     *
     * @private
     * @type String
     * @default TiledLayout.TILE_HORIZONTAL_ALIGN_CENTER
     */
    this._tileHorizontalAlign = TiledLayout.TILE_HORIZONTAL_ALIGN_CENTER;

    /**
     * Vertical alignment of the tiles
     *
     * @private
     * @type String
     * @default TiledLayout.TILE_VERTICAL_ALIGN_MIDDLE
     */
    this._tileVerticalAlign = TiledLayout.TILE_VERTICAL_ALIGN_MIDDLE;

    /**
     * Paging mode
     *
     * @private
     * @type String
     * @default TiledLayout.TiledLayout.PAGING_NONE
     */
    this._paging = TiledLayout.PAGING_NONE;

    /**
     * Orientation mode
     *
     * @private
     * @type String
     * @default TiledLayout.ORIENTATION_ROWS
     */
    this._orientation = TiledLayout.ORIENTATION_ROWS;

    /**
     * Invalidate the layout so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this._needUpdate = true;
}

TiledLayout.prototype = Object.create( Layout.prototype );
TiledLayout.prototype.constructor = TiledLayout;
module.exports = TiledLayout;

/**
 * Orientation by rows
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.ORIENTATION_ROWS = 'rows';

/**
 * Orientation by columns
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.ORIENTATION_COLUMNS = 'columns';

/**
 * If an item height is smaller than the height of a tile, the item will
 * be aligned to the top edge of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_VERTICAL_ALIGN_TOP = 'top';

/**
 * If an item height is smaller than the height of a tile, the item will
 * be aligned to the middle of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_VERTICAL_ALIGN_MIDDLE = 'middle';

/**
 * If an item height is smaller than the height of a tile, the item will
 * be aligned to the bottom edge of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_VERTICAL_ALIGN_BOTTOM = 'bottom';

/**
 * The item will be resized to fit the height of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_VERTICAL_ALIGN_JUSTIFY = 'justify';

/**
 * If an item width is smaller than the width of a tile, the item will
 * be aligned to the left edge of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_LEFT = 'left';

/**
 * If an item width is smaller than the width of a tile, the item will
 * be aligned to the center of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_CENTER = 'center';

/**
 * If an item width is smaller than the width of a tile, the item will
 * be aligned to the right edge of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_RIGHT = 'right';

/**
 * The item will be resized to fit the width of the tile.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.TILE_HORIZONTAL_ALIGN_JUSTIFY = 'justify';

/**
 * The items will be positioned in pages horizontally from left to right.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.PAGING_HORIZONTAL = 'horizontal';

/**
 * The items will be positioned in pages vertically from top to bottom.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.PAGING_VERTICAL = 'vertical';

/**
 * The items will not be positioned in pages.
 *
 * @static
 * @final
 * @type String
 */
TiledLayout.PAGING_NONE = 'none';

/**
 * Calculate the layout for a container (and its children)
 *
 * @param container The container to calculate the layout for
 * @return Number[] The width and height
 */
TiledLayout.prototype.layoutContainer = function(container) {
    var dimensions = itemDimensions(container);
    return this.layout(container.children, dimensions[0], dimensions[1]);
};

/**
 * Position (and possibly resize) the supplied items.
 *
 * @param items The items that will be layouted {Array}
 * @param maxWidth The maximum width for the items {Number}
 * @param maxHeight The maximum height for the items {Number}
 * @return Number[] The width and height
 */
TiledLayout.prototype.layout = function (items, maxWidth, maxHeight) {
    var _rows = this._orientation === TiledLayout.ORIENTATION_ROWS;
    if(items.length === 0) {
        return [0, 0];
    }

    maxWidth = maxWidth || NaN;
    maxHeight = maxHeight || NaN;

    // width/height the current layout takes
    var width = 0;
    var height = 0;

    var i, item;
    var tileWidth = 0;
    var tileHeight = 0;

    var dimensions;
    // get size for tiles by saving the highest/widest tile.
    for(i = 0; i < items.length; i++) {
        item = items[i];
        if(!item) {
            continue;
        }

        dimensions = itemDimensions(item);
        tileWidth = Math.max(tileWidth, dimensions[0]);
        tileHeight = Math.max(tileHeight, dimensions[1]);
    }

    // make tiles square
    if (this._useSquareTiles) {
        if (tileWidth > tileHeight) {
            tileHeight = tileWidth;
        } else if (tileHeight > tileWidth) {
            tileWidth = tileHeight;
        }
    }

    // calculate tiles needed (and their width/height)
    var availableWidth = NaN;
    var availableHeight = NaN;

    var horizontalTileCount = _rows ? items.length : 1;

    if(!isNaN(maxWidth)) {
        availableWidth = maxWidth;
        horizontalTileCount = (maxWidth -
            this._paddingLeft - this._paddingRight +
            this._horizontalGap) / (tileWidth + this._horizontalGap);
    }
    horizontalTileCount = Math.floor(Math.max(horizontalTileCount, 1));

    var verticalTileCount = _rows ? 1 : items.length;
    if(!isNaN(maxHeight)) {
        availableHeight = maxHeight;
        verticalTileCount = (maxHeight -
            this._paddingTop - this._paddingBottom +
            this._verticalGap) / (tileHeight + this._verticalGap);
    }
    verticalTileCount = Math.floor(Math.max(verticalTileCount, 1));

    var startX = this._paddingLeft;
    var startY = this._paddingTop;

    var perPage = horizontalTileCount * verticalTileCount;
    var pageIndex = 0;
    var nextPageStartIndex = perPage;
    var pageStart = _rows ? startX : startY;
    var positionX = startX;
    var positionY = startY;
    var itemIndex = 0;
    for (i = 0; i < items.length; i++) {
        item = items[i];
        if (_rows) {
            if(itemIndex !== 0 && itemIndex % horizontalTileCount === 0)
            {
                positionX = pageStart;
                positionY += tileHeight + this._verticalGap;
            }
        } else { // columns
            if(itemIndex !== 0 && i % verticalTileCount === 0)
            {
                positionX += tileWidth + this._horizontalGap;
                positionY = pageStart;
            }
        }
        if(itemIndex === nextPageStartIndex) {
            pageIndex++;
            nextPageStartIndex += perPage;

            //we can use availableWidth and availableHeight here without
            //checking if they're NaN because we will never reach a
            //new page without them already being calculated.
            if (_rows) {
                if(this._paging === TiledLayout.PAGING_HORIZONTAL)
                {
                    positionX = pageStart === startX + availableWidth * pageIndex;
                    positionY = startY;
                } else if(this._paging === TiledLayout.PAGING_VERTICAL) {
                    positionY = startY + availableHeight * pageIndex;
                }
            } else { // columns
                if(this._paging === TiledLayout.PAGING_HORIZONTAL) {
                    positionX = startX + availableWidth * pageIndex;
                } else if(this._paging === TiledLayout.PAGING_VERTICAL) {
                    positionX = startX;
                    positionY = pageStart = startY + availableHeight * pageIndex;
                }
            }
        }
        if(item) {
            switch(this._tileHorizontalAlign) {
                case TiledLayout.TILE_HORIZONTAL_ALIGN_JUSTIFY:
                    item.x = positionX;
                    item.width = tileWidth;
                    break;
                case TiledLayout.TILE_HORIZONTAL_ALIGN_LEFT:
                    item.x = positionX;
                    break;
                case TiledLayout.TILE_HORIZONTAL_ALIGN_RIGHT:
                    item.x = positionX + tileWidth - item.width;
                    break;
                default: //center or unknown
                    item.x = positionX + (tileWidth - item.width) / 2;
            }
            switch(this._tileVerticalAlign) {
                case TiledLayout.TILE_VERTICAL_ALIGN_JUSTIFY:
                    item.y = positionY;
                    item.height = tileHeight;
                    break;
                case TiledLayout.TILE_VERTICAL_ALIGN_TOP:
                    item.y = positionY;
                    break;
                case TiledLayout.TILE_VERTICAL_ALIGN_BOTTOM:
                    item.y = positionY + tileHeight - item.height;
                    break;
                default: //middle or unknown
                    item.y = positionY + (tileHeight - item.height) / 2;
            }

            // if the item has a layout and children, layout the children
            if (this.layoutChildren && item.children &&
                item.layout && item.layout.layout) {
                dimensions = itemDimensions(item);
                item.layout.layout(item.children, dimensions[0], dimensions[1]);
            }
        }
        if (_rows) {
            positionX += tileWidth + this._horizontalGap;
        } else { // columns
            positionY += tileHeight + this._verticalGap;
        }
        itemIndex++;
    }

    this._needUpdate = false;
    return [width, height];
};

/**
 * Use the same width and height for tiles (calculated by biggest square)
 *
 * @name GOWN.layout.TiledLayout#useSquareTiles
 * @type bool
 * @default false
 */
Object.defineProperty(TiledLayout.prototype, 'useSquareTiles', {
    set: function(useSquareTiles) {
        this._useSquareTiles = useSquareTiles;
        this._needUpdate = true;
    },
    get: function() {
        return this._useSquareTiles;
    }
});


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function (item) {
    var itemWidth = 0, itemHeight = 0;

    // we prefer pixel positions over calculated ones, so we try to
    // access the underscore values first.
    if (!isNaN(item._height)) {
        itemHeight = item._height;
    } else if (!isNaN(item.height)) {
        itemHeight = item.height;
    }

    if (!isNaN(item._width)) {
        itemWidth = item._width;
    } else if (!isNaN(item.width)) {
        itemWidth = item.width;
    }

    return [itemWidth, itemHeight];
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var Control = __webpack_require__(2);

/**
 * The LayoutGroup allows you to add PIXI.js children that will be positioned
 *
 * @class LayoutGroup
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 * @param layout The layout for the layout group {GOWN.LayoutAlignment}
 * @param [maxWidth=Infinity] The maximum width of the layout group {Number}
 * @param [maxHeight=Infinity] The maximum height of the layout group {Number}
 */
function LayoutGroup(layout, maxWidth, maxHeight) {
    /**
     * The layout for the layout group
     *
     * @type GOWN.LayoutAlignment
     */
    this.layout = layout;

    /**
     * The percentage width of the positioned children
     *
     * @type Number
     */
    this.percentWidth = this.percentWidth ;

    /**
     * The percentage height of the positioned children
     *
     * @type Number
     */
    this.percentHeight = this.percentHeight;

    /**
     * The maximum width of the layout group
     *
     * @type Number
     * @default Infinity
     */
    this.maxWidth = maxWidth || Infinity;

    /**
     * The maximum height of the layout group
     *
     * @type Number
     * @default Infinity
     */
    this.maxHeight = maxHeight || Infinity;

    Control.call(this);

    /**
     * Indicates if the layout group has changed
     *
     * @private
     * @type bool
     * @default true
     */
    this._needUpdate = true;

    /**
     * The layout group is resizable
     *
     * @private
     * @type bool
     * @default true
     */
    this.resizable = true;

    this.on('resize', this.onResize, this);
}

LayoutGroup.prototype = Object.create( Control.prototype );
LayoutGroup.prototype.constructor = LayoutGroup;
module.exports = LayoutGroup;

/**
 * Update before draw call (position label)
 * (called from Control.prototype.updateTransform every frame)
 *
 * @protected
 */
LayoutGroup.prototype.redraw = function() {
    var dimensionChanged = false;
    if (this._width && this.maxWidth !== this._width) {
        this._width = Math.min(this._width, this.maxWidth);
        dimensionChanged = true;
    }
    if (this._height && this.maxHeight !== this._height) {
        this._height = Math.min(this._height, this.maxHeight);
        dimensionChanged = true;
    }
    if (this.layout &&
        (this._needUpdate || dimensionChanged || this.layout.needUpdate)) {
        this.layout.layoutContainer(this);
        this._needUpdate = false;
    }
};

/**
 * onResize callback
 *
 * @protected
 */
LayoutGroup.prototype.onResize = function() {
    this._needUpdate = true;
};

/* istanbul ignore next */

/**
 * Adds one or more children to the container.
 *
 * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
 *
 * @param {...PIXI.DisplayObject} child - The DisplayObject(s) to add to the container
 * @return {PIXI.DisplayObject} The first child that was added.
 */
LayoutGroup.prototype.addChild = function(child) {
    var re = Control.prototype.addChild.call(this, child);
    this._needUpdate = true;
    return re;
};

/* istanbul ignore next */

/**
 * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
 *
 * @param {PIXI.DisplayObject} child - The child to add
 * @param {number} index - The index to place the child in
 * @return {PIXI.DisplayObject} The child that was added.
 */
LayoutGroup.prototype.addChildAt = function(child, pos) {
    var re = Control.prototype.addChildAt.call(this, child, pos);
    this._needUpdate = true;
    return re;
};

/**
 * Add some space between children
 *
 * @param space Space between children {Number}
 */
LayoutGroup.prototype.addSpacer = function(space) {
    var spacer = new Control();
    spacer.width = spacer.height = space;
    this.addChild(spacer);
};

/**
 * Indicates if the given child is inside the viewport (only used for scrolling)
 *
 * @param child One child with set coordinates and dimensions {PIXI.DisplayObject}
 * @param x X-position on the scroll-container {Number}
 * @param y Y-position on the scroll-container {Number}
 * @param width Width of the viewport {Number}
 * @param height Height of the viewport {Number}
 * @returns {boolean}
 */
LayoutGroup.prototype.childIsRenderAble = function(child, x, y, width, height) {
    return child.x < width + x &&
        child.y < height + y &&
        child.x > x - child.width &&
        child.y > y - child.height;
};

/**
 * Update renderable (culling of non visible objects)
 *
 * @param x X-position on the scroll-container {Number}
 * @param y Y-position on the scroll-container {Number}
 * @param width width of the viewport {Number}
 * @param height height of the viewport {Number}
 */
LayoutGroup.prototype.updateRenderable = function(x, y, width, height) {
    for(var i=0, j=this.children.length; i<j; i++) {
        var child = this.children[i];
        child.renderable = this.childIsRenderAble(child, x, y, width, height);
    }
};

/**
 * The width of the group, will get the position and the width of the right child.
 *
 * @name GOWN.LayoutGroup#width
 * @type Number
 */
Object.defineProperty(LayoutGroup.prototype, 'width', {
    set: function(width) {
        this._width = width;
    },
    get: function() {
        if (this._width > 0) {
            return this._width;
        }
        var width = 0;
        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.getChildAt(i);
                width = Math.max(width, child.x+child.width);
            }
        }
        return width;
    }
});

/**
 * The height of the group, will get the position and the height of the bottom child.
 *
 * @name GOWN.LayoutGroup#height
 * @type Number
 */
Object.defineProperty(LayoutGroup.prototype, 'height', {
    set: function(height) {
        this._height = height;
    },
    get: function() {
        if (this._height > 0) {
            return this._height;
        }
        var height = 0;
        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.getChildAt(i);
                height = Math.max(height, child.y+child.height);
            }
        }
        return height;
    }
});


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var Scroller = __webpack_require__(9);
var ListCollection = __webpack_require__(20);
var LayoutGroup = __webpack_require__(14);
var DefaultListItemRenderer = __webpack_require__(19);

/**
 * The basic list
 *
 * @class List
 * @extends GOWN.Scroller
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the list {GOWN.Theme}
 */
function List(theme) {
    Scroller.call(this, theme);

    /**
     * The skin name
     *
     * @type String
     * @default List.SKIN_NAME
     */
    this.skinName = this.skinName || List.SKIN_NAME;

    /**
     * Determines if items in the list may be selected. (not implemented yet)
     *
     * @private
     * @type bool
     * @default true
     */
    this._selectable = true;

    /**
     * The index of the currently selected item.
     *
     * @private
     * @type Number
     * @default -1
     */
    this._selectedIndex = -1;

    /**
     * If true multiple items may be selected at a time.
     *
     * @private
     * @type bool
     * @default false
     */
    this._allowMultipleSelection = false;

    /**
     * The indices of the currently selected items.
     *
     * @private
     * @type Number[]
     * @default []
     */
    this._selectedIndices = [];

    /**
     * The item renderer
     *
     * @private
     * @type Array
     * @default []
     */
    this._itemRenderer = [];

    /**
     * The item change handler
     *
     * @private
     * @type function
     */
    this._itemChangeHandler = this.itemChangeHandler.bind(this);

    /**
     * The item renderer change handler
     *
     * @private
     * @type function
     */
    this._itemRendererChangeHandler = this.itemRendererChangeHandler.bind(this);

    /**
     * The item renderer factory creates a new instance of the item renderer
     *
     * @private
     * @type function
     * @default this._defaultItemRendererFactory
     */
    this._itemRendererFactory = this._itemRendererFactory || this._defaultItemRendererFactory;

    /**
     * Properties that will be passed down to every item renderer when the list validates.
     *
     * @private
     * @type Object
     * @default {}
     */
    this._itemRendererProperties = {};

    // TODO: itemRendererStyleName (?)

    if (!this.viewPort) {
        /**
         * We do not implement ListDataViewPort from feathers
         * (most of what it does is implemented in List directly to
         * manage the viewport)
         * and instead use the normal LayoutGroup (less abstraction, less code)
         *
         * @private
         * @type GOWN.LayoutGroup
         */
        this.viewPort = new LayoutGroup();
    }
    this.layoutChanged = true;
}

List.prototype = Object.create( Scroller.prototype );
List.prototype.constructor = List;
module.exports = List;

/**
 * Default list skin name
 *
 * @static
 * @final
 * @type String
 */
List.SKIN_NAME = 'list';

/**
 * Dispatched when the selected item changes.
 *
 * @static
 * @final
 * @type String
 */
List.CHANGE = 'change';

/**
 * A function that is expected to return a new GOWN.DefaultListItemRenderer
 *
 * @param theme The item theme {GOWN.Theme}
 * @returns {DefaultListItemRenderer}
 * @private
 */
List.prototype._defaultItemRendererFactory = function(theme) {
    return new DefaultListItemRenderer(theme);
};

/**
 * Gets called when new data is added or removed
 * to the dataProvider
 *
 * @protected
 */
List.prototype.itemChangeHandler = function() {
    // TODO: test code so it will handle if item is removed
    // deselect removed items
    var index = this._dataProvider.data.length;
    if (this._selectedIndex >= index) {
        this._selectedIndex = -1;
    }
    var indexCount = this._selectedIndices.length;
    for (var i = 0; i < indexCount; i++) {
        var currentIndex = this._selectedIndices[i];
        if (currentIndex >= index) {
            this._selectedIndices.splice(i, 1);
        }
    }
    // force redraw
    this.dataInvalid = true;
};

/**
 * Select one of the items
 *
 * @param item The item to select {String}
 */
List.prototype.selectItem = function(item) {
    this.selectedIndex = this._dataProvider.data.indexOf(item);
};


/**
 * @private
 */
// performance increase to avoid using call.. (10x faster)
List.prototype.scrollerRedraw = Scroller.prototype.redraw;

/**
 * Update before draw call
 *
 * @protected
 */
List.prototype.redraw = function() {
    var basicsInvalid = this.dataInvalid;
    if (basicsInvalid) {
        this.refreshRenderers();
    }
    this.scrollerRedraw();

    if (!this.layout) {
        var layout = new GOWN.layout.VerticalLayout();
        layout.padding = 0;
        layout.gap = 0;
        layout.horizontalAlign = GOWN.layout.VerticalLayout.HORIZONTAL_ALIGN_JUSTIFY;
        layout.verticalAlign = GOWN.layout.VerticalLayout.VERTICAL_ALIGN_TOP;
        this.layout = layout;
    }
};

/**
 * Refresh the renderers
 */
List.prototype.refreshRenderers = function () {
    //TODO: update only new renderer
    //      see ListDataViewPort --> refreshInactieRenderers
    this._itemRenderer.length = 0;
    if (this._dataProvider && this.viewPort) {
        this.viewPort.removeChildren();
        for (var i = 0; i < this._dataProvider.length; i++) {
            var item = this._dataProvider.getItemAt(i);
            var itemRenderer = this._itemRendererFactory(this.theme);

            if (this._itemRendererProperties) {
                itemRenderer.labelField = this._itemRendererProperties.labelField;
            }

            itemRenderer.on('change', this._itemRendererChangeHandler);
            itemRenderer.data = item;
            this._itemRenderer.push(itemRenderer);
            this.viewPort.addChild(itemRenderer);
        }
    }

    this.dataInvalid = false;
};

/**
 * Item catch/forward renderer change event.
 * This is thrown when the state of the itemRenderer changes
 * (e.g. from unselected to selected), not when the data changes
 *
 * @protected
 */
List.prototype.itemRendererChangeHandler = function(itemRenderer, value) {
    // TODO: update selected item
    var i;
    this._selectedIndices.length = 0;

    if (!this.allowMultipleSelection) {
        for (i = 0; i < this._itemRenderer.length; i++) {
            if (this._itemRenderer[i] !== itemRenderer && value === true) {
                this._itemRenderer[i].selected = false;
            }
        }
        if (value === true) {
            this._selectedIndices = [this._itemRenderer.indexOf(itemRenderer)];
        }
    } else {
        for (i = 0; i < this._itemRenderer.length; i++) {
            if (this._itemRenderer[i].selected === true) {
                this._selectedIndices.push(i);
            }
        }
    }

    this.emit(List.CHANGE, itemRenderer, value);
};

/**
 * Set layout and pass event listener to it
 *
 * @name GOWN.List#layout
 * @type LayoutAlignment
 */
Object.defineProperty(List.prototype, 'layout', {
    set: function(layout) {
        if (this._layout === layout) {
            return;
        }
        if (this.viewPort) {
            // this is different from feathers - there the viewport does not
            // know the layout (feathers uses ListDataViewPort, not LayoutGroup
            // as viewPort for List)
            this.viewPort.layout = layout;
        }
        // TODO: this.invalidate(INVALIDATION_FLAG_LAYOUT);
    },
    get: function() {
        return this._layout;
    }
});

/**
 * Set item renderer properties (e.g. labelField) and update all itemRenderer
 *
 * @name GOWN.List#itemRendererProperties
 * @type Object
 */
Object.defineProperty(List.prototype, 'itemRendererProperties', {
    set: function(itemRendererProperties) {
        this._itemRendererProperties = itemRendererProperties;
        this.dataInvalid = true;
    },
    get: function() {
        return this._itemRendererProperties;
    }
});


/**
 * Set item renderer factory (for custom item Renderer)
 *
 * @name GOWN.List#itemRendererFactory
 * @type function
 */
Object.defineProperty(List.prototype, 'itemRendererFactory', {
    set: function(itemRendererFactory) {
        this._itemRendererFactory = itemRendererFactory;
        this.dataInvalid = true;
    },
    get: function() {
        return this._itemRendererFactory;
    }
});

/**
 * Allow/disallow multiple selection.
 * If selection has been disallowed, deselect all but one.
 *
 * @name GOWN.List#allowMultipleSelection
 * @type bool
 */
 Object.defineProperty(List.prototype, 'allowMultipleSelection', {
     set: function(allowMultipleSelection) {
         if (this._allowMultipleSelection === allowMultipleSelection) {
             return;
         }
         this._allowMultipleSelection = allowMultipleSelection;

         if (!this._allowMultipleSelection && this._selectedIndices) {
             // only last index is selected
             this._selectedIndices = [this._selectedIndices.pop()];
         }
         //TODO: this.refreshSelection();
     },
     get: function() {
         return this._allowMultipleSelection;
     }
 });

/**
 * The index of the selected item
 *
 * @name GOWN.List#selectedIndex
 * @type Number
 */
Object.defineProperty(List.prototype, 'selectedIndex', {
    set: function(selectedIndex) {
        this._selectedIndex = selectedIndex;
        // force redraw
        this.dataInvalid = true;
    },
    get: function() {
        return this._selectedIndex;
    }
});

/**
 * dataProvider for list.
 * The dataProvider is a structure that provides the data.
 * In its simplest form it is an array containing the data
 *
 * @name GOWN.List#dataProvider
 * @type Array
 */
Object.defineProperty(List.prototype, 'dataProvider', {
    set: function(dataProvider) {
        if (this._dataProvider === dataProvider) {
            return;
        }
        if (!(dataProvider instanceof ListCollection || dataProvider === null)) {
            throw new Error('the dataProvider has to be a GOWN.ListCollection');
        }

        if (this._dataProvider) {
            this._dataProvider.off(ListCollection.CHANGED, this._itemChangeHandler);
        }
        this._dataProvider = dataProvider;

        //reset the scroll position because this is a drastic change and
        //the data is probably completely different
        this.horizontalScrollPosition = 0;
        this.verticalScrollPosition = 0;

        if (this._dataProvider) {
            this._dataProvider.on(ListCollection.CHANGED, this._itemChangeHandler);
        }

        this.selectedIndex = -1;
        this.dataInvalid = true;
    },
    get: function() {
        return this._dataProvider;
    }
});

// TODO: selectedItem


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var Scrollable = __webpack_require__(6);

// TODO: decrement/increment Button
// TODO: thumbFactory?
// TODO: this.showButtons

/**
 * Scroll bar with thumb
 * hosting some Viewport (e.g. a ScrollContainer or a Texture)
 *
 * @class ScrollBar
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 * @param [direction=Scrollable.HORIZONTAL] Direction of the scroll bar (horizontal/vertical) {String}
 * @param [theme] theme for the scrollbar {GOWN.Theme}
 */
function ScrollBar(direction, theme) {
    /**
     * The skin name
     *
     * @type String
     * @default ScrollBar.SKIN_NAME
     */
    this.skinName = this.skinName || ScrollBar.SKIN_NAME;

    // this.viewPort = container;

    this.direction = direction === undefined ?
        Scrollable.HORIZONTAL : direction;

    // if (container) {
    //     // move thumb when viewPort moves
    //     container[this.direction + '_bar'] = this;
    // }
    Scrollable.call(this, theme);
}

ScrollBar.prototype = Object.create( Scrollable.prototype );
ScrollBar.prototype.constructor = ScrollBar;
module.exports = ScrollBar;

/**
 * The minimum thumb width
 *
 * @type Number
 * @default 20
 */
ScrollBar.prototype.minThumbWidth = 20;

/**
 * The minimum thumb height
 *
 * @type Number
 * @default 20
 */
ScrollBar.prototype.minThumbHeight = 20;

/**
 * Default scroll bar skin name
 *
 * @static
 * @final
 * @type String
 */
ScrollBar.SKIN_NAME = 'scroll_bar';

/**
 * @private
 */
ScrollBar.prototype.scrollableredraw = Scrollable.prototype.redraw;

/**
 * Recalculate scroll thumb width/height
 *
 * @private
 */
ScrollBar.prototype.redraw = function() {
    if (this.invalidTrack) {
        if (this.container && this.container.viewPort && this.thumb) {
            if (this.direction === Scrollable.HORIZONTAL) {
                this.thumb.width = Math.max(this.minThumbWidth,
                    this.container.width /
                    (this.container.viewPort.width / this.container.width));
            } else {
                this.thumb.height = Math.max(this.minThumbHeight,
                    this.container.height /
                    (this.container.viewPort.height / this.container.height));
            }
        }
        this.scrollableredraw(this);
    }
};

/**
 * Thumb has been moved. Scroll content to position
 *
 * @param x x-position to scroll to (ignored when vertical)
 * @param y y-position to scroll to (ignored when horizontal)
 */
ScrollBar.prototype.thumbMoved = function(x, y) {
    if (this.container && this.container.viewPort) {
        if (this._direction === Scrollable.HORIZONTAL) {
            this.container._scrollContent(
                -(this.container.viewPort.width - this.container.width) *
                    (x / (this.container.width - this.thumb.width)),
                0);
        } else if (this._direction === Scrollable.VERTICAL) {
            this.container._scrollContent(
                0,
                -(this.container.viewPort.height - this.container.height) *
                    (y / (this.container.height - this.thumb.height)));
        }
    }
};

/**
 * Determines if the scroll bar's thumb can be dragged horizontally or
 * vertically.
 *
 * @name GOWN.ScrollBar#direction
 * @type String
 */
Object.defineProperty(ScrollBar.prototype, 'direction', {
    get: function() {
        return this._direction;
    },
    set: function(direction) {
        this._direction = direction;
        this.invalid = true;
    }
});

/**
 * Value of the scrollbar
 *
 * @name GOWN.ScrollBar#value
 * @type Number
 */
//TODO: put in Scrollable
Object.defineProperty(ScrollBar.prototype, 'value', {
    get: function() {
        return this._value;
    },
    set: function(value) {
        this._value = value;
    }
});


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var Button = __webpack_require__(4);

/**
 * Thumb button that can be moved on the scrollbar
 *
 * @class ScrollThumb
 * @extends GOWN.Button
 * @memberof GOWN
 * @constructor
 * @param scrollable The scrollable that the scroll thumb belongs to {GOWN.Scrollable}
 * @param [theme] theme for the scroll thumb {GOWN.Theme}
 * @param [skinName=ScrollThumb.SKIN_NAME] name of the scroll thumb skin {String}
 */
function ScrollThumb(scrollable, theme, skinName) {
    /**
     * The scrollable that the scroll thumb belongs to
     *
     * @type GOWN.Scrollable
     */
    this.scrollable = scrollable;

    var defaultSkin = ScrollThumb.SKIN_NAME;
    if (!theme.thumbSkin) {
        defaultSkin = Button.SKIN_NAME;
    }

    /**
     * The skin name
     *
     * @type String
     * @default ScrollThumb.SKIN_NAME
     */
    this.skinName = skinName || defaultSkin;

    if (theme.thumbSkin) {
        /**
         * The valid scroll thumb states
         *
         * @private
         * @type String[]
         * @default ScrollThumb.THUMB_STATES
         */
        this._validStates = ScrollThumb.THUMB_STATES;
    }
    if (theme.thumbWidth) {
        /**
         * The width of the scroll thumb
         *
         * @type Number
         */
        this.width = theme.thumbWidth;
    }
    if (theme.thumbHeight) {
        /**
         * The height of the scroll thumb
         *
         * @type Number
         */
        this.height = theme.thumbHeight;
    }

    Button.call(this, theme, this.skinName);

    /**
     * Invalidate track so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidTrack = true;

    this.on('touchmove', this.handleMove, this);
    this.on('mousemove', this.handleMove, this);

    /* jshint unused: false */
    this.on('touchdown', this.handleDown, this);
    this.on('mousedown', this.handleDown, this);
    /* jshint unused: false */

    this.on('mouseup', this.handleUp, this);
    this.on('touchend', this.handleUp, this);
    this.on('touchendoutside', this.handleUp, this);
}

ScrollThumb.prototype = Object.create( Button.prototype );
ScrollThumb.prototype.constructor = ScrollThumb;
module.exports = ScrollThumb;

/**
 * Default scroll thumb skin name
 *
 * @static
 * @final
 * @type String
 */
ScrollThumb.SKIN_NAME = 'scroll_thumb';

/**
 * Names of possible states for a scroll thumb
 *
 * @static
 * @final
 * @type String[]
 * @private
 */
ScrollThumb.THUMB_STATES = [
    'horizontal_up', 'vertical_up',
    'horizontal_down', 'vertical_down',
    'horizontal_hover', 'vertical_hover'
];

var originalCurrentState = Object.getOwnPropertyDescriptor(Button.prototype, 'currentState');

/**
 * The current state (one of _validStates)
 *
 * @name GOWN.ScrollThumb#currentState
 * @type String
 */
Object.defineProperty(ScrollThumb.prototype, 'currentState',{
    set: function(value) {
        if (this.theme.thumbSkin) {
            // use skin including direction instead of default skin
            value = this.scrollable.direction + '_' + value;
        }
        originalCurrentState.set.call(this, value);
    }
});

ScrollThumb.prototype.handleDown = function(mouseData) {
    var local = mouseData.data.getLocalPosition(this.scrollable);
    this.scrollable._start = [local.x, local.y];
    //this.scrollable.handleDown(mouseData);
    mouseData.stopPropagation();
};

/**
 * onMove callback
 *
 * @protected
 */
ScrollThumb.prototype.handleMove = function (mouseData) {
    this.scrollable.handleMove(mouseData);
};

/**
 * onUp callback
 *
 * @protected
 */
ScrollThumb.prototype.handleUp = function (mouseData) {
    this.scrollable.handleUp(mouseData);
};

/**
 * Show track icon on thumb
 *
 * @param skin The new scroll thumb skin name {String}
 */
ScrollThumb.prototype.showTrack = function(skin) {
    if (this.skin !== skin) {
        if(this.skin) {
            this.removeChild(this.skin);
        }

        this.addChild(skin);
        this.skin = skin;
    }
    skin.x = Math.floor((this.width - skin.getBounds().width )/ 2);
    skin.y = Math.floor((this.height - skin.getBounds().height )/ 2);
    this.invalidTrack = false;
};

/**
 * Redraw the skin
 *
 * @private
 */
ScrollThumb.prototype.redraw = function() {
    if (this.invalidTrack && this.theme.thumbSkin) {
        this.fromSkin(this.scrollable.direction+'_thumb', this.showTrack);
    }
};

/**
 * Move the thumb on the scroll bar within its bounds
 *
 * @param x New calculated x position of the thumb {Number}
 * @param y New calculated y position of the thumb {Number}
 * @returns {boolean} returns true if the position of the thumb has been
 * moved
 */
ScrollThumb.prototype.move = function(x, y) {
    if (this.scrollable.direction === GOWN.Scrollable.HORIZONTAL) {
        if (isNaN(x)) {
            return false;
        }
        x = Math.min(x, this.scrollable.maxWidth());
        x = Math.max(x, 0);
        if (x !== this.x) {
            this.x = x;
            return true;
        }
    } else {
        if (isNaN(y)) {
            return false;
        }
        y = Math.min(y, this.scrollable.maxHeight());
        y = Math.max(y, 0);
        if (y !== this.y) {
            this.y = y;
            return true;
        }
    }
    return false;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var InputControl = __webpack_require__(5),
    InputWrapper = __webpack_require__(23),
    position = __webpack_require__(28);

/**
 * The basic Text Input - based on PIXI.Input.
 * Input by Sebastian Nette, see https://github.com/SebastianNette/PIXI.Input
 *
 * @class TextInput
 * @extends GOWN.InputControl
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the text input {GOWN.Theme}
 * @param [skinName=TextInput.SKIN_NAME] name of the text input skin {String}
 */
function TextInput(theme, skinName) {
    // show and load background image as skin (exploiting skin states)
    /**
     * The skin name
     *
     * @type String
     * @default TextInput.SKIN_NAME
     */
    this.skinName = skinName || TextInput.SKIN_NAME;

    /**
     * The valid text input states
     *
     * @private
     * @type String[]
     * @default InputControl.stateNames
     */
    this._validStates = this._validStates || InputControl.stateNames;

    InputControl.call(this, theme);
}

TextInput.prototype = Object.create(InputControl.prototype);
TextInput.prototype.constructor = TextInput;
module.exports = TextInput;

/**
 * Default text area skin name
 *
 * @static
 * @final
 * @type String
 */
TextInput.SKIN_NAME = 'text_input';

/**
 * Set display as password (show text with "*")
 *
 * @name GOWN.TextInput#displayAsPassword
 * @type bool
 */
Object.defineProperty(TextInput.prototype, 'displayAsPassword', {
    get: function () {
        return this._displayAsPassword;
    },
    set: function (displayAsPassword) {
        this._displayAsPassword = displayAsPassword;
        this.setText(this._origText);
    }
});

/**
 * Get the text lines as an array
 *
 * @returns {Array|*} Returns an array with one text line per array element
 */
TextInput.prototype.getLines = function() {
    return [this.text];
};

/**
 * @private
 */
TextInput.prototype.inputControlSetText = InputControl.prototype.setText;

/**
 * Set the text
 *
 * @param text The text to display {String}
 */
TextInput.prototype.setText = function(text) {
    if (this._displayAsPassword) {
        text = text.replace(/./gi, '*');
    }
    var hasText = this.pixiText !== undefined;
    this.inputControlSetText(text);
    if (!hasText && this.height > 0) {
        position.centerVertical(this.pixiText);
        // set cursor to start position
        if (this.cursor) {
            this.cursor.y = this.pixiText.y;
        }
    }
};

/**
 * Update the selection
 *
 * @private
 */
TextInput.prototype.updateSelectionBg = function() {
    var start = this.selection[0],
        end = this.selection[1];

    this.selectionBg.clear();
    if (start !== end) {
        start = this.textWidth(this.text.substring(0, start));
        end = this.textWidth(this.text.substring(0, end));
        this.selectionBg.beginFill(0x0080ff);
        this.selectionBg.drawRect(start, 0, end - start, this.pixiText.height);
        this.selectionBg.x = this.pixiText.x;
        this.selectionBg.y = this.pixiText.y;
    }
};


// TODO: autoSizeIfNeeded


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var ToggleButton = __webpack_require__(0);
var Button = __webpack_require__(4);

/**
 * The default list item renderer.
 *
 * @class DefaultListItemRenderer
 * @extends GOWN.ToggleButton
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the DefaultListItemRenderer {GOWN.Theme}
 */
function DefaultListItemRenderer(theme) {
    ToggleButton.call(this, theme);

    /**
     * A key in the item data that will be shown as label for the item.
     * e.g. 'text' for item.text.
     * will be ignored if labelFunction is set.
     *
     * the item will be shown directly (using toString) if
     * labelField and labelFunction are not set.
     *
     * @type String
     * @default 'text'
     */
    this.labelField = 'text';

    /**
	 * A function used to generate label text for a specific item. If this
	 * function is not null, then the <code>labelField</code> will be
	 * ignored.
	 *
	 * <p>In the following example, the label function is customized:</p>
	 * renderer.labelFunction = function( item ) {
	 *    return item.firstName + " " + item.lastName;
	 * };</listing>
	 *
     * @type function
	 * @default null
	 *
	 * @see #labelField
	 */
    this.labelFunction = null;

    /**
     * The list item data
     *
     * @private
     * @default null
     */
    this._data = null;

    /**
     * Overwrite data values before next draw call.
     *
     * @private
     * @type bool
     * @default false
     */
    this.dataInvalid = false;


    // TODO: use min/max and/or default values instead, because percentages
    // have higher priority, so this forces the user to remove the percentage
    // before he can set pixel values.
    /**
     * Percent width
     *
     * @private
     * @type Number
     * @default 100
     */
    this.percentWidth = 100;

    /**
     * Percent height
     *
     * @private
     * @type Number
     * @default 100
     */
    this.percentHeight = 100;
}

DefaultListItemRenderer.prototype = Object.create( ToggleButton.prototype );
DefaultListItemRenderer.prototype.constructor = DefaultListItemRenderer;
module.exports = DefaultListItemRenderer;

// performance increase to avoid using call.. (10x faster)
DefaultListItemRenderer.prototype.redrawButton = Button.prototype.redraw;

/**
 * Update button text before draw call
 */
DefaultListItemRenderer.prototype.redraw = function() {
    if (this.dataInvalid) {
        this.commitData();
    }
    this.redrawButton();
};

/**
 * Updates the renderer to display the item's data. Override this
 * function to pass data to sub-components and react to data changes.
 *
 * <p>Don't forget to handle the case where the data is <code>null</code>.</p>
 */
DefaultListItemRenderer.prototype.commitData = function() {
    if(this._data) {
        this.label = this.itemToLabel(this._data);
    }
    this.dataInvalid = false;
};

/**
 * Using <code>labelField</code> and <code>labelFunction</code>,
 * generates a label from the item.
 *
 * <p>All of the label fields and functions, ordered by priority:</p>
 * <ol>
 *     <li><code>labelFunction</code></li>
 *     <li><code>labelField</code></li>
 * </ol>
 *
 * @param item the item that gets converted to a label
 */
DefaultListItemRenderer.prototype.itemToLabel = function(item) {
	if (this.labelFunction) {
		return this.labelFunction(item).toString();
	}
	else if (this.labelField && item && item.hasOwnProperty(this.labelField)) {
		return item[this.labelField].toString();
	}
	else if(item) {
		return item.toString();
	}
	return '';
};

/**
 * Data
 *
 * @name GOWN.DefaultListItemRenderer#data
 */
Object.defineProperty(DefaultListItemRenderer.prototype, 'data', {
    set: function(data) {
        this._data = data;
        this.dataInvalid = true;
    },
    get: function() {
        return this._data;
    }
});


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(3);

/**
 * Used to handle data manipulation (emit events when data changes, so for
 *  example a List showing it can be updated and the user does not need to
 *  call a special update function every time he adds/removes data from the
 *  ListCollection.
 * Use the ListCollection functions to manipulate the data-array OR modify it
 * using the default array-functions and dispatch the CHANGED-Event yourself.
 *
 * @class ListCollection
 * @extends EventEmitter
 * @memberof GOWN
 * @constructor
 * @param [data] The data source {Array}
 */
function ListCollection(data) {
    EventEmitter.call(this);

    if (!data) {
        data = [];
    }
    this.data = data;
}

ListCollection.prototype = Object.create( EventEmitter.prototype );
ListCollection.prototype.constructor = ListCollection;
module.exports = ListCollection;

/**
 * Dispatched when the list data gets changed.
 *
 * @static
 * @final
 * @type String
 */
ListCollection.CHANGED = 'changed';

/**
 * Dispatched when the list gets cleared.
 *
 * @static
 * @final
 * @type String
 */
ListCollection.RESET = 'reset';

/**
 * Dispatched when a list item gets removed from the list.
 *
 * @static
 * @final
 * @type String
 */
ListCollection.REMOVE_ITEM = 'removeItem';

/**
 * Dispatched when a list item gets replaced.
 *
 * @static
 * @final
 * @type String
 */
ListCollection.REPLACE_ITEM = 'replaceItem';

/**
 * Dispatched when an item gets added to the list.
 *
 * @static
 * @final
 * @type String
 */
ListCollection.ADD_ITEM = 'addItem';

/**
 * The data source for this collection. Has to be an array.
 *
 * @name GOWN.ListCollection#data
 * @type Array
 */
Object.defineProperty(ListCollection.prototype, 'data', {
    set: function(data) {
        this._data = data;
        this.emit(ListCollection.CHANGED);
    },
    get: function() {
        return this._data;
    }
});

/**
 * The length of the list
 *
 * @name GOWN.ListCollection#length
 * @type Number
 * @readonly
 */
Object.defineProperty(ListCollection.prototype, 'length', {
    get: function() {
        if (!this.data) {
            return 0;
        }
        return this._data.length;
    }
});

/**
 * Get an item at a specific index
 *
 * @param index The index to get the item from {Number}
 * @returns {Object} The item at the specific index
 */
ListCollection.prototype.getItemAt = function(index) {
    return this._data[index];
};

/**
 * Get the index of a list item
 *
 * @param item The list item {Object}
 * @returns {Number} The item index
 */
ListCollection.prototype.getItemIndex = function(item) {
    return this._data.indexOf(item);
};

/**
 * Add a new item between index and index+1
 *
 * @param item The new item {Object}
 * @param index The index where the item gets inserted {Number}
 */
ListCollection.prototype.addItemAt = function(item, index) {
    this._data.splice(index, 0, item);
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.ADD_ITEM, item, index);
};

/**
 * Removes the item at the specific index from the collection and
 * returns it.
 *
 * @param index The item index {Number}
 * @returns {Object}
 */
ListCollection.prototype.removeItemAt = function (index) {
    var item = this._data.splice(index, 1);
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.REMOVE_ITEM, item, index);
    return item;
};

/**
 * Removes an item from the list
 *
 * @param item The item to remove {Object}
 */
ListCollection.prototype.removeItem = function (item) {
    var index = this.getItemIndex(item);
    if (index >= 0) {
		this.removeItemAt(index);
	}
};

/**
 * Removes all items from the list
 *
 * @param item
 */
ListCollection.prototype.removeAll = function (item) {
    if (this._data.length === 0) {
        return;
    }
    this._data.length = 0;
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.RESET);
};

/**
 * Set an item at a specific index
 *
 * @param item The item that gets added {Object}
 * @param index The index where the item gets set {Number}
 */
ListCollection.prototype.setItemAt = function (item, index) {
    this._data[index] = item;
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.REPLACE_ITEM, index, item);
};

/**
 * Push an item on the list at the last position
 *
 * @param item The item to push {Object}
 */
ListCollection.prototype.push = function (item) {
    this._data.push(item);
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.ADD_ITEM, item, this._data.length-1);
};

/**
 * Pop the last item from the last
 */
ListCollection.prototype.pop = function () {
    var item = this._data.pop();
    this.emit(ListCollection.CHANGE, item);
    this.emit(ListCollection.REMOVE_ITEM, item, this._data.length);
};

/**
 * Add an item to the front of the list
 *
 * @param item The item to add {Object}
 */
ListCollection.prototype.unshift = function (item) {
    this.addItemAt(item, 0);
};

/**
 * Remove the item at the front of the list
 */
ListCollection.prototype.shift = function () {
    this.removeItemAt(0);
};

/**
 * Checks if an item is in the list
 *
 * @param item The item to check {Object}
 * @returns {boolean} True if the item is in the list, otherwise false
 */
ListCollection.prototype.contains = function (item) {
    return this.getItemIndex(item) >= 0;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var ScaleContainer = __webpack_require__(24);
var ThemeFont = __webpack_require__(22);
var EventEmitter = __webpack_require__(3);

/**
 * Basic theming/skinning.
 *
 * @class Theme
 * @memberof GOWN
 * @constructor
 * @param [global=true] Set theme as the global GOWN.theme
 */
function Theme(global) {
    EventEmitter.call(this);

    /**
     * At its core a theme is just a dict that holds a collection of skins.
     * Every skin is a function that returns a renderable item (e.g. a texture)
     *
     * @private
     * @type Object
     */
    this._skins = {};

    if (this.textStyle) {
        this.textStyle.clone();
    } else {
        /**
         * The default font for all labels (e.g. button label)
         *
         * @type GOWN.ThemeFont
         */
        this.textStyle = new ThemeFont();
    }

    if (global === true || global === undefined) {
        GOWN.theme = this;
    }

    /**
     * The cache for the theme textures
     *
     * @type PIXI.Texture[]
     */
    this.textureCache = null;

    /**
     * Use an own skin for scroll/slider track (uses the default button skin otherwise)
     *
     * @type bool
     * @default true
     */
    this.thumbSkin = true;

    /**
     * Desktop themes have a hover skin if the mouse moves over the button
     *
     * @type bool
     * @default true
     */
    this.hoverSkin = true;
}

Theme.prototype = Object.create( EventEmitter.prototype );
Theme.prototype.constructor = Theme;
module.exports = Theme;

/**
 * Dispatched when a skin has changed
 *
 * @static
 * @final
 * @type String
 */
Theme.SKIN_CHANGED = 'skin_changed';

/**
 * Dispatched when a theme texture has loaded
 *
 * @static
 * @final
 * @type String
 */
Theme.LOADED = 'loaded';

/**
 * Dispatched when a theme texture has been loaded and all controls have an assigned skin
 *
 * @static
 * @final
 * @type String
 */
Theme.COMPLETE = 'complete';

/**
 * Set the skin for a UI component
 *
 * @param comp UI component that we want to skin, e.g. "button" {String}
 * @param id Id for the skin (e.g. state when the skinning function will be applied {String}
 * @param skin skin-function that will executed once the component gets updated {function}
 */
Theme.prototype.setSkin = function(comp, id, skin) {
    this._skins[comp] = this._skins[comp] || {};
    this._skins[comp][id] = skin;
    this.emit(Theme.SKIN_CHANGED, comp, this);
};

/**
 * Set up the asset loader and load files
 *
 * @param jsonPath The path to the json file {String}
 */
Theme.prototype.addImage = function(jsonPath) {
    this._jsonPath = jsonPath;
    GOWN.loader.add(jsonPath)
        .once('complete', this.loadComplete.bind(this));
};

/**
 * Executed when the image has been loaded.
 * Sets cache and emits events.
 *
 * @see addImage
 * @see resource-loader https://github.com/englercj/resource-loader
 *
 * @param loader The loader {Loader}
 * @param resources The loaded resources {Object}
 */
Theme.prototype.loadComplete = function(loader, resources) {
    this.setCache(resources);
    this.emit(Theme.LOADED, this);
    this.applyTheme();
};

/**
 * Set the texture cache (normally called when loading is complete)
 *
 * @param resources The loaded resources {Object}
 */
Theme.prototype.setCache = function(resources) {
    this.textureCache = resources[this._jsonPath].textures;
};

/**
 * Apply the theme to the controls
 * (normally executed only once after the texture has been loaded)
 */
Theme.prototype.applyTheme = function() {
    this.emit(Theme.COMPLETE, this);
};

/**
 * Create a new Scalable Container
 *
 * @param name Id defined in the asset loader {String}
 * @param grid Grid defining the inner square of the scalable container {PIXI.Rectangle}
 * @param [middleWidth] The alternative width to crop the center piece
 * (only needed if we want to scale the image smaller than the original) {Number}
 * @param [centerHeight] The alternative height to crop the center piece
 * (only needed if we want to scale the image smaller than the original) {Number}
 * @return {Function}
 */
Theme.prototype.getScaleContainer = function(name, grid, middleWidth, centerHeight) {
    var scope = this;
    return function() {
        var texture = scope.textureCache[name];
        if(!texture) {
            throw new Error('The frameId "' + name + '" does not exist ' +
            'in the texture cache');
        }
        return new ScaleContainer(texture, grid, middleWidth, centerHeight);
    };
};

/**
 * Create a new Sprite from an image name
 *
 * @param name Id defined in the asset loader {String}
 * @returns {function}
 */
Theme.prototype.getImage = function(name) {
    var scope = this;
    return function() {
        if (scope.textureCache && name in scope.textureCache) {
            return new PIXI.Sprite(scope.textureCache[name]);
        } else {
            // not found - try to load the image.
            return new PIXI.Sprite(PIXI.Texture.fromImage(name));
        }
    };
};

/**
 * Get a skin by a component name and state (or type)
 *
 * @param comp Name of the component (e.g. button) {String}
 * @param state State or type of the skin (e.g. "up") {String}
 * @returns {PIXI.DisplayObject}
 */
Theme.prototype.getSkin = function(comp, state) {
    if (this._skins[comp] && this._skins[comp][state]) {
        return this._skins[comp][state]();
    }
    return null;
};

/**
 * Shortcut to remove the theme from the global context
 */
Theme.removeTheme = function() {
    GOWN.theme = undefined;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

var OPTIONS = ['fontSize', 'fontFamily', '_fontSize', '_fontFamily',
               'wordWrap', 'wordWrapWidth', 'lineHeight',
               'fill', 'align', 'stroke', 'strokeThickness',
               'dropShadow', 'dropShadowColor', 'dropShadowAngle',
               'dropShadowDistance', 'padding', 'textBaseline',
               'lineJoin', 'miterLimit'];

/**
 * Font theme
 *
 * @class ThemeFont
 * @memberof GOWN
 * @constructor
 * @param data The font style object {Object}
 */
function ThemeFont(data) {
    for(var key in data) {
        if(OPTIONS.indexOf(key) !== -1) {
            this[key] = data[key];
        }
    }

    /**
     * The font fill color
     *
     * @type String
     * @default '#000'
     */
    this.fill = this.fill || '#000';

    /**
     * The font family
     *
     * @private
     * @type String
     * @default 'Arial'
     */
    this._fontFamily = this._fontFamily || 'Arial';

    /**
     * The font size
     *
     * @private
     * @type Number
     * @default 12
     */
    this._fontSize = this._fontSize || 12;

    /**
     * @member GOWN.ThemeFont#wordWrap
     */

    /**
     * @member GOWN.ThemeFont#wordWrapWidth
     */

    /**
     * @member GOWN.ThemeFont#lineHeight
     */

    /**
     * @member GOWN.ThemeFont#align
     */

    /**
     * @member GOWN.ThemeFont#stroke
     */

    /**
     * @member GOWN.ThemeFont#strokeThickness
     */

    /**
     * @member GOWN.ThemeFont#dropShadow
     */

    /**
     * @member GOWN.ThemeFont#dropShadowColor
     */

    /**
     * @member GOWN.ThemeFont#dropShadowAngle
     */

    /**
     * @member GOWN.ThemeFont#dropShadowDistance
     */

    /**
     * @member GOWN.ThemeFont#textBaseline
     */

    /**
     * @member GOWN.ThemeFont#lineJoin
     */

    /**
     * @member GOWN.ThemeFont#miterLimit
     */
}

module.exports = ThemeFont;

/**
 * Clone the ThemeFont instance
 *
 * @return {GOWN.ThemeFont} The cloned font theme
 */
ThemeFont.prototype.clone = function() {
    var re = new ThemeFont();
    for(var key in this) {
        if(OPTIONS.indexOf(key) !== -1) {
            re[key] = this[key];
        }
    }
    re._updateFont();
    return re;
};

/**
 * Update the font string
 *
 * @private
 */
ThemeFont.prototype._updateFont = function() {
    this._font = this._fontSize + 'px ' + this._fontFamily;
};

/**
 * Instead of setting font using fontFamily and fontSize is encouraged
 *
 * @name GOWN.ThemeFont#font
 * @type String
 * @deprecated
 */
Object.defineProperty(ThemeFont.prototype, 'font', {
    get: function() {
        return this._font;
    }
});

/**
 * The font size
 *
 * @name GOWN.ThemeFont#fontSize
 * @type Number
 * @default 12
 */
Object.defineProperty(ThemeFont.prototype, 'fontSize', {
    get: function() {
        return this._fontSize;
    },
    set: function(value) {
        this._fontSize = value;
        this._updateFont();
    }
});

/**
 * The font family
 *
 * @name GOWN.ThemeFont#fontFamily
 * @type String
 * @default 'Arial'
 */
Object.defineProperty(ThemeFont.prototype, 'fontFamily', {
    get: function() {
        return this._fontFamily;
    },
    set: function(value) {
        this._fontFamily = value;
        this._updateFont();
    }
});


/***/ }),
/* 23 */
/***/ (function(module, exports) {

/**
 * Wrapper for DOM Text Input.
 *
 * Based on PIXI.Input InputObject by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class InputWrapper
 * @memberof GOWN
 * @static
 */
function InputWrapper() {
}

module.exports = InputWrapper;

/**
 * DOM input field.
 * We use one input field for all InputControls
 *
 * @name GOWN.InputWrapper.hiddenInput
 * @type HTMLInputElement
 * @static
 */
InputWrapper.hiddenInput = null;

/**
 * Create a unique input field.
 *
 * @returns {HTMLInputElement} The input field
 */
InputWrapper.createInput = function() {
    if (!InputWrapper.hiddenInput) {
        var input = document.createElement('input');
        input.type = 'text';
        input.tabindex = -1;
        input.style.position = 'fixed';
        input.style.opacity = 0;
        input.style.pointerEvents = 'none';
        input.style.left = '0px';
        input.style.bottom = '0px';
        input.style.left = '-100px';
        input.style.top = '-100px';
        input.style.zIndex = 10;

        // add blur handler
        input.addEventListener('blur', function() {
            if (GOWN.InputControl.currentInput) {
                GOWN.InputControl.currentInput.onMouseUpOutside();
            }
        }, false);

        // on key up
        input.addEventListener('keyup', function() {
            if (GOWN.InputControl.currentInput) {
                if (GOWN.InputControl.currentInput.hasFocus) {
                    GOWN.InputControl.currentInput.onInputChanged();
                }
            }
        });

        document.body.appendChild(input);

        InputWrapper.hiddenInput = input;
    }
    return InputWrapper.hiddenInput;
};

/**
 * The key to get the text ('value' for default input field)
 *
 * @static
 * @type {String}
 * @private
 */
InputWrapper.textProp = 'value';

/**
 * Focus the text input
 *
 * @function GOWN.InputWrapper.focus
 */
InputWrapper.focus = function() {
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.focus();
    }
};

/**
 * Blur the text input
 *
 * @function GOWN.InputWrapper.blur
 */
InputWrapper.blur = function() {
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.blur();
    }
};

/**
 * Set the new selection
 *
 * @function GOWN.InputWrapper.setSelection
 * @param start First position {Number}
 * @param end Last position {Number}
 */
InputWrapper.setSelection = function(start, end) {
    if (InputWrapper.hiddenInput) {
        if(start < end) {
            InputWrapper.hiddenInput.selectionStart = start;
            InputWrapper.hiddenInput.selectionEnd = end;
        } else {
            InputWrapper.hiddenInput.selectionStart = end;
            InputWrapper.hiddenInput.selectionEnd = start;
        }
    } else {
        InputWrapper._selection = [start, end];
    }
};

/**
 * Get the start and end of the current selection
 *
 * @function GOWN.InputWrapper.getSelection
 * @returns {Number[]} The start and end of the current selection
 */
InputWrapper.getSelection = function() {
    if (InputWrapper.hiddenInput) {
        return [
            InputWrapper.hiddenInput.selectionStart,
            InputWrapper.hiddenInput.selectionEnd
        ];
    } else {
        return InputWrapper._selection;
    }
};

/**
 * Set the cursor position of the hidden input
 *
 * @function GOWN.InputWrapper.setCursorPos
 */
InputWrapper.setCursorPos = function (pos) {
    if (InputWrapper.hiddenInput) {
        var elem = InputWrapper.hiddenInput;
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', pos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(pos, pos);
            }
            else
                elem.focus();
        }
    }
};

/**
 * Get the text value from the hidden input
 *
 * @function GOWN.InputWrapper.getText
 * @returns {String} The text value
 */
InputWrapper.getText = function() {
    if (InputWrapper.hiddenInput) {
        var textProp = InputWrapper.textProp;
        var txt = InputWrapper.hiddenInput[textProp];
        return txt.replace(/\r/g, '');
    } else {
        return InputWrapper._text;
    }

};

/**
 * Set the text value of the hidden input
 *
 * @function GOWN.InputWrapper.setText
 * @param {String} text The text to set {String}
 */
InputWrapper.setText = function(text) {
    if (InputWrapper.hiddenInput) {
        var textProp = InputWrapper.textProp;
        InputWrapper.hiddenInput[textProp] = text;
    } else {
        InputWrapper._text = text;
    }
};

/**
 * Set the maximum length.
 * Setting it to 0 will allow unlimited text input
 *
 * @function GOWN.InputWrapper.setMaxLength
 * @param length The maximum length {Number}
 */
InputWrapper.setMaxLength = function(length) {
    if (InputWrapper.hiddenInput) {
        if (!length || length < 0) {
            InputWrapper.hiddenInput.removeAttribute('maxlength');
        } else {
            InputWrapper.hiddenInput.setAttribute('maxlength', length);
        }
    } else {
        InputWrapper._maxLength = length;
    }
};

/**
 * Set the input type of the hidden input
 *
 * @function GOWN.InputWrapper.setType
 * @param type The new type for the hidden input {String}
 */
InputWrapper.setType = function(type) {
    if (InputWrapper.hiddenInput) {
        InputWrapper.hiddenInput.type = type;
    } else {
        InputWrapper._type = type;
    }
};

/**
 * Get the input type of the hidden input
 *
 * @function GOWN.InputWrapper.getType
 * @returns {String} The input type
 */
InputWrapper.getType = function() {
    if (InputWrapper.hiddenInput) {
        return InputWrapper.hiddenInput.type;
    } else {
        return InputWrapper._type;
    }
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

/**
 * Scale 9 Container.
 * e.g. useful for scalable buttons.
 *
 * @class ScaleContainer
 * @extends PIXI.Container
 * @memberof GOWN
 * @constructor
 * @param texture The PIXI texture {PIXI.Texture}
 * @param rect The rectangle with position and dimensions of the center piece.
 * Will be used to calculate positions of all other pieces {PIXI.Rectangle}
 * @param [middleWidth] The alternative width to crop the center piece
 * (only needed if we want to scale the image smaller than the original) {Number}
 * @param [centerHeight] The alternative height to crop the center piece
 * (only needed if we want to scale the image smaller than the original) {Number}
 */
function ScaleContainer(texture, rect, middleWidth, centerHeight) {
    PIXI.Container.call( this );

    /**
     * The rectangle with position and dimensions of the center piece.
     * Will be used to calculate positions of all other pieces.
     *
     * @type PIXI.Rectangle
     */
    this.rect = rect;

    /**
     * The base texture of the scale container
     *
     * @type PIXI.BaseTexture
     */
    this.baseTexture = texture.baseTexture;

    /**
     * The frame of the scale container
     *
     * @type PIXI.Rectangle
     */
    this.frame = texture.frame;

    /**
     * The width of the scale container
     *
     * @private
     * @type Number
     */
    this._width = this.frame.width;

    /**
     * The height of the scale container
     *
     * @private
     * @type Number
     */
    this._height = this.frame.height;

    // left / middle / right width
    var lw = rect.x;
    var mw = rect.width;
    var rw = this.frame.width - (mw + lw);

    // top / center / bottom height
    var th = rect.y;
    var ch = rect.height;
    var bh = this.frame.height - (ch + th);

    middleWidth = middleWidth || mw;
    centerHeight = centerHeight || ch;

    /**
     * Calculated min. width based on tile sizes in pixel without scaling
     * (if middleWidth is not set it is the same as the width of the
     * texture in the atlas)
     *
     * @type Number
     */
    this.minWidth = lw + middleWidth + rw;

    /**
     * Calculated min. height based on tile sizes in pixel without scaling
     * (if middleWidth is not set it is the same as the height of the
     * texture in the atlas)
     *
     * @type Number
     */
    this.minHeight = th + centerHeight + bh;

    if (lw > 0 && th > 0) {
        /**
         * The top left sprite
         *
         * @type {PIXI.Sprite}
         */
        this.tl = this._getTexture(0, 0, lw, th);
        this.addChild(this.tl);
    }

    if (mw > 0 && th > 0) {
        /**
         * The top middle sprite
         *
         * @type {PIXI.Sprite}
         */
        this.tm = this._getTexture(lw, 0, middleWidth, th);
        this.addChild(this.tm);
        this.tm.x = lw;
    }

    if (rw > 0 && th > 0) {
        /**
         * The top right sprite
         *
         * @type {PIXI.Sprite}
         */
        this.tr = this._getTexture(lw + mw, 0, rw, th);
        this.addChild(this.tr);
    }

    if (lw > 0 && ch > 0) {
        /**
         * The center left sprite
         *
         * @type {PIXI.Sprite}
         */
        this.cl = this._getTexture(0, th, lw, centerHeight);
        this.addChild(this.cl);
        this.cl.y = th;
    }

    if (mw > 0 && ch > 0) {
        /**
         * The center middle sprite
         *
         * @type {PIXI.Sprite}
         */
        this.cm = this._getTexture(lw, th, middleWidth, centerHeight);
        this.addChild(this.cm);
        this.cm.y = th;
        this.cm.x = lw;
    }

    if (rw > 0 && ch > 0) {
        /**
         * The center right sprite
         *
         * @type {PIXI.Sprite}
         */
        this.cr = this._getTexture(lw + mw, th, rw, centerHeight);
        this.addChild(this.cr);
        this.cr.y = th;
    }

    if (lw > 0 && bh > 0) {
        /**
         * The bottom left sprite
         *
         * @type {PIXI.Sprite}
         */
        this.bl = this._getTexture(0, th + ch, lw, bh);
        this.addChild(this.bl);
    }

    if (mw > 0 && bh > 0) {
        /**
         * The bottom middle sprite
         *
         * @type {PIXI.Sprite}
         */
        this.bm = this._getTexture(lw, th + ch, middleWidth, bh);
        this.addChild(this.bm);
        this.bm.x = lw;
    }

    if (rw > 0 && bh > 0) {
        /**
         * The bottom right sprite
         *
         * @type {PIXI.Sprite}
         */
        this.br = this._getTexture(lw + mw, th + ch, rw, bh);
        this.addChild(this.br);
    }
}

ScaleContainer.prototype = Object.create( PIXI.Container.prototype );
ScaleContainer.prototype.constructor = ScaleContainer;
module.exports = ScaleContainer;

/**
 * Set the scaling width and height
 *
 * @private
 */
ScaleContainer.prototype._updateScales = function() {
    this._positionTilable();

    var scaleOriginals = this.scaleOriginals = {};

    var scaleOriginal = function(name, elem) {
        if (elem && elem.width && elem.height) {
            scaleOriginals[name] = {
                width: elem.width,
                height: elem.height
            };
        }
    };

    scaleOriginal('tl', this.tl);
    scaleOriginal('tm', this.tm);
    scaleOriginal('tr', this.tr);

    scaleOriginal('cl', this.cl);
    scaleOriginal('cm', this.cm);
    scaleOriginal('cr', this.cr);

    scaleOriginal('bl', this.bl);
    scaleOriginal('bm', this.bm);
    scaleOriginal('br', this.br);
};

/**
 * Create a new texture from a base-texture by a given dimensions
 *
 * @param x The x-position {Number}
 * @param y The y-position {Number}
 * @param w The width {Number}
 * @param h The height {Number}
 * @return {PIXI.Sprite} The sprite with the created texture
 * @private
 */
ScaleContainer.prototype._getTexture = function(x, y, w, h) {
    var frame = new PIXI.Rectangle(this.frame.x+x, this.frame.y+y, w, h);
    var t = new PIXI.Texture(this.baseTexture, frame, frame.clone(), null);
    return new PIXI.Sprite(t);
};

/**
 * The width of the container. Setting this will redraw the component.
 *
 * @name GOWN.ScaleContainer#width
 * @type Number
 */
Object.defineProperty(ScaleContainer.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        if (this._width !== value) {
            if (this.minWidth && this.minWidth > 0 &&
                value < this.minWidth) {
                value = this.minWidth;
            }
            this._width = value;
            this.invalid = true;
            this._updateScales();
        }
    }
});

/**
 * The height of the container. Setting this will redraw the component.
 *
 * @name GOWN.ScaleContainer#height
 * @type Number
 */
Object.defineProperty(ScaleContainer.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        if (this._height !== value) {
            if (this.minHeight && this.minHeight > 0 &&
                value < this.minHeight) {
                value = this.minHeight;
            }
            this._height = value;
            this.invalid = true;
            this._updateScales();
        }
    }
});

/**
 * Update before draw call (reposition textures)
 *
 * @private
 */
ScaleContainer.prototype.redraw = function() {
    if (this.invalid) {
        this._positionTilable();
        this.invalid = false;
    }
};

/**
 * Recalculate the position of the tiles (every time the width/height changes)
 *
 * @private
 */
ScaleContainer.prototype._positionTilable = function() {
    // left / middle / right width
    var lw = this.rect.x;
    var mw = this.rect.width;
    var rw = this.frame.width - (mw + lw);

    // top / center / bottom height
    var th = this.rect.y;
    var ch = this.rect.height;
    var bh = this.frame.height - (ch + th);

    var rightX = this._width - rw;
    var bottomY = this._height - bh;
    if (this.cr) {
        this.cr.x = rightX;
    }
    if (this.br) {
        this.br.x = rightX;
        this.br.y = bottomY;
    }
    if (this.tr) {
        this.tr.x = rightX;
    }

    var middleWidth = this._width - (lw + rw);
    var centerHeight = this._height - (th + bh);
    if (this.cm) {
        this.cm.width = middleWidth;
        this.cm.height = centerHeight;
    }
    if (this.bm) {
        this.bm.width = middleWidth;
        this.bm.y = bottomY;
    }
    if (this.tm) {
        this.tm.width = middleWidth;
    }
    if (this.cl) {
        this.cl.height = centerHeight;
    }
    if (this.cr) {
        this.cr.height = centerHeight;
    }

    if (this.bl) {
        this.bl.y = bottomY;
    }
};

/**
 * Helper function that creates a sprite that will contain a texture from
 * the TextureCache based on the frameId.
 * The frame ids are created when a Texture packer file has been loaded
 *
 * @param frameId The frame id of the texture in the cache {String}
 * @param rect Defines the tilable area {Rectangle}
 * @return {GOWN.ScaleContainer} A new scalable container (e.g. a button)
 * using a texture from the texture cache matching the frameId
 */
ScaleContainer.fromFrame = function(frameId, rect) {
    var texture = PIXI.utils.TextureCache[frameId];
    if(!texture) {
        throw new Error('The frameId "' + frameId + '" does not exist ' +
                        'in the texture cache');
    }
    return new ScaleContainer(texture, rect);
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

/**
 * Holds all information related to a Slider change event
 *
 * @class SliderData
 * @memberof GOWN
 * @constructor
 */
function SliderData() {
    /**
     * The value of the slider data
     *
     * @type Number
     * @default 0
     */
    this.value = 0;

    /**
     * The target Sprite that was interacted with
     *
     * @type PIXI.Sprite
     */
    this.target = null;
}

module.exports = SliderData;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

/**
 * A wrapper around PIXI.tween OR CreateJS/TweenJS to do animations/tweening,
 * for example for a List or a Scroller.
 *
 * @see GOWN.Scroller#throwTo
 *
 * @constructor
 * @memberof GOWN
 * @param target The tween target {Object}
 * @param duration The tween duration {Number}
 * @param [easing='linear'] The easing function name {String}
 * @param [type] The tween library {String}
 */
//TODO: support greensock?
function Tween(target, duration, easing, type) {
    /**
     * The tween duration
     *
     * @type Number
     */
    this.duration = duration;

    /**
     * The easing function name
     *
     * @type String
     * @default 'linear'
     */
    this.easing = easing || 'linear';

    /**
     * The tween library
     *
     * @type String
     */
    this.type = type || this.checkLibrary();
    if (this.type === Tween.NONE) {
        /**
         * The tween target
         *
         * @private
         * @type Object
         */
        this._target = target;
    }
    this.createTween(target, duration, easing);
}

Tween.prototype = Object.create({});
Tween.prototype.constructor = Tween;
module.exports = Tween;

/**
 * The PIXI tween type
 *
 * @static
 * @final
 * @type String
 */
Tween.PIXI_TWEEN = 'PIXI_TWEEN';

/**
 * The CreateJS tween type
 *
 * @static
 * @final
 * @type String
 */
Tween.CREATEJS_TWEEN = 'CREATEJS_TWEEN';

/**
 * No tween type
 *
 * @static
 * @final
 * @type String
 */
Tween.NONE = 'NONE';

/**
 * Uppercase the first letter. Does NOT work like capitalize in python.
 * It just capitalizes the first letter and let the other characters untouched.
 *
 * @param string The string to capitalize {String}
 * @return {String} The capitalized string
 */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// TODO: possible alternative: create own easing data type
// e.g. (in, out, inout and type)

/**
 * Get the specific CreateJS easing function (e.g. 'linear' or 'quadIn')
 *
 * @param ease The name of the CreateJS easing function {String}
 * @return {function}
 */
Tween.CREATEJS_EASING = function(ease) {
    // inQutQuad to quadInOut
    if (ease.substring(0, 5) === 'inOut') {
        ease = ease.slice(5).toLowerCase() + 'InOut';
    }
    // inQuad to quadIn
    if (ease.substring(0, 2) === 'in') {
        ease = ease.slice(2).toLowerCase() + 'In';
    }
    if (ease.substring(0, 3) === 'out') {
        ease = ease.slice(3).toLowerCase() + 'Out';
    }
    return createjs.Ease[ease];
};

/**
 * Get the specific PIXI easing function
 *
 * @param ease The name of the PIXI easing function {String}
 * @return {function}
 */
Tween.PIXI_EASING = function(ease) {
    if (ease.substring(ease.length-5) === 'InOut') {
        ease = 'inOut' + capitalize(ease.slice(0, -5));
    }
    if (ease.substring(ease.length-3) === 'Out') {
        ease = 'out' + capitalize(ease.slice(0, -3));
    }
    if (ease.substring(ease.length-2) === 'In') {
        ease = 'in' + capitalize(ease.slice(0, -2));
    }
    return PIXI.tween.Easing[ease]();
};

/**
 * A helper function to check if a tweening-library is present
 *
 * @return {String} Name of the tweening-library
 */
Tween.prototype.checkLibrary = function() {
    if (window.PIXI && PIXI.tween) {
        return Tween.PIXI_TWEEN;
    } else if (window.createjs && window.createjs.Tween) {
        return Tween.CREATEJS_TWEEN;
    } else {
        return Tween.NONE;
    }
};

/**
 * Create a tween
 *
 * @param target The tween target {Object}
 * @param duration The tween duration {Number}
 * @param easing The easing function name {String}
 */
Tween.prototype.createTween = function(target, duration, easing) {
    if (this.type === Tween.PIXI_TWEEN) {
        this._tween = PIXI.tweenManager.createTween(target);
        // tweenjs stores time in ms
        this._tween.time = duration;
        // Easing is a function in PIXI.tween.Easing
        this._tween.easing = Tween.PIXI_EASING(easing);
    } else if (this.type === Tween.CREATEJS_TWEEN) {
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(60);
        this._tween = createjs.Tween.get(target, {loop: false});
    } else {
        this._tween = null;
    }
};

/**
 * Start the tween
 *
 * @param data The tween data {Object}
 */
Tween.prototype.to = function(data) {
    if (this.type === Tween.PIXI_TWEEN && this._tween) {
        this._tween.stop();
        this._tween.to(data);
        this._tween.start();
    } else if (this.type === Tween.CREATEJS_TWEEN && this._tween) {
        this._tween.to(data, this.duration, Tween.CREATEJS_EASING(this.easing));
        this._tween.play();
    } else if (this.type === Tween.NONE) {
        // no tween, set values directly and without wait
        // maybe we'd like to do some basic linear transitioning
        // in the future even if there is nothing set?
        for (var key in data) {
            this._target[key] = data[key];
        }
    }
};

/**
 * Stop the tween
 */
Tween.prototype.remove = function() {
    if (this.type === Tween.PIXI_TWEEN && this._tween) {
        PIXI.tween.TweenManager.removeTween(this._tween);
    }
    this._tween = null;
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

/**
 * Utility functions
 *
 * @namespace GOWN.utils
 */

/**
 * Mixin utility
 *
 * @function GOWN.utils.mixin
 * @param destination Destination object {Object}
 * @param source Source object{Object}
 * @return {Object}
 */
module.exports = function(destination, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            if(key === 'defineProperty') {
                for (var name in source[key]) {
                    var data = source[key][name];
                    if (data.configurable === undefined) {
                         // We change our default case, so that we can
                         // overwrite properties later on
                        data.configurable = true;
                    }
                    Object.defineProperty(destination, name, data);
                }
            } else {
                destination[key] = source[key];
            }
        }
    }
    return destination;
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

/**
 * Utility functions to position an element relative to its parent
 *
 * @namespace GOWN.utils.position
 */

/**
 * Center an element on the parent vertically
 *
 * @memberOf GOWN.utils.position
 * @param elem The element {PIXI.Container}
 * @param [parent] The parent {PIXI.Container}
 */
function centerVertical(elem, parent) {
    parent = parent || elem.parent;
    elem.y = Math.floor((parent.height - elem.height ) / 2);
}

/**
 * Center an element on the parent horizontally
 *
 * @memberOf GOWN.utils.position
 * @param elem The element {PIXI.Container}
 * @param [parent] The parent {PIXI.Container}
 */
function centerHorizontal(elem, parent) {
    parent = parent || elem.parent;
    elem.x = Math.floor((parent.width - elem.width ) / 2);
}

/**
 * Center an element on the parent
 *
 * @memberOf GOWN.utils.position
 * @param elem The element {PIXI.Container}
 * @param [parent] The parent {PIXI.Container}
 */
function center(elem, parent) {
    centerVertical(elem, parent);
    centerHorizontal(elem, parent);
}

/**
 * Put an element to the bottom of its parent
 *
 * @memberOf GOWN.utils.position
 * @param elem The element {PIXI.Container}
 * @param [parent] The parent {PIXI.Container}
 */
function bottom(elem, parent) {
    parent = parent || elem.parent;
    elem.y = parent.height - elem.height;
}

/**
 * Put an element to the right of its parent.
 *
 * @memberOf GOWN.utils.position
 * @param elem The element {PIXI.Container}
 * @param [parent] The parent {PIXI.Container}
 */
function right(elem, parent) {
    parent = parent || elem.parent;
    elem.x = parent.width - elem.width;
}

module.exports = {
    centerHorizontal: centerHorizontal,
    centerVertical: centerVertical,
    center: center,
    bottom: bottom,
    right: right
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

/**
 *
 *
 * @namespace GOWN.utils.resizeScaling
 */
module.exports = {
    /**
     * This should be called from inside the constructor
     *
     * @function GOWN.utils.resizeScaling.initResizeScaling
     */
    initResizeScaling: function() {
        this.resizeScaling = true; // resize instead of scale

        this.minWidth = 1;
        this.minHeight = 1;

        // update dimension flag
        this._lastWidth = NaN;
        this._lastHeight = NaN;
    },

    /**
     * Update before draw call.
     * Redraw control for current state from theme
     *
     * @function GOWN.utils.resizeScaling.redraw
     */
    redraw: function() {
        // remove last skin after new one has been added
        // (just before rendering, otherwise we would see nothing for a frame)
        if (this._lastSkin) {
            //this.removeChild(this._lastSkin);
            this._lastSkin.alpha = 0;
            this._lastSkin = null;
        }
        if (this.invalidState) {
            this.fromSkin(this._currentState, this.changeSkin);
        }
        var width = this.worldWidth;
        var height = this.worldHeight;
        if (this._currentSkin &&
            (this._lastWidth !== width || this._lastHeight !== height) &&
            width > 0 && height > 0) {

            this._currentSkin.width = this._lastWidth = width;
            this._currentSkin.height = this._lastHeight = height;
            this.updateDimensions();
        }
    },

    /**
     * @function GOWN.utils.resizeScaling.updateDimensions
     */
    updateDimensions: function() {
    },

    /**
     * @function GOWN.utils.resizeScaling.updateTransform
     */
    updateTransform: function() {
        var wt = this.worldTransform;
        var scaleX = 1;
        var scaleY = 1;

        if(this.redraw) {

            if(this.resizeScaling) {
                var pt = this.parent.worldTransform;

                scaleX = Math.sqrt(Math.pow(pt.a, 2) + Math.pow(pt.b, 2));
                scaleY = Math.sqrt(Math.pow(pt.c, 2) + Math.pow(pt.d, 2));
            }

            this.worldWidth = Math.round(Math.max(this._width * scaleX, this.minWidth));
            this.worldHeight = Math.round(Math.max(this._height * scaleY, this.minHeight));
            this.redraw();
        }

        // obmit Control.updateTransform as it calls redraw as well
        if(!this.resizeScaling) {
            PIXI.Container.prototype.updateTransform.call(this);
        } else {
            var updateTransformID = this.transform._worldID;
            PIXI.DisplayObject.prototype.updateTransform.call(this);
            
            // Only revert scaling if something changed
            if(updateTransformID != this.transform._worldID){
                // revert scaling
                var tx = wt.tx;
                var ty = wt.ty;
                scaleX = scaleX !== 0 ? 1/scaleX : 0;
                scaleY = scaleY !== 0 ? 1/scaleY : 0;
                wt.scale(scaleX, scaleY);
                wt.tx = tx;
                wt.ty = ty;
            }

            for (var i = 0, j = this.children.length; i < j; ++i) {
                this.children[i].updateTransform();
            }
        }
    },

    /**
     * @member GOWN.utils.resizeScaling.defineProperty
     */
    defineProperty: {
        'height': {
            get: function () {
                return this._height
            },
            set: function (value) {
                this._height = value
                this.minHeight = Math.min(value, this.minHeight)
            }
        },
        'width': {
            get: function () {
                return this._width
            },
            set: function (value) {
                this._width = value
                this.minWidth = Math.min(value, this.minWidth)
            }
        }
    }
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var Control = __webpack_require__(2);

/**
 * Entry point for your application, makes some assumptions, (e.g. that you
 * always want fullscreen) and shortcuts some fancy stuff like a gradient
 * background.
 *
 * @class Application
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 * @param [config] {Object} Equals the renderer config for pixi with an
 *  exception: the backgroundColor is an Array a of colors it will drawn as
 *  vertical gradient
 * @param [config.backgroundColor=0xffffff] {Number} Background color of the canvas
 * @param [screenMode=Application.SCREEN_MODE_RESIZE] {String} Screen mode of the canvas
 * @param [parentId] {String} DOM id of the canvas element
 * @param [width=800] {Number} Width of the canvas
 * @param [height=600] {Number} Height of the canvas
 * @param [renderer=PIXI.autoDetectRenderer()] {PIXI.WebGLRenderer|PIXI.CanvasRenderer} Renderer of the canvas
 * @param [stage=new PIXI.Container()] {PIXI.Container} Root container
 */
function Application(config, screenMode, parentId, width, height, renderer, stage) {
    screenMode = screenMode || Application.SCREEN_MODE_RESIZE;
    var fullscreen = false;
    var element = document.getElementById(parentId);
    if (screenMode === Application.SCREEN_MODE_RESIZE) {
        width = element.clientWidth;
        height = element.clientHeight;
    } else if (screenMode === Application.SCREEN_MODE_FULLSCREEN) {
        width = window.innerWidth;
        height = window.innerHeight;
        fullscreen = true;
    } else {
        width = width || 800;
        height = height || 600;
    }

    this.resizable = true;

    if (!config) {
        config = {
            backgroundColor: 0xffffff
        };
    }

    var _background; // to store background if it is an array because we want
                     // to set the backgroundColor in config to a hex value
    if (!stage || !renderer) {
        stage = new PIXI.Container();
        if (config.backgroundColor && config.backgroundColor instanceof Array) {
            _background = config.backgroundColor;
            config.backgroundColor = 0xffffff;
        }
        this._background = config.backgroundColor;
        renderer = PIXI.autoDetectRenderer(width, height, config);
        renderer.plugins.resize.element = element;
        renderer.plugins.resize.fullscreen = fullscreen;
        if (element && !fullscreen) {
            element.appendChild(renderer.view);
        } else {
            document.body.appendChild(renderer.view);
        }
    }
    /* jshint ignore:start */

    /**
     * Root container
     *
     * @private
     * @type PIXI.Container
     * @default new PIXI.Container()
     */
    this._stage = stage;

    /**
     * Canvas renderer
     *
     * @private
     * @type PIXI.WebGLRenderer|PIXI.CanvasRenderer
     */
    this._renderer = renderer;

    /* jshint ignore:end */

    /**
     * Width of the canvas
     *
     * @private
     * @type Number
     */
    this._width = renderer.width;

    /**
     * Height of the canvas
     *
     * @private
     * @type Number
     */
    this._height = renderer.height;

    /**
     * Screen mode of the canvas
     *
     * @private
     * @type Number
     */
    this.screenMode = screenMode;

    Control.call(this);

    this.on('resize', this.onResize, this);

    stage.addChild(this);

    /**
     * Overwrite layout before next draw call.
     *
     * @private
     * @type bool
     * @default true
     */
    this.layoutInvalid = true;

    /**
     * Set a layout to apply percentages on redraw etc.
     *
     * @private
     * @default null
     * @type GOWN.layout.Layout
     */
    this.layout = this.layout || null;

    if (_background) {
        this.background = _background;
    }

    this.animate();
}

Application.prototype = Object.create( Control.prototype );
Application.prototype.constructor = Application;
module.exports = Application;

/**
 * Use fixed width/height in pixel.
 *
 * @static
 * @final
 * @type String
 */
Application.SCREEN_MODE_FIXED = 'screenModeFixed';

/**
 * Use window.innerWidth/innerHeight to get the whole browser page width
 *
 * @static
 * @final
 * @type String
 */
Application.SCREEN_MODE_FULLSCREEN = 'screenModeFullscreen';

/**
 * Use resize to parent div width/height
 *
 * @static
 * @final
 * @type String
 */
Application.SCREEN_MODE_RESIZE = 'screenModeResize';

/* jshint ignore:start */

/**
 * Call requestAnimationFrame to render the application at max. FPS
 */
Application.prototype.animate = function() {
    var scope = this;
    var animate = function() {
        if (scope._stage) {
            scope._renderer.render(scope._stage);
            requestAnimationFrame(animate);
        }
    };
    requestAnimationFrame(animate);
};

/* jshint ignore:end */

/**
 * Creates a gradient rect that can for example be used as a background
 * (uses a separate canvas to create a new Texture)
 * TODO: check if this works outside the browser/in cordova or cocoon
 *
 * @private
 */
Application.prototype._createGradientRect = function(gradient, width, height) {
    var bgCanvas = document.createElement('canvas');
    bgCanvas.width = width || 256;
    bgCanvas.height = height || 256;
    var ctx = bgCanvas.getContext('2d');
    var linearGradient = ctx.createLinearGradient(0, 0, 0, bgCanvas.height);
    for (var i = 0; i < gradient.length; i++) {
        var color = gradient[i];
        if (typeof(color) === 'number') {
            color = '#' +  gradient[i].toString(16);
        }
        linearGradient.addColorStop(i, color);
    }
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    return PIXI.Texture.fromCanvas(bgCanvas);
};

/**
 * Clean application: remove event listener, free memory
 * (can also remove the canvas from the DOM tree if wanted)
 *
 * @param [destroyChildren=false] {boolean} if set to true, all the children will have their destroy method called as well
 * @param [removeCanvas=true] {boolean} destroys the canvas and remove it from the dom tree
 */
Application.prototype.destroy = function(destroyChildren, removeCanvas) {
    removeCanvas = removeCanvas === undefined || removeCanvas;
    this._removeBackground();
    PIXI.Container.prototype.destroy.call(this, destroyChildren);
    if (removeCanvas) {
        document.body.removeChild(this._renderer.view);
    }
    this._stage = null;
    this._renderer = null;
};

/**
 * Redraw scene, apply layout if required
 */
Application.prototype.redraw = function() {
    if (this.layoutInvalid && this.layout) {
        this.layout.layoutContainer(this);
    }
    this.layoutInvalid = false;
};

/**
 * called when the browser window / the application is resized
 * will set the dimensions of the canvas and layout children
 * (if it has a layout)
 */
Application.prototype.onResize = function(eventData) {
    this._width = eventData.data.width;
    this._height = eventData.data.height;
    this._renderer.resize(this._width, this._height);
    if (this.bg) {
        // TODO: add special layout for this and use percentWidth/Height of 100
        this.bg.width = this._width;
        this.bg.height = this._height;
    }
    this.layoutInvalid = true;
};

/**
 * Allow layouting of children
 *
 * @name GOWN.Application#layout
 * @type GOWN.layout.Layout
 */
Object.defineProperty(Application.prototype, 'layout', {
    get: function() {
        return this._layout;
    },
    set: function(value) {
        if (value === this._layout) {
            return;
        }
        this._layout = value;
        this.layoutInvalid = true;
    }
});

/**
 * Remove background
 *
 * @private
 */
Application.prototype._removeBackground = function() {
    if (this.bg) {
        this.removeChild(this.bg);
        this.bg = null;
    }
};

/**
 * Set the screen mode
 *
 * @name GOWN.Application#screenMode
 * @type String
 */
Object.defineProperty(Application.prototype, 'screenMode', {
    get: function() {
        return this._screenMode;
    },
    set: function(value) {
        if (value === Application.SCREEN_MODE_FULLSCREEN) {
            this._renderer.view.style.top = 0;
            this._renderer.view.style.left = 0;
            this._renderer.view.style.right = 0;
            this._renderer.view.style.bottom = 0;
            this._renderer.view.style.position = 'absolute';
        }
        this._screenMode = value;
    }
});

/**
 * Set and draw background. Create a gradient by passing an array of hex color numbers.
 *
 * @name GOWN.Application#background
 * @type Number|Number[]
 */
Object.defineProperty(Application.prototype, 'background', {
    get: function() {
        return this._background;
    },
    set: function(value) {
        if (value === this._background) {
            return;
        }
        this._removeBackground();
        if (value instanceof Array) {
            this.bg = new PIXI.Sprite(this._createGradientRect(value));
            this.bg.width = this._width;
            this.bg.height = this._height;
            this.addChildAt(this.bg, 0);
        } else {
            this._renderer.backgroundColor = value;
        }
        this._background = value;
    }
});


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var InputControl = __webpack_require__(5),
    TextInput = __webpack_require__(18);

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


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var ToggleButton = __webpack_require__(0);

/**
 * A toggle control that contains a label and a box that may be checked
 * or not to indicate selection.
 *
 * @class Check
 * @extends GOWN.ToggleButton
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the button {GOWN.Theme}
 * @param [skinName=Check.SKIN_NAME] name of the check skin {String}
 */
function Check(theme, skinName) {
    // TODO: use and place Label from ToggleButton
    skinName = skinName || Check.SKIN_NAME;
    ToggleButton.call(this, theme, skinName);
}

Check.prototype = Object.create( ToggleButton.prototype );
Check.prototype.constructor = Check;
module.exports = Check;

/**
 * Default check skin name
 *
 * @static
 * @final
 * @type String
 */
Check.SKIN_NAME = 'check';


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var Control = __webpack_require__(2);
var ToggleButton = __webpack_require__(0);
var List = __webpack_require__(15);
var Point = PIXI.Point;

/**
 * PickerList allows the user to select an option from a list
 *
 * @class PickerList
 * @extends GOWN.Control
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the picker list {GOWN.Theme}
 */
function PickerList(theme) {
    this.theme = theme;

    Control.call(this);

    // TODO: Icons for Button

    /**
     * A function that is expected to return a new GOWN.List
     *
     * @private
     * @type function
     * @default this._defaultListFactory
     */
    this._listFactory = this._listFactory || this._defaultListFactory;

    /**
     * A function that is expected to return a new GOWN.ToggleButton
     *
     * @private
     * @type function
     * @default this._defaultButtonFactory
     */
    this._buttonFactory = this._buttonFactory || this._defaultButtonFactory;

    // TODO: implement PopUpManager!
    /**
     * TODO
     *
     * @type GOWN.PickerList
     * @default this
     */
    this.popUpParent = this;

    /**
     * Invalidate list so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidList = true;

    /**
     * Invalidate button so that it will be redrawn next time
     *
     * @private
     * @type bool
     * @default true
     */
    this.invalidButton = true;
}

PickerList.prototype = Object.create( Control.prototype );
PickerList.prototype.constructor = PickerList;
module.exports = PickerList;

/**
 * Default picker list skin name
 *
 * @static
 * @final
 * @type String
 */
PickerList.SKIN_NAME = 'picker_list';

/**
 * Toggle the list
 *
 * @private
 */
PickerList.prototype._clickList = function() {
    if (!this.open) {
        this.openList();
    } else {
        this.closeList();
    }
};

/**
 * Creates and adds the list sub-component and removes the old instance, if one exists.
 * Meant for internal use, and subclasses may override this function with a custom implementation.
 *
 * @param [theme] theme for the list {GOWN.Theme}
 * @private
 */
PickerList.prototype._defaultListFactory = function(theme) {
    return new List(theme);
};

/**
 * Creates and adds the button sub-component and removes the old instance, if one exists.
 * Meant for internal use, and subclasses may override this function with a custom implementation.
 *
 * @param [theme] theme for the list {GOWN.Theme}
 * @private
 */
PickerList.prototype._defaultButtonFactory = function(theme) {
    return new ToggleButton(theme);
};

/**
 * Opens the pop-up list, if it isn't already open.
 */
PickerList.prototype.openList = function() {
    if (this.popUpParent === this) {
        this.list.y = this.height;
    } else {
        var pos = new Point(0, this.height);
        pos = this.toGlobal(pos);
        pos = this.popUpParent.toLocal(pos);
        this.list.position = pos;
    }
    this.list.clippingInvalid = true;
    this.popUpParent.addChild(this.list);
    this.open = true;
};

/**
 * Closes the pop-up list, if it is open.
 */
PickerList.prototype.closeList = function() {
    this.popUpParent.removeChild(this.list);
    this.open = false;
};

/**
 * Set item renderer factory for the GOWN.List
 *
 * @name GOWN.PickerList#itemRendererFactory
 * @type function
 */
Object.defineProperty(PickerList.prototype, 'itemRendererFactory', {
    set: function(itemRendererFactory) {
        if (this.list) {
            this.list.itemRendererFactory = itemRendererFactory;
        }
        this._itemRendererFactory = itemRendererFactory;
    },
    get: function() {
        return this._itemRendererFactory;
    }
});

/**
 * Set the data provider for the GOWN.List
 *
 * @name GOWN.PickerList#dataProvider
 * @type Array
 */
Object.defineProperty(PickerList.prototype, 'dataProvider', {
    set: function(dataProvider) {
        if (this.list) {
            this.list.dataProvider = dataProvider;
        }
        this._dataProvider = dataProvider;
    },
    get: function() {
        return this._dataProvider;
    }
});

/**
 * Set item renderer properties for the GOWN.List
 *
 * @name GOWN.List#itemRendererProperties
 * @type Object
 */
Object.defineProperty(PickerList.prototype, 'itemRendererProperties', {
    set: function(itemRendererProperties) {
        if (this.list) {
            this.list.itemRendererProperties = itemRendererProperties;
        }
        this._itemRendererProperties = itemRendererProperties;
    },
    get: function() {
        return this._itemRendererProperties;
    }
});

/**
 * Create the picker list button
 *
 * @private
 */
PickerList.prototype.createButton = function() {
    this.button = this._buttonFactory(this.theme);

    this.button.width = this.width;
    this.button.height = this.height;

    this.button.on('mouseup', this._clickList, this);
    this.button.on('touchend', this._clickList, this);

    this.addChild(this.button);
};

/**
 * Create the picker list internal GOWN.List
 *
 * @private
 */
PickerList.prototype.createList = function() {
    this.list = this._listFactory(this.theme);
    if (this.dataProvider) {
        this.list._dataProvider = this.dataProvider;
    }
    if (this.itemRendererFactory) {
        this.list.itemRendererFactory = this.itemRendererFactory;
    }
    if (this.itemRendererProperties) {
        this.list.itemRendererProperties = this.itemRendererProperties;
    }
    // forward list events
    this.list.on(List.CHANGE, this._listChange, this);
};

/**
 * Forward list events
 *
 * @param itemRenderer The item renderer {Array}
 * @param value {String}
 * @private
 */
PickerList.prototype._listChange = function(itemRenderer, value) {
    this.emit(List.CHANGE, itemRenderer, value);
    if (this.button && value) {
        this.button.label = itemRenderer.label;
    }
    this.closeList();
};

/**
 * Update before draw call
 *
 * @protected
 */
PickerList.prototype.redraw = function() {
    if (this.invalidButton) {
        if (this.button) {
            this.button.off('click', this._clickList, this);
            this.button.off('tap', this._clickList, this);
        }
        this.createButton();
        this.invalidButton = false;
    }
    if (this.invalidList) {
        this.createList();
        this.invalidList = false;
    }
};

/**
 * Destroy button and list and remove button listeners
 */
PickerList.prototype.destroy = function() {
    if (this.button) {
        this.button.off('click', this._clickList, this);
        this.button.off('tap', this._clickList, this);
    }
    this.button.destroy();
    if (this.list) {
        this.list.destroy();
    }
};
// TODO: setter/getter for List to get selectedItem
// TODO: prompt
// TODO: PopupManager (!)


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var ToggleButton = __webpack_require__(0);

/**
 * A toggleable control that exists in a set that requires a single, exclusive toggled item.
 *
 * @class Radio
 * @extends GOWN.ToggleButton
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the radio button {GOWN.Theme}
 * @param [skinName=Radio.SKIN_NAME] name of the radio button skin {String}
 */
function Radio(theme, skinName) {
    skinName = skinName || Radio.SKIN_NAME;
    ToggleButton.call(this, theme, skinName);
}

Radio.prototype = Object.create( ToggleButton.prototype );
Radio.prototype.constructor = Radio;
module.exports = Radio;

/**
 * Default radio button skin name
 *
 * @static
 * @final
 * @type String
 */
Radio.SKIN_NAME = 'radio';

/**
 * Set the toggle group and add this radio button to it
 *
 * @name GOWN.Radio#label
 * @type String
 */
Object.defineProperty(Radio.prototype, 'toggleGroup', {
    get: function() {
        return this._toggleGroup;
    },
    set: function(toggleGroup) {
        if(this._toggleGroup === toggleGroup) {
            return;
        }
        this._toggleGroup = toggleGroup;
        toggleGroup.addItem(this);
    }
});


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var Scroller = __webpack_require__(9);
//var ScrollBar = require('./ScrollBar');

/**
 * ScrollContainer (not implemented yet)
 *
 * @class ScrollContainer
 * @extends GOWN.Scroller
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the scroll container {GOWN.Theme}
 */
function ScrollContainer(theme) {
    Scroller.call(this, theme);
}

ScrollContainer.prototype = Object.create( Scroller.prototype );
ScrollContainer.prototype.constructor = ScrollContainer;
module.exports = ScrollContainer;


/***/ }),
/* 37 */
/***/ (function(module, exports) {



/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var Scrollable = __webpack_require__(6);

/**
 * Simple slider with min. and max. value
 *
 * @class Slider
 * @extends GOWN.Scrollable
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the slider {GOWN.Theme}
 */
// TODO: move stuff from Scrollable back here?
function Slider(theme) {
    /**
     * The skin name
     *
     * @private
     * @type String
     * @default Slider.SKIN_NAME
     */
    this._skinName = this._skinName || Slider.SKIN_NAME;

    Scrollable.call(this, theme);
}

Slider.prototype = Object.create( Scrollable.prototype );
Slider.prototype.constructor = Slider;
module.exports = Slider;

/**
 * Default slider skin name
 *
 * @static
 * @final
 * @type String
 */
Slider.SKIN_NAME = 'scroll_bar';


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var InputControl = __webpack_require__(5);

/**
 * A text entry control that allows users to enter and edit multiple lines of
 * uniformly-formatted text with the ability to scroll.
 *
 * @class TextInput
 * @extends GOWN.InputControl
 * @memberof GOWN
 * @constructor
 * @param [theme] theme for the text area {GOWN.Theme}
 * @param [skinName=TextArea.SKIN_NAME] name of the text area skin {String}
 */
function TextArea(theme, skinName) {
    // show and load background image as skin (exploiting skin states)
    /**
     * The skin name
     *
     * @type String
     * @default TextArea.SKIN_NAME
     */
    this.skinName = skinName || TextArea.SKIN_NAME;

    /**
     * The valid text area states
     *
     * @private
     * @type String[]
     * @default InputControl.stateNames
     */
    this._validStates = this._validStates || InputControl.stateNames;

    InputControl.call(this, theme);

    /**
     * @private
     * @type PIXI.Point
     */
    this._fromPos = new PIXI.Point(0, 0);

    /**
     * @private
     * @type PIXI.Point
     */
    this._toPos = new PIXI.Point(0, 0);

    /**
     * @private
     * @type PIXI.Point
     */
    this._fromText = new PIXI.Point(0, 0);

    /**
     * @private
     * @type PIXI.Point
     */
    this._toText = new PIXI.Point(0, 0);
}

TextArea.prototype = Object.create(InputControl.prototype);
TextArea.prototype.constructor = TextArea;
module.exports = TextArea;

/**
 * Default text area skin name
 *
 * @static
 * @final
 * @type String
 */
TextArea.SKIN_NAME = 'text_input';

/**
 * Update the selection
 *
 * @private
 */
TextArea.prototype.updateSelectionBg = function() {
    var start = this.selection[0],
        end = this.selection[1];
    this.selectionBg.clear();
    if (start === end) {
        return;
    }
    if (start < end) {
        this._drawSelectionBg(start, end);
    } else if (start > end) {
        this._drawSelectionBg(end, start);
    }
    this.selectionBg.x = this.pixiText.x;
    this.selectionBg.y = this.pixiText.y;
};

/**
 * Calculate position in Text
 */

/**
 * Calculate position in Text
 *
 * @param textPos Position in the text {Number}
 * @param [position] Position object that gets returned {PIXI.Point}
 * @returns {PIXI.Point} returns the Line and Position in line
 */
TextArea.prototype.textToLinePos = function(textPos, position) {
    var lines = this.getLines();
    var x = 0;
    for (var y = 0; y < lines.length; y++) {
        var lineLength = lines[y].length;
        if (lineLength < textPos) {
            textPos -= lineLength + 1;
        } else {
            x = textPos;
            break;
        }
    }

    if (!position) {
        position = new PIXI.Point(x, y);
    } else {
        position.x = x;
        position.y = y;
    }
    return position;
};

/**
 * New selection over multiple lines
 *
 * @param fromTextPos Start position {Number}
 * @param toTextPos End position {Number}
 * @private
 */
TextArea.prototype._drawSelectionBg = function (fromTextPos, toTextPos) {
    this.textToPixelPos(fromTextPos, this._fromPos);
    this.textToPixelPos(toTextPos, this._toPos);

    this.selectionBg.beginFill(0x0080ff);
    if (this._toPos.y === this._fromPos.y) {
        this.selectionBg.drawRect(
            this._fromPos.x,
            this._fromPos.y,
            this._toPos.x - this._fromPos.x,
            this.lineHeight());
        return;
    }

    this.textToLinePos(fromTextPos, this._fromText);
    this.textToLinePos(toTextPos, this._toText);
    var lines = this.getLines();
    // draw till the end of the line
    var startPos = this._fromText.x;
    for (var i = this._fromText.y; i < this._toText.y; i++) {
        var text = lines[i];
        this.selectionBg.drawRect(
            startPos > 0 ? this._fromPos.x : 0,
            i * this.lineHeight(),
            this.textWidth(text.substring(startPos, text.length)),
            this.lineHeight());
        startPos = 0;
    }
    this.selectionBg.drawRect(0,
        this._toPos.y,
        this._toPos.x,
        this.lineHeight());
};

/**
 * Get the text lines as an array
 *
 * @returns {Array|*} Returns an array with one text line per array element
 */
TextArea.prototype.getLines = function() {
    var wrappedText = this.pixiText.wordWrap(this.text);
    return wrappedText.split(/(?:\r\n|\r|\n)/);
};

/**
 * Width of the text area
 *
 * @name GOWN.TextArea#label
 * @type Number
 */
Object.defineProperty(InputControl.prototype, 'width', {
    get: function () {
        return this._width;
    },
    set: function(value) {
        this._width = value;
        this.minWidth = Math.min(value, this.minWidth);
        if (this.pixiText) {
            this.pixiText.style.wordWrapWidth = value - this.textOffset.x * 2;
            this._cursorNeedsUpdate = true;
            this._selectionNeedsUpdate = true;
        }
    }
});

/**
 * Set the text style
 *
 * @name GOWN.TextArea#style
 * @type PIXI.TextStyle
 */
Object.defineProperty(TextArea.prototype, 'style', {
    get: function() {
        return this.textStyle;
    },
    set: function(style) {
        this.cursorStyle = style;
        if (this.cursor) {
            this.cursor.style = style;
        }
        style = style.clone();
        style.wordWrap = true;
        if (!style.wordWrapWidth && this.textOffset && this.width) {
            style.wordWrapWidth = this.width - this.textOffset.x * 2;
        }
        this.textStyle = style;
        if (this.pixiText) {
            this.pixiText.style = style;
        }
        this._cursorNeedsUpdate = true;
    }
});


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(3);
var ToggleButton = __webpack_require__(0);

/**
 * Controls the selection of two or more toggles
 * (RadioButtons/ToggleButton/Check instances)
 * where only one may be selected at a time
 *
 * @class ToggleGroup
 * @extends EventEmitter
 * @memberof GOWN
 * @constructor
 */
function ToggleGroup() {
    /**
     * List of toggles (RadioButtons/ToggleButton/Check) in the group
     *
     * @private
     * @type GOWN.ToggleButton[]
     * @default Button.stateNames
     */
	this._items = [];

    /**
     * The currently selected toggle.
     *
     * @private
     * @type GOWN.Radio|GOWN.ToggleButton|GOWN.Check
     */
	this._selectedItem = null;

    /**
     * Determines if the user can deselect the currently selected item or not.
     *
     * @private
     * @type bool
     * @default true
     */
    this._isSelectionRequired = true;

	EventEmitter.call(this);
}

ToggleGroup.prototype = Object.create( EventEmitter.prototype );
ToggleGroup.prototype.constructor = ToggleGroup;
module.exports = ToggleGroup;

/**
 * Dispatched when the toggle group selection changes.
 *
 * @static
 * @final
 * @type String
 */
ToggleGroup.CHANGE = 'change';

/**
 * Add an toggle to the toggle group
 *
 * @param item The toggle to add to the toggle group {GOWN.ToggleButton}
 */
ToggleGroup.prototype.addItem = function(item) {
    if (this._items.indexOf(item) === -1) {
    	this._items.push(item);
		item.on(ToggleButton.CHANGE, this._toggleChanged, this);
        // new radio button is selected, unselect the old one
    	if (item.selected) {
    		if (this.selectedItem) {
    			this.selectedItem.setSelected(false);
    		}
    		this.selectedItem = item;
    	}
    }
};

/**
 * Change callback that updates the selection for the specific item
 *
 * @param item The item that emitted a change event {GOWN.ToggleButton}
 * @private
 */
ToggleGroup.prototype._toggleChanged = function(item) {
	if (item === this.selectedItem && this._isSelectionRequired && !item.selected) {
		item.setSelected(true);
	} else if (item.selected) {
		this.selectedItem = item;
	}
};

/**
 * Remove an toggle from the toggle group
 *
 * @param item The toggle to add to the toggle group {GOWN.ToggleButton}
 */
ToggleGroup.prototype.removeItem = function(item) {
	var index = this._items.indexOf(item);
	if (index !== -1) {
		item.off(ToggleButton.CHANGE, this._toggleChanged, this);
		this._items.remove(index);
        // removed item was selected!
		if (this.selectedItem === item) {
			this.selectedItem = null;
		}
	}
};

/**
 * Remove all event listener, clear items-list and set selectedItem to null.
 */
ToggleGroup.prototype.destroy = function() {
	while (this._items.length > 0) {
		var item = this._items.pop();
		item.off(ToggleButton.CHANGE, this._toggleChanged, this);
	}
	this.selectedItem = null;
};

/**
 * The currently selected toggle
 *
 * @name GOWN.ToggleGroup#selectedItem
 * @type GOWN.ToggleButton
 */
Object.defineProperty(ToggleGroup.prototype, 'selectedItem', {
    get: function() {
        return this._selectedItem;
    },
    set: function(item) {
        if (item === null && this._isSelectionRequired) {
            // item is null, but we need to select something, so we assume
            // the user wants to set the first item as selected instead
            item = this._items[0];
        } else if (this._items.indexOf(item) === -1) {
            return;
        }
        if (item) {
            item.setSelected(true);
        }
        // unselect any previously selected item
        if (this.selectedItem) {
	        this._selectedItem.setSelected(false);
        }
		this._selectedItem = item;
		this.emit(ToggleGroup.CHANGE, item);
    }
});

/**
 * The index of the currently selected toggle.
 *
 * @name GOWN.ToggleGroup#selectedIndex
 * @type Number
 */
Object.defineProperty(ToggleGroup.prototype, 'selectedIndex', {
    get: function() {
        return this._items.indexOf(this._selectedItem);
    },
    set: function(index) {
        if (index >= 0 && index < this._items.length &&
            this.selectedIndex !== index) {
            this.selectedItem = this._items[index];
        }
    }
});

/**
 * Determines if the user can deselect the currently selected item or not.
 *
 * @name GOWN.ToggleGroup#isSelectionRequired
 * @type bool
 * @default true
 */
Object.defineProperty(ToggleGroup.prototype, 'isSelectionRequired', {
    get: function () {
        return this._isSelectionRequired;
    },
    set: function(isSelectionRequired) {
        if (isSelectionRequired && !this._selectedItem && this._items.length > 0) {
            this.selectedItem = this._items[0];
        }
        this._isSelectionRequired = isSelectionRequired;
    }
});


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file        Main export of the gown.js core library
 * @author      Andreas Bresser <andreasbresser@gmail.com>
 * @copyright   2017 Andreas Bresser
 * @license     {@link https://github.com/GreyRook/gown.js/blob/master/LICENSE|Apache License}
 */

/**
 * @namespace GOWN.core
 */
module.exports = {
    Control:        __webpack_require__(2),
    Skinable:       __webpack_require__(7),
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(3);

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


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(3);

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


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var LayoutAlignment = __webpack_require__(11);

/**
 * HorizontalLayout - just sets the alignment to
 * LayoutAlignment.HORIZONTAL_ALIGNMENT
 *
 * @class HorizontalLayout
 * @extends GOWN.layout.LayoutAlignment
 * @memberof GOWN.layout
 * @constructor
 */
function HorizontalLayout() {
    LayoutAlignment.call(this);

    /**
     * The alignment of the layout
     *
     * @type String
     * @default LayoutAlignment.HORIZONTAL_ALIGNMENT
     */
    this.alignment = LayoutAlignment.HORIZONTAL_ALIGNMENT;
}

HorizontalLayout.prototype = Object.create( LayoutAlignment.prototype );
HorizontalLayout.prototype.constructor = HorizontalLayout;
module.exports = HorizontalLayout;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var TiledLayout = __webpack_require__(12);

/**
 * Tiled columns Layout
 * (roughly based on starling TiledColumnsLayout)
 *
 * @class TiledColumnsLayout
 * @extends GOWN.layout.TiledLayout
 * @memberof GOWN.layout
 * @constructor
 */
function TiledColumnsLayout() {
    TiledLayout.call(this);

    this._paging = TiledLayout.PAGING_VERTICAL;
    this._orientation = TiledLayout.ORIENTATION_COLUMNS;
}

TiledColumnsLayout.prototype = Object.create( TiledLayout.prototype );
TiledColumnsLayout.prototype.constructor = TiledColumnsLayout;
module.exports = TiledColumnsLayout;

/**
 * Quickly sets both <code>horizontalGap</code> and <code>verticalGap</code>
 * to the same value. The <code>gap</code> getter always returns the
 * value of <code>verticalGap</code>, but the value of
 * <code>horizontalGap</code> may be different.
 *
 * @see #_horizontalGap
 * @see #_verticalGap
 *
 * @name GOWN.layout.TiledColumnsLayout#gap
 * @type Number
 * @default 0
 */
Object.defineProperty(TiledColumnsLayout.prototype, 'gap', {
    set: function(value) {
        this._verticalGap = value;
        this._horizontalGap = value;
        this._needUpdate = true;
    },
    get: function() {
        return this._verticalGap;
    }
});


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var TiledLayout = __webpack_require__(12);

/**
 * Tiled rows Layout
 * (roughly based on starling TiledRowsLayout)
 *
 * @class TiledRowsLayout
 * @extends GOWN.layout.TiledLayout
 * @memberof GOWN.layout
 * @constructor
 */
function TiledRowsLayout() {
    TiledLayout.call(this);

    this._paging = TiledLayout.PAGING_HORIZONTAL;
    this._orientation = TiledLayout.ORIENTATION_ROWS;
}

TiledRowsLayout.prototype = Object.create( TiledLayout.prototype );
TiledRowsLayout.prototype.constructor = TiledRowsLayout;
module.exports = TiledRowsLayout;

/**
 * Quickly sets both <code>horizontalGap</code> and <code>verticalGap</code>
 * to the same value. The <code>gap</code> getter always returns the
 * value of <code>horizontalGap</code>, but the value of
 * <code>verticalGap</code> may be different.
 *
 * @see #_horizontalGap
 * @see #_verticalGap
 *
 * @name GOWN.layout.TiledRowsLayout#gap
 * @type Number
 * @default 0
 */
Object.defineProperty(TiledRowsLayout.prototype, 'gap', {
    get: function() {
        return this._horizontalGap;
    },
    set: function(value) {
        this._verticalGap = value;
        this._horizontalGap = value;
        this._needUpdate = true;
    }
});


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var LayoutAlignment = __webpack_require__(11);

/**
 * VerticalLayout - just sets the alignment to
 * LayoutAlignment.VERTICAL_ALIGNMENT
 *
 * @class VerticalLayout
 * @extends GOWN.layout.LayoutAlignment
 * @memberof GOWN.layout
 * @constructor
 */
function VerticalLayout() {
    LayoutAlignment.call(this);

    /**
     * The alignment of the layout
     *
     * @type String
     * @default LayoutAlignment.VERTICAL_ALIGNMENT
     */
    this.alignment = LayoutAlignment.VERTICAL_ALIGNMENT;
}

VerticalLayout.prototype = Object.create( LayoutAlignment.prototype );
VerticalLayout.prototype.constructor = VerticalLayout;
module.exports = VerticalLayout;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var Shape = __webpack_require__(1);

/**
 * Basic arrow shape
 *
 * @class Arrow
 * @extends GOWN.shapes.Shape
 * @memberof GOWN.shapes
 * @constructor
 * @param color Color of the arrow {Number}
 * @param alpha Alpha value of the arrow {Number}
 * @param tailWidth Tail width of the arrow {Number}
 * @param tailHeight Tail height of the arrow {Number}
 * @param width Width of the arrow {Number}
 * @param height Height of the arrow {Number}
 */
function Arrow(color, alpha, tailWidth, tailHeight, width, height) {
    /**
     * Tail height of the arrow
     *
     * @private
     * @type Number
     */
    this.tailHeight = tailHeight;

    /**
     * Tail width of the arrow
     *
     * @private
     * @type Number
     */
    this.tailWidth = tailWidth;

    Shape.call(this, color, alpha, width, height);
}

Arrow.prototype = Object.create( Shape.prototype );
Arrow.prototype.constructor = Arrow;
module.exports = Arrow;

/**
 * Draw the arrow during redraw.
 *
 * @private
 */
Arrow.prototype._drawShape = function() {
    // start y-positon of tail
    var tailY = Math.floor((this._height-this.tailHeight)/2);
    // draw arrow tail
    this.moveTo(0, tailY)
        .lineTo(this.tailWidth, tailY)
        .lineTo(this.tailWidth, 0)
        .lineTo(this._width, Math.floor(this._height/2))
        .lineTo(this.tailWidth, this._height)
        .lineTo(this.tailWidth, tailY+this.tailHeight)
        .lineTo(0, tailY+this.tailHeight);
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var Shape = __webpack_require__(1);

/**
 * Basic diamond shape
 *
 * @class Diamond
 * @extends GOWN.shapes.Shape
 * @memberof GOWN.shapes
 * @constructor
 * @param color Color of the diamond shape {Number}
 * @param alpha Alpha value of the diamond shape {Number}
 * @param width Width of the diamond shape {Number}
 * @param height Height of the diamond shape {Number}
 */
function Diamond(color, alpha, width, height) {
    Shape.call(this, color, alpha, width, height);
}

Diamond.prototype = Object.create( Shape.prototype );
Diamond.prototype.constructor = Diamond;
module.exports = Diamond;

/**
 * Draw the diamond during redraw.
 *
 * @private
 */
Diamond.prototype._drawShape = function() {
    this.moveTo(this._width/2, 0)
        .lineTo(this._width, this._height/2)
        .lineTo(this._width/2, this._height)
        .lineTo(0, this._height/2)
        .lineTo(this._width/2, 0);
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var Shape = __webpack_require__(1);

/**
 * Basic ellipse shape
 *
 * @class Ellipse
 * @extends PIXI.shape.Shape
 * @memberof PIXI.shape
 * @constructor
 * @param color Color of the ellipse shape {Number}
 * @param alpha Alpha value of the ellipse shape {Number}
 * @param width Width of the ellipse shape {Number}
 * @param height Height of the ellipse shape {Number}
 */
function Ellipse(color, alpha, width, height) {
    Shape.call(this, color, alpha, width, height);
}

Ellipse.prototype = Object.create( Shape.prototype );
Ellipse.prototype.constructor = Ellipse;
module.exports = Ellipse;

/**
 * Draw the ellipse during redraw.
 *
 * @private
 */
Ellipse.prototype._drawShape = function() {
    this.drawEllipse(this.width/2, this.height/2,
        Math.abs(this.width/2),
        Math.abs(this.height/2));
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var Shape = __webpack_require__(1);

/**
 * Basic line
 *
 * @class Line
 * @extends PIXI.shape.Shape
 * @memberof PIXI.shape
 * @constructor
 * @param color Color of the line {Number}
 * @param alpha Alpha value of the line {Number}
 * @param width Width of the line {Number}
 * @param height Height of the line {Number}
 * @param [lineWidth=1] Width of the line {Number}
 * @param reverse
 */
function Line(color, alpha, width, height, lineWidth, reverse) {
    /**
     * Reverse the line
     *
     * @private
     * @type bool
     */
    this._reverse = reverse;

    Shape.call(this, color, alpha, width, height);

    /**
     * The width of the line
     *
     * @type Number
     * @default 1
     */
    this.lineWidth = lineWidth || 1;
}

Line.prototype = Object.create( Shape.prototype );
Line.prototype.constructor = Line;
module.exports = Line;

/**
 * Draw the rect during redraw. Will use drawRoundRect if a radius is provided.
 *
 * @private
 */
Line.prototype._drawShape = function() {
    if (this.reverse) {
        this.moveTo(this._width, 0);
        this.lineTo(0, this._height);
    } else {
        this.moveTo(0, 0);
        this.lineTo(this._width,this._height);
    }
};

/**
 * Reverses the line
 *
 * @name GOWN.shapes.Line#reverse
 * @type bool
 */
Object.defineProperty(Line.prototype, 'reverse', {
    get: function() {
        return this._reverse;
    },
    set: function(reverse) {
        this._reverse = reverse;
        this.invalid = true;
    }
});


/**
 * Update before draw call.
 * Line has to be drawn different than other Shapes
 *
 * @private
 */
Line.prototype.redraw = function() {
    if(!this.invalid) {
        return;
    }

    var lineWidth = this.lineWidth;
    this.clear();
    this.lineStyle(lineWidth, this.color);
    this._drawShape();

    this.invalid = false;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var Shape = __webpack_require__(1);

/**
 * Basic rectangular shape
 *
 * @class Rect
 * @extends GOWN.shapes.Shape
 * @memberof GOWN.shapes
 * @constructor
 * @param color Color of the rectangular shape {Number}
 * @param alpha Alpha value of the rectangular shape {Number}
 * @param width Width of the rectangular shape {Number}
 * @param height Height of the rectangular shape {Number}
 * @param radius Radius of the rectangular shape {Number}
 */
function Rect(color, alpha, width, height, radius) {
    Shape.call(this, color, alpha, width, height);
    this._radius = radius;
}

Rect.prototype = Object.create( Shape.prototype );
Rect.prototype.constructor = Rect;
module.exports = Rect;

/**
 * Draw the rect during redraw. will use drawRoundRect if a radius is provided.
 *
 * @private
 */
Rect.prototype._drawShape = function() {
    if (this.radius) {
        this.drawRoundedRect(
            Math.min(this._width, 0),
            Math.min(this._height, 0),
            Math.abs(this._width),
            Math.abs(this._height),
            this.radius);
    } else {
        this.drawRect(
            Math.min(this._width, 0),
            Math.min(this._height, 0),
            Math.abs(this._width),
            Math.abs(this._height));
    }
};

/**
 * The radius of the rectangle border, setting this will redraw the component.
 *
 * @name GOWN.shapes.Rect#radius
 * @type Number
 */
Object.defineProperty(Rect.prototype, 'radius', {
    get: function() {
        return this._radius;
    },
    set: function(radius) {
        this._radius = radius;
        this.invalid = true;
    }
});


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var Theme = __webpack_require__(21);

/**
 * Load a theme from a .json file.
 *
 * @class Theme
 * @extends GOWN.Theme
 * @memberof GOWN
 * @constructor
 * @param jsonPath The path to the .json file {String}
 * @param [global=true] Set theme as the global GOWN.theme {bool}
 */
function ThemeParser(jsonPath, global) {
    Theme.call(this, global);

    /**
     * Components that show something and can be used as skin
     *
     * @see GOWN.shapes
     * @type Object
     */
    this.skinComponents = this.skinComponents || this.getSkinComponents();

    this.addThemeData(jsonPath);
}

ThemeParser.prototype = Object.create( Theme.prototype );
ThemeParser.prototype.constructor = ThemeParser;
module.exports = ThemeParser;

//TODO
ThemeParser.DATA_LOADED = 'data_loaded';

/**
 * Get the component classes that can create skins (in general all GOWN.shapes).
 * Note that image textures are not components
 *
 * @return Object
 */
ThemeParser.prototype.getSkinComponents = function () {
    var cmps = {};
    if (GOWN.shapes) {
        cmps.rect = GOWN.shapes.Rect;
        cmps.diamond = GOWN.shapes.Diamond;
        cmps.ellipse = GOWN.shapes.Ellipse;
        cmps.line = GOWN.shapes.Line;
    }
    return cmps;
};

/**
 * Executed when the image has been loaded.
 * Sets cache and and applies the theme.
 *
 * @see addImage
 * @see resource-loader https://github.com/englercj/resource-loader
 *
 * @param loader The loader {Loader}
 * @param resources The loaded resources {Object}
 */
ThemeParser.prototype.loadComplete = function(loader, resources) {
    this.setCache(resources);

    if (resources) {
        var res = resources[this._jsonPath];
        if (res) {
            this.themeData = res.data;
        }

        this.applyTheme();
        Theme.prototype.loadComplete.call(this, loader, resources);
    }
};

/**
 * @private
 */
ThemeParser.prototype.themeApplyTheme = Theme.prototype.applyTheme;

/**
 * Apply the theme to the controls
 * (normally executed only once after the texture has been loaded)
 */
ThemeParser.prototype.applyTheme = function() {
    if (!this.themeData) {
        return;
    }
    this.parseData(this.themeData);
    this.themeApplyTheme();
};

/**
 * Get the scale9 grid data from the theme data
 *
 * @param scale Rectangle position and size {Number[]}
 * @return {PIXI.Rectangle}
 */
ThemeParser.prototype.getScale9 = function(scale) {
    return new PIXI.Rectangle(
        parseInt(scale[0])*this.themeScale, parseInt(scale[1])*this.themeScale,
        parseInt(scale[2])*this.themeScale, parseInt(scale[3])*this.themeScale);
};

/**
 * Create a new skin from the theme data
 *
 * @param skinData The skin data {Object}
 * @param data The theme data {Object}
 * @returns {function} the skin function
 */
ThemeParser.prototype.skinFromData = function(skinData, data) {
    if (skinData.type === 'texture') {
        var scale9;
        if (skinData.scale9 && skinData.scale9 in data.grids) {
            scale9 = this.getScale9(data.grids[skinData.scale9]);
        } else {
            return this.getImage(skinData.texture);
        }
        if (!(skinData.texture in data.frames) && window.console) {
            window.console.error('texture not found in texture atlas: ' +
                skinData.texture + ' ' +
                'please check ' + this._jsonPath);
            return null;
        }

        return this.getScaleContainer(skinData.texture, scale9, skinData.middleWidth, skinData.centerHeight);
    } else if (skinData.type in this.skinComponents) {
        // keep component in scope
        var CmpClass = this.skinComponents[skinData.type];
        return function() {
            var cmp = new CmpClass();
            for (var key in skinData) {
                if (key === 'type') {
                    continue;
                }
                cmp[key] = skinData[key];
            }
            return cmp;
        };
    }
};

/**
 * Create a dictionary containing the skin data (including default values)
 *
 * @param stateName The name of the current state (e.g. GOWN.Button.UP) {String}
 * @param skinData The data gathered from previous runs {String}
 * @param data The new data that will be copied into skinData {Object}
 */
ThemeParser.prototype.getSkinData = function(stateName, skinData, data) {
    if (!data) {
        return;
    }

    var copyInto = function(source, target) {
        if (!source) {
            return;
        }
        for (var key in source) {
            target[key] = source[key];
        }
    };

    // get default skin for all states...
    copyInto(data.all, skinData);

    // ... override default values for current state
    copyInto(data[stateName], skinData);
};

/**
 * Parse the theme data
 *
 * @param data The theme data {Object}
 */
ThemeParser.prototype.parseData = function(data) {
    this.hoverSkin = data.hoverSkin;
    this.thumbSkin = data.thumbSkin;
    this.themeScale = data.themeScale || 1.0;

    if (data.textStyle) {
        this.textStyle.fill = data.textStyle.fill;
        this.textStyle.fontFamily = data.textStyle.fontFamily;
    }
    if (!data.skins) {
        return;
    }

    for (var componentName in data.skins) {
        if (componentName === 'default') {
            continue;
        }
        // create skin for componentName (e.g. button) from data

        var states = data.skins[componentName];
        //var skins = data.skins[componentName];
        for (var stateName in states) {
            if (stateName === 'all') {
                continue;
            }

            var skinData = {};
            // set defaults
            this.getSkinData(stateName, skinData, data.skins.default);

            // override defaults with component data
            if (componentName in data.skins) {
                this.getSkinData(stateName, skinData, data.skins[componentName]);
            }

            // create skin from skinData for current skin
            var skin = this.skinFromData(skinData, data);
            if (skin) {
                // skin.minWidth
                this.setSkin(componentName, stateName, skin);
            }
        }
    }
};

/**
 * Adds the theme data located at the specified path
 *
 * @param jsonPath The path the .json file
 */
ThemeParser.prototype.addThemeData = function(jsonPath) {
    this.addImage(jsonPath);
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @file        Main export of the gown.js util library
 * @author      Andreas Bresser <andreasbresser@gmail.com>
 * @copyright   2017 Andreas Bresser
 * @license     {@link https://github.com/GreyRook/gown.js/blob/master/LICENSE|Apache License}
 */

/**
 * @namespace GOWN.util
 */
module.exports = {
    position:               __webpack_require__(28),
    ScaleContainer:         __webpack_require__(24),
    SliderData:             __webpack_require__(25),
    Tween:                  __webpack_require__(26),
    resizeScaling:          __webpack_require__(29),
    roundToPrecision:       __webpack_require__(8),
    roundToNearest:         __webpack_require__(57),
    roundDownToNearest:     __webpack_require__(56),
    roundUpToNearest:       __webpack_require__(58),
    mixin:                  __webpack_require__(27)
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// full version of gown
// (includes pixi-layout and pixi-shape, so you only need to add pixi.js
//  and gown.js into your html file)
if (typeof PIXI === 'undefined') {
    if (window.console) {
        window.console.warn('pixi.js has to be loaded before loading gown.js');
    }
} else {

    var core = module.exports = __webpack_require__(41);
    // basic shapes
    core.shapes = {
        Shape:          __webpack_require__(1),
        Arrow:          __webpack_require__(48),
        Diamond:        __webpack_require__(49),
        Ellipse:        __webpack_require__(50),
        Line:           __webpack_require__(51),
        Rect:           __webpack_require__(52)
    };

    // layouting
    core.utils = {
            itemDimensions:       __webpack_require__(13)
    };

    core.layout = {
        HorizontalLayout:     __webpack_require__(44),
        Layout:               __webpack_require__(10),
        LayoutAlignment:      __webpack_require__(11),
        TiledColumnsLayout:   __webpack_require__(45),
        TiledLayout:          __webpack_require__(12),
        TiledRowsLayout:      __webpack_require__(46),
        VerticalLayout:       __webpack_require__(47)
    };

    // controls
    core.Application =            __webpack_require__(31);
    core.AutoComplete =           __webpack_require__(32);
    core.Button =                 __webpack_require__(4);
    core.Check =                  __webpack_require__(33);
    core.InputControl =           __webpack_require__(5);
    core.LayoutGroup =            __webpack_require__(14);
    core.List =                   __webpack_require__(15);
    core.PickerList =             __webpack_require__(34);
    core.Radio =                  __webpack_require__(35);
    core.Scrollable =             __webpack_require__(6);
    core.ScrollBar =              __webpack_require__(16);
    core.ScrollContainer =        __webpack_require__(36);
    core.Scroller =               __webpack_require__(9);
    core.ScrollText =             __webpack_require__(37);
    core.ScrollThumb =            __webpack_require__(17);
    core.Slider =                 __webpack_require__(38);
    core.TextInput =              __webpack_require__(18);
    core.TextArea =               __webpack_require__(39);
    core.ToggleButton =           __webpack_require__(0);
    core.ToggleGroup =            __webpack_require__(40);

    // data
    core.ListCollection = __webpack_require__(20);

    // control renderer
    core.DefaultListItemRenderer =  __webpack_require__(19);

    // skin
    core.Theme =           __webpack_require__(21);
    core.ThemeFont =       __webpack_require__(22);
    core.ThemeParser =     __webpack_require__(53);

    // manager
    core.ResizeManager =     __webpack_require__(43);
    core.KeyboardManager =   __webpack_require__(42);

    // add core plugins.
    core.utils = __webpack_require__(54);

    // use default pixi loader
    core.loader = PIXI.loader;

    // export GOWN globally.
    global.GOWN = core;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(30)))

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var roundToPrecision = __webpack_require__(8);

/**
 * Rounds a Number <em>down</em> to the nearest multiple of an input. For example, by rounding
 * 16 down to the nearest 10, you will receive 10. Similar to the built-in function Math.floor().
 *
 * @see Math#floor
 *
 * @function GOWN.utils.roundDownToNearest
 * @param number The number to round down {Number}
 * @param nearest The number whose multiple must be found {Number}
 * @return {Number} The rounded number
 */
module.exports = function(number, nearest) {
    nearest = nearest || 1;
    if(nearest === 0) {
		return number;
	}
	return Math.floor(roundToPrecision(number / nearest, 10)) * nearest;
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var roundToPrecision = __webpack_require__(8);

/**
 * Rounds a Number to the nearest multiple of an input. For example, by rounding
 * 16 to the nearest 10, you will receive 20. Similar to the built-in function Math.round().
 *
 * @see Math#round
 *
 * @function GOWN.utils.roundToNearest
 * @param number The number to round {Number}
 * @param nearest The number whose multiple must be found {Number}
 * @return {Number} The rounded number
 */
module.exports = function(number, nearest) {
    nearest = nearest || 1;
    if(nearest === 0) {
		return number;
	}
	var roundedNumber = Math.round(roundToPrecision(number / nearest, 10)) * nearest;
    return roundToPrecision(roundedNumber, 10);
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var roundToPrecision = __webpack_require__(8);

/**
 * Rounds a Number <em>up</em> to the nearest multiple of an input. For example, by rounding
 * 16 up to the nearest 10, you will receive 20. Similar to the built-in function Math.ceil().
 *
 * @see Math#ceil
 *
 * @function GOWN.utils.roundUpToNearest
 * @param number The number to round up {Number}
 * @param nearest The number whose multiple must be found {Number}
 * @return {Number} The rounded number
 */
module.exports = function(number, nearest) {
    nearest = nearest || 1;
    if(nearest === 0) {
		return number;
	}
	return Math.ceil(roundToPrecision(number / nearest, 10)) * nearest;
};


/***/ })
/******/ ]);
//# sourceMappingURL=gown.js.map
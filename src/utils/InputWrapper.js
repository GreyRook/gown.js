/**
 * wrapper for text inputs
 * (keyboard on mobile or DOM input field in browser)
 */

function InputWrapper(manager, name) {
    this.manager = manager;
    this.name = name;
}
module.exports = InputWrapper;

InputWrapper.prototype.focus = function() {
    // TODO: needed?
};

InputWrapper.prototype.blur = function() {
    // TODO: needed?
};

InputWrapper.prototype.destroy = function() {
    // remove DOM or events
    this.removeEventListener();
};

/**
 * Grabs the data from the keystroke
 * @private
 */
InputWrapper.prototype.getKeyData = function (event) {
    return {
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        key: event.key,
        originalEvent: event
    };
};

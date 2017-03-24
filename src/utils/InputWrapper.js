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
    // only needed for DOMInputWrapper
};

InputWrapper.prototype.blur = function() {
    // only needed for DOMInputWrapper
};

InputWrapper.prototype.destroy = function() {
    // remove DOM or events
};

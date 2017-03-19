/**
 * wrapper for text inputs
 * (keyboard on mobile or DOM input field in browser)
 */

function InputWrapper(manager, name) {
    this.manager = manager;
    this.name = name;

    // the text that is stored internally
    // (so for password field its just stars)
    this._text = '';
    this._selection = [0, 0];
    this._cursorPos = 0;
}
module.exports = InputWrapper;

InputWrapper.prototype.getText = function() {
    return this._text;
};

InputWrapper.prototype.setText = function(text) {
    this._text = text;
};

InputWrapper.prototype.getSelection = function() {
    return this._selection;
};

InputWrapper.prototype.setSelection = function(start, end) {
    this._selection[0] = start;
    this._selection[1] = end;
};

InputWrapper.prototype.setCursorPos = function(pos) {
    this._cursorPos = pos;
};

InputWrapper.prototype.focus = function() {
    // only needed for DOMInputWrapper
};

InputWrapper.prototype.blur = function() {
    // only needed for DOMInputWrapper
};

InputWrapper.prototype.destroy = function() {
    // remove DOM or events
};

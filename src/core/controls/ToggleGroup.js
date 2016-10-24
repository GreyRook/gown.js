/**
 * A ToggleGroup that helps combine Radio Button's together
 *
 * @class ToggleGroup
 * @memberof GOWN
 * @constructor
 */
function ToggleGroup() {
	this.radios = [];
	this.selectedRadio = null;
}

ToggleGroup.prototype.constructor = ToggleGroup;
module.exports = ToggleGroup;

/**
 * Add a Radio Button to be kept tracked of
 *
 * @property radioButton
 * @type RadioButton
 */
ToggleGroup.prototype.add = function(radioButton) {
    if (this.radios.indexOf(radioButton) === -1) {
    	this.radios.push(radioButton);
    	if (radioButton.selected) {
    		if (this.selectedRadio) {
    			this.selectedRadio.selected = false;
    		}
    		this.selectedRadio = radioButton;
    	}
    }
};

/**
 * Remove a Radio Button that is currently being tracked
 *
 * @property radioButton
 * @type RadioButton
 */
ToggleGroup.prototype.remove = function(radioButton) {
	var index = this.radios.indexOf(radioButton);
	if (index !== -1) {
		this.radios.remove(index);
		if (this.selectedRadio === radioButton) {
			this.selectedRadio = null;
		}
	}
};

/**
 * Called when a new Radio Button has been selected, disables old one
 *
 * @property radioButton
 * @type RadioButton
 */
ToggleGroup.prototype.select = function(radioButton) {
	if (this.radios.indexOf(radioButton) !== -1) {
		if (this.selectedRadio) {
			this.selectedRadio.selected = false;
		}
		this.selectedRadio = radioButton;
	}
};

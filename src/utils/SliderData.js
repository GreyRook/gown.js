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

/**
 * Holds all information related to a Slider change event
 *
 * @class SliderData
 * @memberof PIXI_UI
 * @constructor
 */
function SliderData()
{
    this.value = 0;
    /**
     * The target Sprite that was interacted with
     *
     * @property target
     * @type Sprite
     */
    this.target = null;
}

module.exports = SliderData;

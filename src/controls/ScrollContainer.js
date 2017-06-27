var Scroller = require('./Scroller');
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

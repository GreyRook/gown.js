var Scroller = require('../Scroller');
var ScrollBar = require('./ScrollBar');

/**
 * @class ScrollContainer
 * @extends GOWN.Scroller
 * @memberof GOWN
 * @constructor
 */
function ScrollContainer(theme) {
    Scroller.call(this, theme);
}

ScrollContainer.prototype = Object.create( Scroller.prototype );
ScrollContainer.prototype.constructor = ScrollContainer;
module.exports = ScrollContainer;

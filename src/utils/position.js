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

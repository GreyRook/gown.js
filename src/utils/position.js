/**
 * center element on parent vertically
 * @param elem
 * @param parent (optional)
 * @method centerVertical
 */
function centerVertical(elem, parent) {
    parent = parent || elem.parent;
    elem.y = Math.floor((parent.height - elem.height ) / 2);
}

/**
 *
 * @param elem
 * @param parent (optional)
 */
function bottom(elem, parent) {
    parent = parent || elem.parent;
    elem.y = parent.height - elem.height;
}

/**
 * center element on parent horizontally
 * @param elem
 * @param parent (optional)
 * @method centerHorizontal
 */
function centerHorizontal(elem, parent) {
    parent = parent || elem.parent;
    elem.x = Math.floor((parent.width - elem.width ) / 2);
}


/**
 * center element on parent
 * @param elem
 * @param parent (optional)
 * @method center
 */
function center(elem, parent) {
    centerVertical(elem, parent);
    centerHorizontal(elem, parent);
}


module.exports = {
    centerHorizontal: centerHorizontal,
    centerVertical: centerVertical,
    center: center,
    bottom: bottom
};
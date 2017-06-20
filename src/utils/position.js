/**
 * center element on parent vertically
 * @param elem
 * @param parent (optional)

 */
function centerVertical(elem, parent) {
    parent = parent || elem.parent;
    elem.y = Math.floor((parent.height - elem.height ) / 2);
}

/**
 * center element on parent horizontally
 * @param elem
 * @param parent (optional)

 */
function centerHorizontal(elem, parent) {
    parent = parent || elem.parent;
    elem.x = Math.floor((parent.width - elem.width ) / 2);
}


/**
 * center element on parent
 * @param elem
 * @param parent (optional)

 */
function center(elem, parent) {
    centerVertical(elem, parent);
    centerHorizontal(elem, parent);
}

/**
 * put element to the bottom
 *
 * @param elem
 * @param parent (optional)
 */
function bottom(elem, parent) {
    parent = parent || elem.parent;
    elem.y = parent.height - elem.height;
}


/**
 * put element to the right of its parent.
 *
 * @param elem
 * @param parent (optional)
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

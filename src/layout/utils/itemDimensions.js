module.exports = function (item) {
    var itemWidth = 0, itemHeight = 0;

    // we prefere pixel positions over calculate ones, so we try to
    // access the underscore values first.
    if (!isNaN(item._height)) {
        itemHeight = item._height;
    } else if (!isNaN(item.height)) {
        itemHeight = item.height;
    }

    if (!isNaN(item._width)) {
        itemWidth = item._width;
    } else if (!isNaN(item.width)) {
        itemWidth = item.width;
    }

    return [itemWidth, itemHeight];
};

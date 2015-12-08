module.exports = function(destination, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            if(key === 'defineProperty') {
                for (var name in source[key]) {
                    var data = source[key][name];
                    if (data.configurable === undefined) {
                         // We change our default case, so that we can
                         // overwrite properties later on
                        data.configurable = true;
                    }
                    Object.defineProperty(destination, name, data);
                }
            } else {
                destination[key] = source[key];
            }
        }
    }
    return destination;
};

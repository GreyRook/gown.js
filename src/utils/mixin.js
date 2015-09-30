module.exports = function(destination, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            if(key === 'defineProperty') {
                for(var name in source[key]) {
                    Object.defineProperty(destination, name, source[key][name]);
                }
            } else {
                destination[key] = source[key];
            }
        }
    }
    return destination;
};

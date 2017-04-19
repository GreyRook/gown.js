function isNumber(string) {
    var regex = /^[\-\+]?[0-9]*[.,]?([0-9]+)?$/;
    return regex.test(string);
}

function isNumberWithComma(string) {
    var regex = /^[\-\+]?[0-9]*,?([0-9]+)?$/;
    return regex.test(string);
}

function isNumeric(value) {
  var regex = /^\d+$/;
  return regex.test(value);
}

/* Define Polyfills if needed  */
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

module.exports = {
  isNumeric: isNumeric,
  isNumber: isNumber,
  isNumberWithComma: isNumberWithComma
}

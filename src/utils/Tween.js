/**
 * wrapper around PIXI.tween OR CreateJS/TweenJS to do animations/tweening
 * for exxample for List or Scroller, see Scroller.thrownTo.
 *
 * TODO: support greensock?
 */

function Tween(target, duration, easing, type) {
    this.duration = duration;
    this.easing = easing || 'linear';
    this.type = type || this.checkLibrary();
    if (this.type === Tween.NONE) {
        this._target = target;
    }
    this.createTween(target, duration, easing);
}

Tween.prototype = Object.create( {} );
Tween.prototype.constructor = Tween;
module.exports = Tween;

Tween.PIXI_TWEEN = 'PIXI_TWEEN';
Tween.CREATEJS_TWEEN = 'CREATEJS_TWEEN';
Tween.NONE = 'NONE';

// uppercase first latter, does NOT work like capitalize in python
// it just capitalizes the first letter and let the other characters untouched
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// TODO: possible alternative: create own easing data type
// e.g. (in, out, inout and type)

// get string e.g. 'linear' or 'quadIn', return ease function
Tween.CREATEJS_EASING = function(ease) {
    // inQutQuad to quadInOut
    if (ease.substring(0, 5) === 'inOut') {
        ease = ease.slice(5).toLowerCase() + 'InOut';
    }
    // inQuad to quadIn
    if (ease.substring(0, 2) === 'in') {
        ease = ease.slice(2).toLowerCase() + 'In';
    }
    if (ease.substring(0, 3) === 'out') {
        ease = ease.slice(3).toLowerCase() + 'Out';
    }
    return createjs.Ease[ease];
};

Tween.PIXI_EASING = function(ease) {
    if (ease.substring(ease.length-5) === 'InOut') {
        ease = 'inOut' + capitalize(ease.slice(0, -5));
    }
    if (ease.substring(ease.length-3) === 'Out') {
        ease = 'out' + capitalize(ease.slice(0, -3));
    }
    if (ease.substring(ease.length-2) === 'In') {
        ease = 'in' + capitalize(ease.slice(0, -2));
    }
    return PIXI.tween.Easing[ease]();
};

/**
 * helper function to check if a tweening-library is present
 */
Tween.prototype.checkLibrary = function() {
    if (window.PIXI && PIXI.tween) {
        return Tween.PIXI_TWEEN;
    } else if (window.createjs && window.createjs.Tween) {
        return Tween.CREATEJS_TWEEN;
    } else {
        return Tween.NONE;
    }
};

Tween.prototype.createTween = function(target, duration, easing) {
    if (this.type === Tween.PIXI_TWEEN) {
        this._tween = PIXI.tweenManager.createTween(target);
        // tweenjs stores time in ms
        this._tween.time = duration;
        // Easing is a function in PIXI.tween.Easing
        this._tween.easing = Tween.PIXI_EASING(easing);
    } else if (this.type === Tween.CREATEJS_TWEEN) {
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(60);
        this._tween = createjs.Tween.get(target, {loop: false});
    } else {
        this._tween = null;
    }
};

Tween.prototype.to = function(data) {
    if (this.type === Tween.PIXI_TWEEN && this._tween) {
        this._tween.to(data);
        this._tween.start();
    } else if (this.type === Tween.CREATEJS_TWEEN && this._tween) {
        this._tween.to(data, this.duration, Tween.CREATEJS_EASING(this.easing));
    } else if (this.type === Tween.NONE) {
        // no tween, set values directly and without wait
        // maybe we'd like to do some basic linear transitioning
        // in the future even if there is nothing set?
        for (var key in data) {
            this._target[key] = data[key];
        }
    }
};

/**
 * stop tween
 */
Tween.prototype.remove = function() {
    if (this.type === Tween.PIXI_TWEEN && this._tween) {
        PIXI.tween.TweenManager.removeTween(this._tween);
    }
    this._tween = null;
};

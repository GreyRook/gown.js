/**
 * wrapper around PIXI.tween OR CreateJS/TweenJS to do animations/tweening
 * for exxample for List or Scroller, see Scroller.thrownTo.
 */

function Tween(target, duration, easing, type) {
    this.duration = duration;
    this.easing = easing;
    this.type = type || this.checkLibrary();
    this.createTween(target, duration, easing);
}

Tween.prototype = Object.create( {} );
Tween.prototype.constructor = Tween;
module.exports = Tween;

Tween.PIXI_TWEEN = 'PIXI_TWEEN';
Tween.CREATEJS_TWEEN = 'CREATEJS_TWEEN';
Tween.NONE = 'NONE';


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
    if (this.type === Tween.PIXI_TWEEN && this._tween) {
        this._tween = PIXI.tween.TweenManager.createTween(target);
        // tweenjs stores time in ms
        this._tween.time = duration;
        // Easing is a function in PIXI.tween.Easing
        this._tween.easing = Tween._pixiEasing[easing];
    } else if (this.type === Tween.CREATEJS_TWEEN && this.tween) {
        this._tween = createjs.Tween.get(target, {loop: false});
    } else {
        this._tween = null;
    }

};

Tween.prototype.to = function(data) {
    if (this.type === Tween.PIXI_TWEEN && this._tween) {
        this._tween.to(data);
    } else if (this.type === Tween.CREATEJS_TWEEN && this._tween) {
        this._tween.to(data, this.duration, this.easing);
    } else if (this.type === Tween.NONE) {
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

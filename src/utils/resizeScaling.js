
module.exports = {
    /**
     * this should be called from inside the constructor
     *
     * @method initResizeScaling
     */
    initResizeScaling: function() {
        this.resizeScaling = true; // resize instead of scale

        this.minWidth = 1;
        this.minHeight = 1;

        // update dimension flag
        this._lastWidth = NaN;
        this._lastHeight = NaN;
    },

    /**
     * update before draw call
     * redraw control for current state from theme
     *
     * @method redraw
     */
    redraw: function() {
        // remove last skin after new one has been added
        // (just before rendering, otherwise we would see nothing for a frame)
        if (this._lastSkin) {
            //this.removeChild(this._lastSkin);
            this._lastSkin.alpha = 0;
            this._lastSkin = null;
        }
        if (this.invalidState) {
            this.fromSkin(this._currentState, this.changeSkin);
        }
        var width = this.worldWidth;
        var height = this.worldHeight;
        if (this._currentSkin &&
            (this._lastWidth !== width || this._lastHeight !== height) &&
            width > 0 && height > 0) {

            this._currentSkin.width = this._lastWidth = width;
            this._currentSkin.height = this._lastHeight = height;
            this.updateDimensions();
        }
    },

    updateDimensions: function() {
    },


    updateTransform: function() {
        var wt = this.worldTransform;
        var scaleX = 1;
        var scaleY = 1;

        if(this.redraw) {

            if(this.resizeScaling) {
                var pt = this.parent.worldTransform;

                scaleX = Math.sqrt(Math.pow(pt.a, 2) + Math.pow(pt.b, 2));
                scaleY = Math.sqrt(Math.pow(pt.c, 2) + Math.pow(pt.d, 2));
            }

            this.worldWidth = Math.round(Math.max(this._width * scaleX, this.minWidth));
            this.worldHeight = Math.round(Math.max(this._height * scaleY, this.minHeight));
            this.redraw();
        }

        // obmit Control.updateTransform as it calls redraw as well
        if(!this.resizeScaling) {
            PIXI.Container.prototype.updateTransform.call(this);
        } else {
            var updateTransformID = this.transform._worldID;
            PIXI.DisplayObject.prototype.updateTransform.call(this);
            
            // Only revert scaling if something changed
            if(updateTransformID != this.transform._worldID){
                // revert scaling
                var tx = wt.tx;
                var ty = wt.ty;
                scaleX = scaleX !== 0 ? 1/scaleX : 0;
                scaleY = scaleY !== 0 ? 1/scaleY : 0;
                wt.scale(scaleX, scaleY);
                wt.tx = tx;
                wt.ty = ty;
            }

            for (var i = 0, j = this.children.length; i < j; ++i) {
                this.children[i].updateTransform();
            }
        }
    },

    defineProperty: {

            'height': {
                get: function() {
                    return this._height;
                },
                set: function(value) {
                    this._height = value;
                    this.minHeight = Math.min(value, this.minHeight);
                }
            },
            'width': {
                get: function() {
                    return this._width;
                },
                set: function(value) {
                    this._width = value;
                    this.minWidth = Math.min(value, this.minWidth);
                }
            }
    }
};

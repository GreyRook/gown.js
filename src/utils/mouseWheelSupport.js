/**
 * TODO: make it work with PIXI (this is just copied from createjs_ui / WIP)
 * (e.g. get currently selected object using this.stage.interactionManager.hitTest(this, e)
 * and then execute an "onwheel"-callback)
 *
 * enable or disable mouse wheel support for canvas (e.g. for scroller)
 * using HTML 5 scrolling. will do nothing if it is already activated/
 * deactivated
 * based on http://www.sitepoint.com/html5-javascript-mouse-wheel/
 * @param stage the PIXI-stage
 * @param enable true to enable mouse support, false to disable,
 */
function mouseWheelSupport(stage, enable) {
    var canvas = stage.canvas;
    if (enable || enable === undefined) {
        if (GOWN._mouseWheelHandler !== undefined) {
            return;
        }
        GOWN._mouseWheelHandler = function(event) {
            event = window.event || event;
            var delta = Math.max(-1, Math.min(1,
                (event.wheelDelta || -event.detail)));

            var target = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY, 1);
            if (!target) {
                return;
            }
            for(var i = 0; i < target.length; i++) {
                var t = target[i];
                t.mouseMove(delta);
                /*
                var evt = new createjs.MouseEvent(
                    "mousewheel", true, false,
                    t.x, t.y, event, -1, true, t.rawX, t.rawY);
                evt.delta = delta;
                t.dispatchEvent(evt);
                */
            }
        };
        if (canvas.addEventListener) {
            canvas.addEventListener('mousewheel',
                GOWN._mouseWheelHandler, false);
            canvas.addEventListener('DOMMouseScroll',
                GOWN._mouseWheelHandler, false);
        } else {
            canvas.attachEvent('onmousewheel',
                GOWN._mouseWheelHandler);
        }
    } else {
        if (GOWN._mouseWheelHandler === undefined) {
            return;
        }
        if (canvas.removeEventListener) {
            canvas.removeEventListener('mousewheel',
                GOWN._mouseWheelHandler);
            canvas.removeEventListener('DOMMouseScroll',
                GOWN._mouseWheelHandler);
        } else {
            canvas.detachEvent('onmousewheel',
                GOWN._mouseWheelHandler);
        }
        GOWN._mouseWheelHandler = undefined;
    }
}

module.exports = mouseWheelSupport;
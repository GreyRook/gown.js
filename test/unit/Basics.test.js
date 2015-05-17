/**
 * test basic functionality
 */

describe("object instances", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        PIXI_UI.Theme.removeTheme();
        new PIXI_UI.TestTheme();
    });
    function checkInvalid(ctrl) {
        expect(ctrl).not.equal(null);
        expect(ctrl.invalidState).equal(true);
        //ctrl.redraw();
        //expect(ctrl.invalidState).toBe(false);
    }

    it("make sure all graphic elements are invalid after creation", function() {
        var elems = [
            new PIXI_UI.Skinable(),
            new PIXI_UI.Button()
        ];
        for (var i = 0; i < elems.length; i++) {
            checkInvalid(elems[i]);
        }
        var btn = new PIXI_UI.Button();
        btn.updateDimensions();
    });
});
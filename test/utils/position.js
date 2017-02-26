/**
 * test basic functionality
 */

describe("calculate positions of objects", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    it("center", function() {

        var graphics = new PIXI.Graphics();
        graphics.drawRect(0, 0, 10, 20);
        var parent = new PIXI.Container();

        parent.addChild(graphics);

        parent.height = 41;
        parent.width = 51;

        GOWN.utils.position.center(graphics);

        expect(graphics.y).equal(10);
        expect(graphics.x).equal(20);
    });
    it("bottom", function() {

        var graphics = new PIXI.Graphics();
        graphics.drawRect(0, 0, 10, 20);
        var parent = new PIXI.Container();

        parent.addChild(graphics);

        parent.height = 41;

        GOWN.utils.position.bottom(graphics);

        expect(graphics.y).equal(21);
    });
});
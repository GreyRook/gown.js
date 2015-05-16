describe("test scalable/tialbe container", function() {
    it("no image loaded - should throw", function() {
        var rect = new PIXI.math.Rectangle(10,10,1,1);
        var img = "unloadable_image.png";
        expect(function() {
            PIXI_UI.ScaleContainer.fromFrame(img, rect);
        }).toThrow();
    });
    it("make sure calculations are correct", function(done) {
        var loader = new PIXI.AssetLoader(["base/test/img/scale9.png"]);
        loader.onComplete = function() {
            var rect = new PIXI.math.Rectangle(10,10,1,1);
            var scale = PIXI_UI.ScaleContainer.fromFrame("base/test/img/scale9.png", rect);

            scale.width = 100;
            scale.height = 200;
            scale.redraw();

            expect(scale.tl.width).toBe(10);
            expect(scale.tl.height).toBe(10);
            expect(scale.tm.width).toBe(80);
            expect(scale.tm.height).toBe(10);

            expect(scale.tr.width).toBe(10);
            expect(scale.tr.height).toBe(10);

            expect(scale.cm.width).toBe(80);
            expect(scale.cm.height).toBe(180);
            done();

        };
        loader.load();

        //TODO: also use imagediff to check images
    });
});
describe("test scalable/tilable container", function() {
    it("no image loaded - should throw", function() {

        var rect = new PIXI.Rectangle(10,10,1,1);
        var img = "unloadable_image.png";
        expect(function() {
            GOWN.utils.ScaleContainer.fromFrame(img, rect);
        }).throw();
    });

    it("make sure calculations are correct", function() {

        var loader = GOWN.loader;

        var image = new Image();
        image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAIAAAAmdTLBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wMCCxAuWFRGfgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAOElEQVQ4y2P8z4APMP6HYJyAiYEyMKp/ZOtnYWDAl7z+MzDiTX4MjP8bGvBIN9ZD8Gj4j+qniX4AnXcKKJynPUsAAAAASUVORK5CYII=";

        var baseTexture = new PIXI.BaseTexture(image);
        var texture = new PIXI.Texture(baseTexture);

        var rect = new PIXI.Rectangle(10,10,1,1);
        var scale = new GOWN.utils.ScaleContainer(texture, rect);

        scale.width = 100;
        scale.height = 200;
        expect(scale.invalid).equal(true);
        scale.redraw();
        expect(scale.invalid).equal(false);

        expect(scale.tl.width).equal(10);
        expect(scale.tl.height).equal(10);
        // these expects require XHR, they do not work with testem
        expect(scale.tm.width).equal(80);
        expect(scale.tm.height).equal(10);

        expect(scale.tr.width).equal(10);
        expect(scale.tr.height).equal(10);

        expect(scale.cm.width).equal(80);
        expect(scale.cm.height).equal(180);


        //TODO: also use imagediff to check images
    });

});

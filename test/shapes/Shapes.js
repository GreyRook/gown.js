describe("basic drawing of shapes", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    it("make sure rect is invalid after setting radius values", function() {
        var rect = new GOWN.shapes.Rect();
        expect(rect).not.equal(null);
        rect.radius = 10;
        expect(rect.radius).equal(10);
        rect.radius = 5;
        expect(rect.invalid).equal(true);
    });
});
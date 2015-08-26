/**
 * test Application
 */

describe("test Application", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    it("create and remove Application instance", function() {
        var app = new GOWN.Application(0xff0000);
        app.cleanup();
        app = null;
    });
    it("test application fullscreen works", function() {
        var app = new GOWN.Application(0xffffff, true);

        // TODO: resize!
        expect(app.width).equals(window.innerWidth);
        expect(app.height).equals(window.innerHeight);
        expect(app.fullscreen).equals(true);
        app.fullscreen = false;
        expect(app.fullscreen).equals(false);

        app.cleanup();
        app = null;
    });
});
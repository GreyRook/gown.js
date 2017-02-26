/**
 * test Application
 */

describe("test Application", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    /*it("create and remove Application instance", function() {
        var app = new GOWN.Application(0xff0000);
        app.destroy();
        app = null;

    });*/
    it("test application fullscreen works", function() {
        var app = new GOWN.Application({backgroundColor: 0xffffff}, GOWN.Application.SCREEN_MODE_FULLSCREEN);

        // TODO: resize!
        expect(app.width).equals(window.innerWidth);
        expect(app.height).equals(window.innerHeight);

        app.destroy();
        app = null;
    });
});

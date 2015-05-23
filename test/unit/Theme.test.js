describe("theming and skinning", function() {
    beforeEach(function() {
        // cleanup - make sure global theme is not set
        PIXI_UI.Theme.removeTheme();
    });

    it("make sure the theme is globally available by default", function() {
        expect(PIXI_UI.theme).equal(undefined);
        var theme = new PIXI_UI.Theme();
        expect(theme).not.equal(null);
        expect(PIXI_UI.theme).equal(theme);

        // create temporary, local theme - should not overwrite the global theme
        new PIXI_UI.Theme(false);
        expect(PIXI_UI.theme).equal(theme);
    });

    it("set theme of control", function(done) {
        var btn;
        expect(function () {
           btn = new PIXI_UI.Button();
        }).throw();
        new PIXI_UI.TestTheme();
        btn = new PIXI_UI.Button();
        btn.invalidState = false;
        btn.setTheme(PIXI_UI.theme);
        expect(btn.invalidState).equal(false);

        var alttheme = new PIXI_UI.ShapeTheme(false);
        btn.setTheme(alttheme);
        expect(btn.invalidState).equal(true);

        var theme = new PIXI_UI.AeonTheme(["/themes/assets/aeon/aeon_desktop.json"], function() {
            var btn = new PIXI_UI.Button();
            //TODO: check if button has the right skin
            expect(btn._currentSkin).not.equal(null);
            expect(btn.theme).equal(theme);
            done();
        });
    });
});

describe("theming and skinning", function() {
    beforeEach(function() {
        // cleanup - make sure global theme is not set
        PIXI_UI.Theme.removeTheme();
    });

    it("make sure the theme is globally available by default", function() {
        expect(PIXI_UI.theme).toBe(undefined);
        var theme = new PIXI_UI.Theme();
        expect(theme).not.toBe(null);
        expect(PIXI_UI.theme).toBe(theme);

        // create temporary, local theme - should not overwrite the global theme
        new PIXI_UI.Theme(false);
        expect(PIXI_UI.theme).toBe(theme);
    });

    it("set theme of control", function(done) {
        var btn;
        expect(function () {
           btn = new PIXI_UI.Button();
        }).toThrow();
        new PIXI_UI.TestTheme();
        btn = new PIXI_UI.Button();
        btn.invalidState = false;
        btn.setTheme(PIXI_UI.theme);
        expect(btn.invalidState).toBe(false);

        var alttheme = new PIXI_UI.ShapeTheme(false);
        btn.setTheme(alttheme);
        expect(btn.invalidState).toBe(true);

        var theme = new PIXI_UI.AeonTheme(["base/themes/assets/aeon/aeon_desktop.json"], function() {
            var btn = new PIXI_UI.Button();
            //TODO: check if button has the right skin
            expect(btn._currentSkin).not.toBe(null);
            expect(btn.theme).toBe(theme);
            done();
        });
    });
});

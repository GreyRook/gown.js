describe("theming and skinning", function() {
    beforeEach(function() {
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
    });

    it("make sure the theme is globally available by default", function() {
        expect(GOWN.theme).equal(undefined);
        var theme = new GOWN.Theme();
        expect(theme).not.equal(null);
        expect(GOWN.theme).equal(theme);

        // create temporary, local theme - should not overwrite the global theme
        new GOWN.Theme(null, false);
        expect(GOWN.theme).equal(theme);
    });

    it("set theme of control", function() {
        var btn;
        expect(function () {
           btn = new GOWN.Button();
        }).throw();
        new GOWN.TestTheme();
        btn = new GOWN.Button();
        btn.invalidState = false;
        btn.setTheme(GOWN.theme);
        expect(btn.invalidState).equal(false);

        var alttheme = new GOWN.TestTheme(false);
        btn.setTheme(alttheme);
        expect(btn.invalidState).equal(true);
		
		// TODO: test ThemeParser
    });
});

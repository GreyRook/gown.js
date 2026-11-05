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

    it("loads theme atlases with Pixi Assets", function(done) {
        var originalAssets = PIXI.Assets;
        var originalLoader = GOWN.loader;
        var textureCache = {};
        var asset = {textures: textureCache, data: {}};
        var theme = new GOWN.Theme(false);
        var complete = false;

        PIXI.Assets = {
            load: function(path) {
                expect(path).equal("theme.json");
                return Promise.resolve(asset);
            }
        };
        delete GOWN.loader;

        theme.once(GOWN.Theme.COMPLETE, function() {
            complete = true;
        });

        function restore() {
            PIXI.Assets = originalAssets;
            if (originalLoader !== undefined) {
                GOWN.loader = originalLoader;
            }
        }

        var loading;
        try {
            loading = theme.addImage("theme.json");
        } catch (error) {
            restore();
            throw error;
        }

        loading.then(function(loadedAsset) {
            try {
                expect(loadedAsset).equal(asset);
                expect(theme.textureCache).equal(textureCache);
                expect(complete).equal(true);
                expect(GOWN.loader).equal(undefined);
                restore();
                done();
            } catch (error) {
                restore();
                done(error);
            }
        }, function(error) {
            restore();
            done(error);
        });
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

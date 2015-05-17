describe("Button", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        PIXI_UI.Theme.removeTheme();
        new PIXI_UI.TestTheme();
    });

    it("update when button label changes", function() {
        var btn = new PIXI_UI.Button();
        btn.label = "Hello World";
        expect(btn.updateLabel).equal(true);
        btn.redraw();
        expect(btn.updateLabel).equal(false);

        // nothing changed - do nothing
        btn.label = "Hello World";
        expect(btn.updateLabel).equal(false);

        btn.label = "Hello";
        expect(btn.updateLabel).equal(true);
        btn.redraw();
        expect(btn.updateLabel).equal(false);
    });

    it("a clicked button states are correct (first 'down' then 'up')",
        function() {
            var btn = new PIXI_UI.Button();
            expect(btn._pressed).not.equal(true);
            expect(btn.currentState).equal(PIXI_UI.Button.UP);

            // change button state based on fake events
            btn.mousedown();
            expect(btn._pressed).equal(true);
            expect(btn.currentState).equal(PIXI_UI.Button.DOWN);
            // fake mouseup
            btn.mouseup();
            expect(btn._pressed).equal(false);
            expect(btn.currentState).equal(PIXI_UI.Button.UP);
        }
    );
    it("we can not click a disabled button", function() {
        var Button = PIXI_UI.Button;
        var btn = new Button();
        expect(btn.enabled).equal(true);
        expect(btn._pressed).equal(false);

        // disable button
        btn.enabled = false;

        // handle fake event that will be ignored
        btn.mousedown();
        expect(btn._pressed).equal(false);
        expect(btn.currentState).equal(Button.UP);
    });

});
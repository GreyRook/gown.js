describe("Button", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        PIXI_UI.Theme.removeTheme();
        new PIXI_UI.TestTheme();
    });

    it("update when button label changes", function() {
        var btn = new PIXI_UI.Button();
        btn.label = "Hello World";
        expect(btn.updateLabel).toBe(true);
        btn.redraw();
        expect(btn.updateLabel).toBe(false);

        // nothing changed - do nothing
        btn.label = "Hello World";
        expect(btn.updateLabel).toBe(false);

        btn.label = "Hello";
        expect(btn.updateLabel).toBe(true);
        btn.redraw();
        expect(btn.updateLabel).toBe(false);
    });

    it("a clicked button states are correct (first 'down' then 'up')",
        function() {
            var btn = new PIXI_UI.Button();
            expect(btn._pressed).not.toBe(true);
            expect(btn.currentState).toBe(PIXI_UI.Button.UP);

            // change button state based on fake events
            btn.mousedown();
            expect(btn._pressed).toBe(true);
            expect(btn.currentState).toBe(PIXI_UI.Button.DOWN);
            // fake mouseup
            btn.mouseup();
            expect(btn._pressed).toBe(false);
            expect(btn.currentState).toBe(PIXI_UI.Button.UP);
        }
    );
    it("we can not click a disabled button", function() {
        var Button = PIXI_UI.Button;
        var btn = new Button();
        expect(btn.enabled).toBe(true);
        expect(btn._pressed).toBe(false);

        // disable button
        btn.enabled = false;

        // handle fake event that will be ignored
        btn.mousedown();
        expect(btn._pressed).toBe(false);
        expect(btn.currentState).toBe(Button.UP);
    });

});
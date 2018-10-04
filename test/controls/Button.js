describe("Button", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    it("update when button label changes", function() {
        var btn = new GOWN.Button();
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

    it("test button event", function(done) {
        var btn = new GOWN.Button();
        btn.on(GOWN.Button.TRIGGERED, function(event) {
            done();
        });
        // btn.emit(GOWN.Button.DOWN);
        btn.onDown();
        btn.onHover();
        btn.onUp();

    });

    it("a clicked button states are correct (first 'down' then 'up')",
        function() {
            var btn = new GOWN.Button();
            expect(btn._pressed).not.equal(true);
            expect(btn.currentState).equal(GOWN.Button.UP);

            // change button state based on fake events
            btn.emit('mousedown');
            expect(btn._pressed).equal(true);
            expect(btn.currentState).equal(GOWN.Button.DOWN);
            // fake mouseup
            btn.emit('mouseup');
            expect(btn._pressed).equal(false);
            expect(btn._currentState).equal(GOWN.Button.UP);
        }
    );

    it("a clicked button states are correct (hover)",
        function() {
            var btn = new GOWN.Button();
            expect(btn._pressed).not.equal(true);
            expect(btn.currentState).equal(GOWN.Button.UP);

            // change button state based on fake events
            btn.onHover();
            expect(btn._over).equal(true);
            expect(btn._pressed).equal(false);
            expect(btn.currentState).equal(GOWN.Button.HOVER);
            // fake out
            btn.onOut();
            expect(btn._over).equal(false);
            expect(btn._pressed).equal(false);

            expect(btn.currentState).equal(GOWN.Button.UP);
        }
    );

    it("we can not click a disabled button", function() {
        var Button = GOWN.Button;
        var btn = new Button();
        expect(btn.enabled).equal(true);
        expect(btn._pressed).equal(false);

        // disable button
        btn.enabled = false;

        // handle fake event that will be ignored
        btn.emit('mousedown');
        expect(btn._pressed).equal(false);
        expect(btn.currentState).equal(Button.UP);
    });

});

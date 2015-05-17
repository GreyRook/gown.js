describe("ToggleButton", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        PIXI_UI.Theme.removeTheme();
        new PIXI_UI.TestTheme();
    });

    it("test toggle states", function() {
        var tb = PIXI_UI.ToggleButton;
        var b = PIXI_UI.Button;
        var btn = new PIXI_UI.ToggleButton();

        expect(btn._currentState).equal(b.UP);
        expect(btn.selected).equal(false);
        btn.toggle();

        // button has been selected
        expect(btn._currentState).equal(tb.SELECTED_UP);
        expect(btn.selected).equal(true);

        // mouseup (after rollover) should also toggle the state,
        // a mousedown before that should not change the toggle state
        btn.mouseover();
        expect(btn._currentState).equal(tb.SELECTED_HOVER);
        btn.mousedown();
        expect(btn.selected).equal(true);
        btn.mouseup();
        expect(btn.selected).equal(false);

        btn.mouseover();
        expect(btn._currentState).equal(b.HOVER);
        btn.mouseout();
        expect(btn._currentState).equal(b.UP);

        // press alone (without pressdown) does not toggle the button
        // and will be ignored
        btn.mouseup();
        expect(btn.selected).equal(false);
        expect(btn._currentState).equal(b.UP);
    });
});
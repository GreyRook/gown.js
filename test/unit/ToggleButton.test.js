describe("ToggleButton", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    it("test toggle states", function() {
        var tb = GOWN.ToggleButton;
        var b = GOWN.Button;
        var btn = new GOWN.ToggleButton();

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
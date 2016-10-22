describe("RadioButton", function() {
    var rb;

    before (function() {
        rb = GOWN.RadioButton;
    });

    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    it("test radio select", function() {
        var btn = new GOWN.RadioButton(false, false);

        expect(btn._currentState).equal(rb.UP);
        expect(btn.selected).equal(false);
        btn.toggleSelected();

        // radio button has been selected
        expect(btn._currentState).equal(rb.SELECTED_UP);
        expect(btn.selected).equal(true);

        // mouseup (after rollover) should also toggle the state,
        // a mousedown before that should not change the toggle state
/*        btn.mouseover();
        expect(btn._currentState).equal(rb.SELECTED_HOVER);
        btn.mousedown();
        expect(btn.selected).equal(true);
        btn.mouseup();
        expect(btn.selected).equal(false);

        btn.mouseover();
        expect(btn._currentState).equal(rb.HOVER);
        btn.mouseout();
        expect(btn._currentState).equal(rb.UP);

        // press alone (without pressdown) does not toggle the button
        // and will be ignored
        btn.mouseup();
        expect(btn.selected).equal(false);
        expect(btn._currentState).equal(b.UP);*/
    });

    // shouldn't be allowed to switch states
    it("double select, same state", function() {
        var btn = new GOWN.RadioButton(false, false);

        expect(btn._currentState).equal(rb.UP);
        expect(btn.selected).equal(false);
        btn.toggleSelected();

        // radio button has been selected
        expect(btn._currentState).equal(rb.SELECTED_UP);
        expect(btn.selected).equal(true);

        btn.toggleSelected();
        expect(btn._currentState).equal(rb.SELECTED_UP);
        expect(btn.selected).equal(true);        
    });

    it("clicks properly", function() {
        var btn = new GOWN.RadioButton(false, false);
        btn.mouseover();
        expect(btn._currentState).equal(rb.HOVER);
        btn.mousedown();
        expect(btn.selected).equal(false);
        btn.mouseup();
        expect(btn.selected).equal(true);
    });

});
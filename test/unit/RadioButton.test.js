describe("RadioButton", function() {
    var rb;
    var tg;

    before (function() {
        rb = GOWN.RadioButton;
    });

    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
        tg = new GOWN.ToggleGroup();
    });

    it("test radio select", function() {
        var btn = new GOWN.RadioButton(false, false);

        expect(btn._currentState).equal(rb.UP);
        expect(btn.selected).equal(false);
        btn.toggleSelected();

        // radio button has been selected
        expect(btn._currentState).equal(rb.SELECTED_UP);
        expect(btn.selected).equal(true);
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

    it("press along don't toggle button", function() {
        var btn = new GOWN.RadioButton(false, false);
        btn.mouseup();
        expect(btn.selected).equal(false);
        expect(btn._currentState).equal(rb.UP);
    });

    it("can be constructed disabled", function() {
        var btn = new GOWN.RadioButton(false, true);
        expect(btn.disabled).equal(true);
        expect(btn.selected).equal(false);
        btn.toggleSelected();
        expect(btn.disabled).equal(true);
        expect(btn.selected).equal(false);
    });

    it("won't change selected states if disabled", function() {
        var btn = new GOWN.RadioButton(false, true);
        btn.toggleSelected();
        expect(btn.disabled).equal(true);
        expect(btn.selected).equal(false);
    });

    it("can be set disabled", function() {
        var btn = new GOWN.RadioButton(false, false);
        btn.disable = true;
        expect(btn.disabled).equal(true);
        expect(btn.selected).equal(false);
        btn.toggleSelected();
    });

    it("can be set disable and changes don't work", function() {
        var btn = new GOWN.RadioButton(false, true);
        btn.disable = true;
        btn.toggleSelected();
        expect(btn.disabled).equal(true);
        expect(btn.selected).equal(false);
    });

    it("can be re-enabled and change states", function() {

    });

    it("can be added to a toggle group", function() {

    });

    it("multiple can be added to group and only 1 can be selected", function() {

    });
});
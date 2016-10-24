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
    });

    it("can be set disable and changes don't work", function() {
        var btn = new GOWN.RadioButton(false, true);
        btn.disable = true;
        btn.toggleSelected();
        expect(btn.disable).equal(true);
        expect(btn.selected).equal(false);
    });

    it("can be re-enabled and change states", function() {
        var btn = new GOWN.RadioButton(false, true);
        btn.disable = false;
        expect(btn.disable).equal(false);
        expect(btn.selected).equal(false);
        btn.toggleSelected();
        expect(btn.disable).equal(false);
        expect(btn.selected).equal(true);
    });

    it("can be added to a toggle group", function() {
        var btn = new GOWN.RadioButton(false, false);
        var group = new GOWN.ToggleGroup();
        btn.toggleGroup = group;
        expect(btn.toggleGroup).equal(group);
    });

    it("multiple selected buttons will be added and only the last will be selected", function() {
        var btn1 = new GOWN.RadioButton(true, false);
        var btn2 = new GOWN.RadioButton(true, false);
        var btn3 = new GOWN.RadioButton(true, false);
        var group = new GOWN.ToggleGroup();
        btn1.toggleGroup = group;
        btn2.toggleGroup = group;
        btn3.toggleGroup = group;
        expect(btn1.selected).equal(false);
        expect(btn2.selected).equal(false);
        expect(btn3.selected).equal(true);     
    });

    it("3 buttons and switch between selected", function() {
        var btn1 = new GOWN.RadioButton(false, false);
        var btn2 = new GOWN.RadioButton(false, false);
        var btn3 = new GOWN.RadioButton(false, false);
        var group = new GOWN.ToggleGroup();
        btn1.toggleGroup = group;
        btn2.toggleGroup = group;
        btn3.toggleGroup = group;

        btn1.toggleSelected();
        expect(btn1.selected).equal(true);
        expect(btn2.selected).equal(false);
        expect(btn3.selected).equal(false);

        btn2.toggleSelected();   
        expect(btn1.selected).equal(false);
        expect(btn2.selected).equal(true);
        expect(btn3.selected).equal(false);
    });
});
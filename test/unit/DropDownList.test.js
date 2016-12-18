describe("DropDownList", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    it("update when DropDown label when  selected value changes", function() {
        var ddl = new GOWN.DropDownList();
        ddl.label = "Hello World";
        expect(ddl.updateLabel).equal(true);
        ddl.redraw();
        expect(ddl.updateLabel).equal(false);

        ddl.label = "Hello";
        expect(ddl.updateLabel).equal(true);
        ddl.redraw();
        expect(ddl.updateLabel).equal(false);
    });

});

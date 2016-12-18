describe("AutoComplete", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    it("update when AutoComplete text when  selected value changes", function() {
        var acl = new GOWN.AutoComplete();
        acl.label = "Hello World";
        expect(acl.updateLabel).equal(true);
        acl.redraw();
        expect(acl.updateLabel).equal(false);

        acl.label = "Hello";
        expect(acl.updateLabel).equal(true);
        acl.redraw();
        expect(acl.updateLabel).equal(false);
    });

});

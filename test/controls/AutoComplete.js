describe("AutoComplete", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    it("update when AutoComplete text when  selected value changes", function() {
        var acl = new GOWN.AutoComplete();
        acl.text = "";
        acl.source = [
            {
                text:"Hello World"
            },{
                text:"Hello"
            },{
                text:"World"
            }
        ];

        acl.text = "Hello";
        expect(acl.results.length).equal(2);

        acl.text = "Hello W";
        expect(acl.results.length).equal(1);

        acl.text = "";
        expect(acl.results.length).equal(0);
    });

});

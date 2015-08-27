describe("Alignment tests", function() {
    function basicGroup() {
        var grp = new GOWN.LayoutGroup();
        grp.layout = new GOWN.HorizontalLayout();
        grp.width = 1000;
        var btn;
        for (var i=0; i < 4; i++) {
            btn = new GOWN.Button();
            btn.percentWidth = 100;
            grp.addChild(btn);
        }
        return grp;
    }
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });
    it("needUpdate should be true when sth. added to the LayoutGroup " +
        "(trigger redraw)", function() {
        var grp = new GOWN.LayoutGroup();
        grp.layout = new GOWN.VerticalLayout();
        grp.redraw();
        expect(grp._needUpdate).equal(false);

        var btn = new GOWN.Button();
        grp.addChild(btn);
        expect(grp._needUpdate).equal(true);
        grp.redraw();
        expect(grp._needUpdate).equal(false);
    });
    it("make sure layouting calculations are correct", function() {
        var grp = new GOWN.LayoutGroup();
        grp.layout = new GOWN.HorizontalLayout();
        grp.width = 100;
        var btn;
        for (var i=0; i < 4; i++) {
            btn = new GOWN.Button();
            btn.percentWidth = 100;
            grp.addChild(btn);
        }
        expect(grp._needUpdate).equal(true);
        grp.redraw();
        expect(btn.width).equal(25);
    });
    it("assure percentages are more important than explicit pixel parameters", function() {
        var grp = new GOWN.LayoutGroup();
        grp.layout = new GOWN.HorizontalLayout();
        grp.width = 120;
        var btn = new GOWN.Button();
        btn.percentWidth = 100;
        grp.addChild(btn);
        expect(grp._needUpdate).equal(true);

        grp.redraw();
        expect(btn.width).equal(120);
    });
    it("assure gaps are calculated correctly", function() {
        var grp = basicGroup();
        var btn = grp.getChildAt(grp.children.length-1);
        grp.layout.gap = 20;
        expect(grp._needUpdate).equal(true);
        grp.redraw();
        expect(grp._needUpdate).equal(false);

        // setting the same gap should be ignored
        var gap = grp.layout.gap;
        expect(gap).equal(20);
        grp.layout.gap = gap;
        expect(grp._needUpdate).equal(false);

        //235 * 4 (btn width) + 20 * 3 (gap)
        expect(Math.round(btn.width)).equal(235);

        expect(grp.layout._needUpdate).equal(false);
        grp.layout.lastGap = 60;
        expect(grp.layout._needUpdate).equal(true);
        grp.redraw();
        expect(grp.layout._needUpdate).equal(false);
        // 225 * 4 (btn width) + 20 * 2 (gap) + 60 (lastGap)
        expect(Math.round(btn.width)).equal(225);
        
        grp.layout.firstGap = 100;
        grp.redraw();
        expect(Math.round(btn.width)).equal(205);
        //205 * 4 (btn width) + 100 (firstGap) + 20 (gap) + 60 (lastGap)
    });
    it("assure padding is set correctly", function() {
        var grp = basicGroup();
        var btn = grp.getChildAt(grp.children.length-1);
        grp.layout.padding = 20;
        expect(grp._needUpdate).equal(true);
        grp.redraw();
        expect(grp._needUpdate).equal(false);
        //240 * 4 (btn width) + 20 * 2 (paddingLeft+paddingRight)
        expect(Math.round(btn.width)).equal(240);
        
        grp.layout.paddingLeft = 60;
        grp.redraw();
        //230 * 4 (btn width) + 60 (paddingLeft) + 20 (paddingRight)
        expect(Math.round(btn.width)).equal(230);

        grp.layout.paddingRight = 100;
        grp.redraw();
        //210 * 4 (btn width) + 60 (paddingLeft) + 100 (paddingRight)
        expect(Math.round(btn.width)).equal(210);

        // switch alignment and check paddingTop and paddingBottom
        grp.layout.alignment = GOWN.LayoutAlignment.VERTICAL_ALIGNMENT;
        grp.height = 500;
        for (var i=0; i < 4; i++) {
            grp.getChildAt(i).percentHeight = 100;
        }
        grp.redraw();
        // 115 * 4 (btn width) + 20 * 2 (padding)
        expect(Math.round(btn.height)).equal(115);
        
        grp.layout.paddingTop = 80;
        grp.redraw();
        // 100 * 4 (btn width) + 80 (paddingTop) + 20 (paddingBottom)
        expect(Math.round(btn.height)).equal(100);
        
        grp.layout.paddingTop = 50;
        grp.layout.paddingBottom = 50;
        grp.redraw();
        // 100 * 4 (btn width) + 50 (paddingTop) + 50 (paddingBottom)
        expect(Math.round(btn.height)).equal(100);
    });
    it("padding and gap together are calculated correctly", function() {
        var grp = basicGroup();
        var btn = grp.getChildAt(grp.children.length-1);
        grp.layout.padding = 20;
        grp.layout.gap = 20;
        grp.redraw();
        //225 * 4 (btn width) + 20 * 3 (gap) + 20 * 2 (padding)
        expect(Math.round(btn.width)).equal(225);
    });
});

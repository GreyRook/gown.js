// TODO: Test horizontal align / vertical align
// TODO: Test useSquareTiles
// TODO: test setting maxWidth
// TODO: test test gap

describe("Tiled Layout tests", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });
    function basicGroup(num_buttons) {
        var grp = new GOWN.LayoutGroup();
        grp.layout = new GOWN.TiledColumnsLayout();
        grp.width = 100;
        grp.height = 100;
        var btn;
        for (var i=0; i < num_buttons; i++) {
            btn = new GOWN.Button();
            btn.width = 10;
            btn.height = 10;
            grp.addChild(btn);
        }
        return grp;
    }
    it("basics", function () {
        // do not layout empty group
        var layout = new GOWN.TiledLayout();
        layout.layout([]);
        layout.layout([null]);
    });
    it("correct break after 10x10 components with a 100 px container",
        function() {
            var grp = basicGroup(41);
            grp.redraw();
            var last = grp.children[grp.children.length-1];
            var last_first_column_bottom = grp.children[grp.children.length-2];
            expect(last.y).equal(0);
            expect(last_first_column_bottom.y).equal(90);

            // change layout
            grp.layout = new GOWN.TiledRowsLayout();
            grp.redraw();
            var last_first_row_right = grp.children[grp.children.length-2];
            expect(last.x).equal(0);
            expect(last_first_row_right.x).equal(90);

            // change layout orientation
            grp.layout._orientation = GOWN.TiledLayout.ORIENTATION_COLUMNS;
            grp.layout._needUpdate = true;
            grp.redraw();
            expect(last.y).equal(0);
            expect(last_first_column_bottom.y).equal(90);
        }
    );
    it("use square tiles",
        function() {
            var grp = new GOWN.LayoutGroup();
            grp.layout = new GOWN.TiledRowsLayout();
            grp.width = 1000;
            grp.height = 1000;
            grp.layout.useSquareTiles = true;
            
            var btn;
            btn = new GOWN.Button();
            btn.height = 200;
            grp.addChild(btn);

            btn = new GOWN.Button();
            btn.width = 10;
            grp.addChild(btn);

            btn = new GOWN.Button();
            btn.width = 200;
            btn._needUpdate = true;
            grp.addChild(btn);
            
            // all buttons are 200 px width and height, so start at 400 px
            grp.redraw();
            expect(btn.x).equal(400);

            // center button in tile
            btn.percentWidth = undefined;
            btn.width = 50;
            grp.layout._needUpdate = true;
            grp.redraw();
            expect(btn.x).equal(475);
        }
    );
});
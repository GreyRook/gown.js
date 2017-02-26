describe("Control", function() {
    beforeEach(function(){
        // cleanup - make sure global theme is not set
        GOWN.Theme.removeTheme();
        new GOWN.TestTheme();
    });

    it("get mouse position", function() {
        var fake_mouse_event = {};
        fake_mouse_event.data = new PIXI.interaction.InteractionData();
        fake_mouse_event.type = "mousedown";
        fake_mouse_event.stoped = false;
        fake_mouse_event.data.global.x = 1337;
        fake_mouse_event.data.global.y = 42;

        var control = new GOWN.Control();
        var pos = control.mousePos(fake_mouse_event);
        expect(fake_mouse_event.data.global.x).equal(pos.x);
        expect(fake_mouse_event.data.global.y).equal(pos.y);
    });
});
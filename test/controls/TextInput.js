describe("TextInput", function() {
  beforeEach(function(){
    // cleanup - make sure global theme is not set
    GOWN.Theme.removeTheme();
    new GOWN.TestTheme();
  });

  it("allow non numeric chars after changing type from number to text", function() {
    var input = new GOWN.TextInput();

    expect(input.type).equal(GOWN.TextInput.TEXT);

    input.type = GOWN.TextInput.NUMBER;
    expect(input.type).equal(GOWN.TextInput.NUMBER);
    input.type = GOWN.TextInput.TEXT;
    expect(input.type).equal(GOWN.TextInput.TEXT);

    input.insertChar("a");
    input.insertChar("1");
    input.insertChar(".");
    input.insertChar("5");
    input.insertChar("b");

    expect(input.text).equal("a1.5b");
  });
});

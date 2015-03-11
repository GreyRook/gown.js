/**
 * @author Andreas Bresser
 */

/**
 * Wrapper for DOM Text Input
 *
 * based on PIXI.Input InputObject by Sebastian Nette,
 * see https://github.com/SebastianNette/PIXI.Input
 *
 * @class InputWrapper
 * @static
 */
PIXI_UI.InputWrapper = function(text)
{
};

/**
 * DOM input field.
 * we use one input field for all InputControls
 *
 * @property hiddenInput
 * @type DOMObject
 * @static
 */
PIXI_UI.InputWrapper.hiddenInput = null;

/**
 * create/return unique input field.
 * @returns {DOMObject}
 */
PIXI_UI.InputWrapper.createInput = function()
{
    if (!PIXI_UI.InputWrapper.hiddenInput) {
        var input = document.createElement('input');
        input.type = 'text';
        /*
         input.tabindex = -1;
         input.style.position = 'fixed';
         input.style.opacity = 0;
         input.style.pointerEvents = 'none';
         input.style.left = '0px';
         input.style.bottom = '0px';
         input.style.left = '-100px';
         input.style.top = '-100px';
         input.style.zIndex = 10;
         */

        // add blur handler
        input.addEventListener('blur', function()
        {
            if(PIXI_UI.InputControl.currentInput)
            {
                PIXI_UI.InputControl.currentInput.onMouseUpOutside();
            }
        }, false);

        // on key down
        input.addEventListener('keydown', function(e)
        {
            if(PIXI_UI.InputControl.currentInput)
            {
                e = e || window.event;
                if (PIXI_UI.InputControl.currentInput.hasFocus)
                {
                    PIXI_UI.InputControl.currentInput.onKeyDown(e);
                }
            }
        });

        // on key up
        input.addEventListener('keyup', function(e)
        {
            if(PIXI_UI.InputControl.currentInput)
            {
                e = e || window.event;
                if (PIXI_UI.InputControl.currentInput.hasFocus)
                {
                    PIXI_UI.InputControl.currentInput.onKeyUp(e);
                }
            }
        });

        document.body.appendChild(input);

        PIXI_UI.InputWrapper.hiddenInput = input;
    }
    return PIXI_UI.InputWrapper.hiddenInput;
};

/**
 * key to get text ("value" for default input field)
 * @type {string}
 * @static
 */
PIXI_UI.InputWrapper.textProp = "value"

/**
 * activate the text input
 * @returns {DOMObject}
 */
PIXI_UI.InputWrapper.focus = function()
{
    if (PIXI_UI.InputWrapper.hiddenInput) {
        PIXI_UI.InputWrapper.hiddenInput.focus();
    }
};

/**
 * deactivate the text input
 * @returns {DOMObject}
 */
PIXI_UI.InputWrapper.blur = function()
{
    if (PIXI_UI.InputWrapper.hiddenInput) {
        PIXI_UI.InputWrapper.hiddenInput.blur();
    }
};


/**
 * set selection
 * @returns {DOMObject}
 */
PIXI_UI.InputWrapper.setSelection = function(start, end)
{
    if (PIXI_UI.InputWrapper.hiddenInput) {
        PIXI_UI.InputWrapper.hiddenInput.selectionStart = start;
        PIXI_UI.InputWrapper.hiddenInput.selectionEnd = end;
    } else {
        PIXI_UI.InputWrapper._selection = [start, end];
    }
};

/**
 * get start and end of selection
 * @returns {Array}
 */
PIXI_UI.InputWrapper.getSelection = function() {
    if (PIXI_UI.InputWrapper.hiddenInput) {
        return [
            PIXI_UI.InputWrapper.hiddenInput.selectionStart,
            PIXI_UI.InputWrapper.hiddenInput.selectionEnd
        ];
    } else {
        return PIXI_UI.InputWrapper._selection;
    }
};

/**
 * get text value from hiddenInput
 * @returns {String}
 */
PIXI_UI.InputWrapper.getText = function() {
    if (PIXI_UI.InputWrapper.hiddenInput) {
        var textProp = PIXI_UI.InputWrapper.textProp;
        var txt = PIXI_UI.InputWrapper.hiddenInput[textProp];
        return txt.replace(/\r/g, '');
    } else {
        return PIXI_UI.InputWrapper._text;
    }

};

/**
 * get text value to hiddenInput
 * @param {String}
 */
PIXI_UI.InputWrapper.setText = function(text) {
    if (PIXI_UI.InputWrapper.hiddenInput) {
        var textProp = PIXI_UI.InputWrapper.textProp;
        PIXI_UI.InputWrapper.hiddenInput[textProp] = text;
    } else {
        PIXI_UI.InputWrapper._text = text;
    }
};
Input Control
==========
There are two different components for text input: TextInput for a single-line text input and password fields (like the HTML-input) and TextArea as multi line text input.

all text manipulation controls inherit InputControl.

Input Wrapper and KeyboardManager
---------------------------------
PIXI supports pointer gestures (mouse and touch) but not Text input. GOWN has wrappers that take the user input from a keyboard so the InputControl can render it.
For now there are two different input wrapper:

 - The DOMInputWrapper creates a single DOM-element for input when a TextInput control is created and a single textarea DOM-element for a TextArea. Whenever a InputControl is selected the wrapper will copy the text, cursor position and selection from the InputControl to the DOM-element of the wrapper. All text input is taken from the DOM object textinput/textarea and written back to the InputControl using the default browser events. So the browser handles keyboard input, cursor position, selection and language-independent keyboard layout itself and is the preferred input method for now.

 - The KeyboardInputWrapper takes input from the underlying browser/app framework directly and handles cursor position, text selection itself. This is necessary when the DOM input can not be used when you run gown inside an app-framework (like cordova or cocoon.io). This allows you to enter text in any environment and will be the preferred input method in the future.

The Wrapper can only communicate to the InputControl by sending an event containing the text changes.

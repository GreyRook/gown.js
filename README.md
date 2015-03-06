PIXI_UI
===========

UI system for pixi.js ( http://pixijs.com )
inspired by feathers-ui ( http://feathersui.com ) for ActionScript

[![Inline docs](http://inch-ci.org/github/brean/pixi_ui.svg?branch=master)](http://inch-ci.org/github/brean/pixi_ui)

features
========

 1. common components for easy UI creation
     - Button
       - simple Button, with label and background, easy to extend using themes
     - ToggleButton
       - a button that has different states for press/touches
     - LayoutGroup
       - a group where you can add components and align them
     - ScrollArea
       - a masked area that has exactly one child as content that can be scrolled.
 1. layouting
     - horizontal, vertical or tile-based layouts (very similar to the feathers LayoutGroup)
 1. scrollable container
     - the ScrollArea creates a viewport for some content that can be scrolled using mouse (including mouse wheel) or touch gestues. When this content is a LayoutGroup the scroll behaviour will be dependent on the content layout (when it is a horizontal layout it will default to horizontal scrolling, vertical layout defaults to vertical scrolling - but you can force a specific scroll behaviour if you want).
 1. basic shapes that provide width and height that can be changed easily (for use in themes for example)

overview
========

subfolders of this folder
-------------------------

 - examples - simple examples to show the usage (and to have something more graphical besides the jasmine-tests)
 - lib - required libraries (just pixi-dev)
 - src - source code for pixi_ui
 - test - jasmine unit tests using karma with istanbul coverage report (use 'grunt test' to run, firefox is set as default browser)
 - themes - basic UI example themes (e.g. AeonTheme which is based on the Adobe Flex assets)

Theming
=======
Creating own themes is easy. You can take a look at themes/AeonTheme.js for a more detailed example using tiled images or Themes/ShapeTheme.js for a theme using only basic shapes. It is possible to have different themes in one project which allows you to easily style components just as you want to. You can even switch themes at runtime.

The test/src/TestTheme.js is a fake Theme used only for the unit tests.

Under the hood
--------------
Center of the theming system is the "skins"-object. It holds unique names of differnt controls as key (e.g. "button" as identifier for pixi_ui.Button) and nested objects as value. These nested objects allow you to save different graphics for different skins (e.g. "down" when the user pressed a button down). The graphic for the state can be an images but also any kind of shape (you can set everything that can be added to a PIXI-DisplayObjectContainer as skin).
It is important that the variable width/height of your skin can be changed so your skin can be layouted correctly.
Every control need its own instance for the skin, so you have to wrap it in a function that creates a new instance of the skin.

In short, the skins-object looks like this:
`theme.skins = {<control>: {<state>: function () { new <skin>() } }}`

Rendering
=========
PIXI does the rendering. So we are independent from WebGL or the Canvas fallback.
We inherit the render functions for WebGL (_renderWebGL) and Canvas (_renderCanvas) and call a redraw-function just before the rendering.
So you can change the properties of the component. The setter/getter for this property sets an "invalid" flag of the component that will force the redraw-function to update the component just before the next draw circle (this can be the recalculation of the position and dimensions or a skin change on user interaction).

TODO
======
(note: this TODO list does not show an order or priority, nor will it all be implemented, its just a list of things that would be nice-to-have)

 - find a nicer name (pixi_ui does not roll that easily off the tongue)
 - better and more detailed documentation!
 - How-To tutorial and beginners documentation!

 - mouse wheel support
 - Bugfix: buttons without theme should at least show the label.
 - real viewport(s) for ScrollArea ?
 - build/compress themes
 - benchmarking capabilities and performance optimisation
 - handle if pixi_ui gets imported before pixi
 - disabled-state for controls
 - more controls (and examples) for:
   - Label
   - DOMComponent
   - Dialog
   - Slider
   - List (Item Renderer)
   - PickerList
   - Checkbox
   - RadioBox
   - Toggle
   - Gauge
   - NumericStepper
   - TextInput
   - ProgressBar
   - ScaleTool (to change width/height of a control)
   - ScrollContainer (sth. with the same API as feathers)
 - more examples:
   - ToggleButton
   - component explorer (see http://feathersui.com/examples/components-explorer/ )
   - scrolling
 - more shapes:
   - Line
   - Arc (e.g. for gauge)
   - PolyStar/Hex/Pentagon
   - Polyggon
 - transitions
 - Animations (transition animations?)
 - better testing using js-imagediff and grunt (like EaselJS - see http://blog.createjs.com/unit-tests-in-easeljs-preloadjs/ )
 - Drag-and-Drop
 - Gestue helper (pitch-zoom)
 - better/more async testing

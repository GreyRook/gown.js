PIXI_UI
===========

UI system for [pixi.js](http://pixijs.com) inspired by [feathers-ui](http://feathersui.com) for ActionScript

[![Inline docs](http://inch-ci.org/github/brean/pixi_ui.svg?branch=master)](http://inch-ci.org/github/brean/pixi_ui)
[![Build Status](https://travis-ci.org/brean/pixi_ui.svg?branch=master)](https://travis-ci.org/brean/pixi_ui)

Features
========

 1. Basic UI components
     - **Button**: simple Button, with label and background, easy to extend using themes
     - **TextInput**: keyboard/touch text input
     - **ToggleButton**: a button with on/off state
 1. Layouting
     - **LayoutGroup**: a component to create horizontal, vertical or tile-based layouts
 1. Scrollable container
     - **ScrollArea**: a viewport that can be scrolled using mouse (including mouse wheel) or touch gestures.  When its content is a LayoutGroup the scroll behaviour will be dependent on its layout: a horizontal layoutgroup will default to horizontal scrolling, vertical layout to vertical scrolling.  But you are in control and can manually overwrite the scroll behaviour.
 1. Basic shapes that provide width and height that can be changed easily (for use in themes for example)


Folder structure
================

 - examples - simple examples to show the usage (and to have something more graphical besides the jasmine-tests)
 - lib - required libraries (just pixi-dev)
 - src - source code for pixi_ui
 - test - jasmine unit tests using karma with istanbul coverage report (use `grunt test` to run)
 - themes - basic UI example themes
  - **AeonTheme**.js A theme based on Feather's [AeonDesktopTheme](https://github.com/joshtynjala/feathers/tree/master/themes/AeonDesktopTheme) making use of 9-tiled images
  - **Themes/ShapeTheme**.js a theme using only basic shapes.


Theming
=======

 - It is possible to have different themes in one project
 - Themes can be switched at run time
 - For reference how to create your own theme check the themes folder.  It contains two different approaches on creating themes
 - The test/src/TestTheme.js is a fake theme used only for the unit tests

Under the hood
--------------
Center of the theming system is the "skins"-object. It holds unique names of different controls as key (e.g. "button" as identifier for pixi_ui.Button) and nested objects as value. These nested objects allow you to save different graphics for different skins (e.g. "down" when the user pressed a button down). The graphic for the state can be an images but also any kind of shape (you can set everything that can be added to a PIXI-DisplayObjectContainer as skin).
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
This list is not ordered by priority nor does it contain any promise that those items will be implemented.

 - run tests through testem
 - jasmine coverage
 - find a nicer name (pixi_ui does not roll that easily off the tongue)
 - better and more detailed documentation!
 - How-To tutorial and beginners documentation!
 - mouse wheel support
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
   - ProgressBar
   - ScaleTool (to change width/height of a control)
   - ScrollContainer (sth. with the same API as feathers)
 - more examples:
   - ToggleButton
   - component explorer ([like Feathers UI](http://feathersui.com/examples/components-explorer/))
   - scrolling
 - more shapes:
   - Line
   - Arc (e.g. for gauge)
   - PolyStar/Hex/Pentagon
   - Polyggon
 - transitions
 - Animations (transition animations?)
 - better testing using js-imagediff and grunt ([like EaselJS does](http://blog.createjs.com/unit-tests-in-easeljs-preloadjs/))
 - Drag-and-Drop
 - Gestue helper (pitch-zoom)
 - better/more async testing
 - evaluate cocoonjs support

Known Bugs
==========
 - Buttons without theme are invisible (they should at least show the label).
 - TextInput content should not be copied when changing text field
 - TextInput cursor should be at the end of the text field on focus
 - selecting Text in TextInput does not work
 - ScrollArea with ScrollBar should reposition the thumb when the user just moves the content in the scroll area without klicking on the thumb
 - new Button label flash at position 0:0 before they get positioned at the right position (scroll the buttons in example 4 to see this)
 - width/height not calculated for scaling (just pixel positions)
 - reusing the same image atlas for a theme does not work ("example 7 - slider" not working)
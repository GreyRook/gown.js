![goon.js](http://i.imgur.com/cD9hRVx.png)
===========

UI system for [pixi.js](http://pixijs.com) inspired by [feathers-ui](http://feathersui.com).

[![Inline docs](http://inch-ci.org/github/brean/pixi_ui.svg?branch=master)](http://inch-ci.org/github/brean/pixi_ui)
[![Build Status](https://travis-ci.org/brean/pixi_ui.svg?branch=master)](https://travis-ci.org/brean/pixi_ui)
[![npm version](https://badge.fury.io/js/pixi_ui.svg)](http://badge.fury.io/js/pixi_ui)


Features
========
 1. Basic UI components
     - **Button**: simple Button, with label and background, easy to extend using themes
     - **ToggleButton**: a button with on/off state
     - **Slider** a simple slider with modifyable start and end value

 1. Layouting
     - **LayoutGroup**: a component to create horizontal, vertical or tile-based layouts

 1. Scrollable container
     - **ScrollArea**: a viewport that can be scrolled using mouse (including mouse wheel) or touch gestures.  When its content is a LayoutGroup the scroll behaviour will be dependent on its layout: a horizontal layoutgroup will default to horizontal scrolling, vertical layout to vertical scrolling.  But you are in control and can manually overwrite the scroll behaviour.
     - **ScrollBar**: providing a scroll thumb that can be moved. gets automatically oriented on the given ScrollArea

 1. A Text input providing text and password input (based on [PIXI Input](https://github.com/SebastianNette/PIXI.Input) )

 1. Basic shapes that provide width and height that can be changed easily (for use in themes for example)


Folder structure
================

 - examples - simple examples to show the usage (and to have something more graphical besides the jasmine-tests)

 - lib - required libraries (just pixi-dev)

 - src - source code for pixi_ui

 - test - unit tests, run coverage_karma_istanbul.sh to get a table providing all files and their coverage, run coverage_blanket to start a web server that shows you the coverage for all lines of the generated browserify output file.

 - themes - basic UI example themes

  - **AeonTheme**.js A theme based on Feather's [AeonDesktopTheme](https://github.com/joshtynjala/feathers/tree/master/themes/AeonDesktopTheme) making use of 9-tiled images
  - **MetalWorksMobileTheme**.js a theme based on Feather's [MetalWorksMobileTheme](https://github.com/joshtynjala/feathers/tree/master/themes/MetalWorksMobileTheme)
  - **Themes/ShapeTheme**.js a theme using only basic shapes.


Theming
=======

 - Using the python script *themes/xml_to_json.py* you can convert your XML file from [feathers-ui](http://feathersui.com) into JSON so the default PIXI loader can parse it.

  - example:

   ```bash  
   python xml_to_json.py assets/aeon/aeon_desktop.xml
   ```

   the script requires [PIL](http://www.pythonware.com/products/pil/) (or [Pillow](http://python-pillow.github.io/)) to determine the texture width/height

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

 - find a nicer name (pixi_ui does not roll that easily off the tongue)

 - better and more detailed documentation!

 - mouse wheel support

 - more (unit) tests/better coverage

   - test Application

   - test Scrollable, Slider and SliderData

   - test ScrollBar, ScrollThumb and ScrollArea

   - test InputControl and InputWrapper

   - more tests for Shapes

   - ignore renderAreaWebGL and renderWebGL in blanket tests

 - How-To tutorial and beginners documentation!

 - real viewport(s) for ScrollArea ?

 - build/compress themes

 - benchmarking capabilities and performance optimisation

 - handle if pixi_ui gets imported before pixi (?)

 - disabled-state for controls

 - more controls (and examples) for:

   - Label (not needed - just use PIXI.Text?)

   - Checkbox

   - RadioBox

   - Toggle

   - TextArea

   - DOMComponent

   - List (Item Renderer)

     - PickerList

       - Select (drop-down list for desktop)

   - Table

   - Gauge

   - charts

     - line chart

     - pie chart

     - bar chart

   - NumericStepper

   - ProgressBar

   - ScaleTool (to change width/height of a control)

   - ScrollContainer (sth. with the same API as feathers)

 - cleanup-functions to free memory/remove event listener etc. (take a look at/extend pixi destroy funtion)

 - more examples:

   - ToggleButton

   - component explorer ([like Feathers UI](http://feathersui.com/examples/components-explorer/))

   - scrolling

 - more shapes:

   - Line

   - Arc (e.g. for gauge)

   - PolyStar/Hex/Pentagon

   - Polyggon

 - Screen & Window management

   - Default Dialogs

     - confirm

     - alert/ok

     - prompt/input

 - Screen transitions

 - Animations (transition animations - see feathers -> motion -> transition ?)

 - better testing using js-imagediff and grunt ([like EaselJS does](http://blog.createjs.com/unit-tests-in-easeljs-preloadjs/))

 - Drag-and-Drop support (see [PIXI.draggalbe](https://github.com/SebastianNette/PIXI.draggable) )

 - Gestue helper (pitch-zoom)

 - evaluate cocoonjs support

 - generate UI from JSON or XML file

 - UI Designer

Known Bugs
==========
see [Issues](https://github.com/brean/pixi_ui/issues/)

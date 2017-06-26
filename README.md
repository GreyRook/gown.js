![gown.js](https://cdn.rawgit.com/GreyRook/gown.js/master/logo.svg)
===========

UI system for [pixi.js](http://pixijs.com) 4, inspired by [feathers-ui](http://feathersui.com).

[![Inline docs](http://inch-ci.org/github/GreyRook/gown.js.svg?branch=master)](http://inch-ci.org/github/GreyRook/gown.js)
[![Code Climate](https://codeclimate.com/github/GreyRook/gown.js/badges/gpa.svg)](https://codeclimate.com/github/GreyRook/gown.js)
[![Build Status](https://travis-ci.org/GreyRook/gown.js.svg?branch=master)](https://travis-ci.org/GreyRook/gown.js)

Features
========
 1. Basic UI components
     - **Button**: simple Button, with label and background, easy to extend using themes
     - **CheckBox** a simple checkbox
     - **ToggleButton**: a button with pressed state
     - **Slider** a simple slider with modifyable start and end value

 1. Layouting
     - **LayoutGroup**: a component to create horizontal, vertical or tile-based layouts

 1. Scrollable container
     - **ScrollContainer**: provides a viewport that can be scrolled using mouse or touch gestures.  When its content is a LayoutGroup the scroll behavior will be dependent on its layout: a horizontal layoutgroup will default to horizontal scrolling, vertical layout to vertical scrolling.  But you are in control and can manually overwrite the scroll behavior.
     - **ScrollBar**: providing a scroll thumb that can be moved. Part of ScrollContainer and List, but can be used separately.

 1. A Text input providing text and password input (based on [PIXI Input](https://github.com/SebastianNette/PIXI.Input) )

 1. Basic shapes that provide width and height that can be changed easily (for use in themes for example)

Examples
========
see the examples-folder in this repo or play with some example online at:
http://greyrook.github.io/gown-examples/

Folder structure
================

 - examples - simple examples to show the usage (and to have something more graphical besides the jasmine-tests)

 - lib - required libraries (just pixi-dev)

 - src - source code for gown.js

 - test - unit tests, run coverage_karma_istanbul.sh to get a table providing all files and their coverage, run coverage_blanket to start a web server that shows you the coverage for all lines of the generated browserify output file.

 - themes - basic UI example themes

  - **AeonTheme**.js A theme based on Feather's [AeonDesktopTheme](https://github.com/joshtynjala/feathers/tree/master/themes/AeonDesktopTheme) making use of 9-tiled images
  - **MetalWorksDesktopTheme**.js a theme based on Feather's [MetalWorksDesktopTheme](https://github.com/joshtynjala/feathers/tree/master/themes/MetalWorksDesktopTheme)
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
Center of the theming system is the "skins"-object. It holds unique names of different controls as key (e.g. "button" as identifier for GOWN.Button) and nested objects as value. These nested objects allow you to save different graphics for different skins (e.g. "down" when the user pressed a button down). The graphic for the state can be an images but also any kind of shape (you can set everything that can be added to a PIXI-DisplayObjectContainer as skin).
It is important that the variable width/height of your skin can be changed so your skin can be layouted correctly.
Every control need its own instance for the skin, so you have to wrap it in a function that creates a new instance of the skin.

In short, the skins-object looks like this:
`theme.skins = {<control>: {<state>: function () { new <skin>() } }}`

Rendering
=========
When changing a component the corresponding setter updates an `invalid` flag.  This will force a redraw on the next frame. (this can be the recalculation of the position and dimensions or a skin change on user interaction).

The loop looks like this:

1. redraw (gown)
1. updateTransform (PIXI)
1. render (PIXI)

The `redraw` function is hooked into PIXI's render loop in the `updateTranform` methond but called before the actual calcluation of `updateTransform`.


Known Bugs
==========
see [Issues](https://github.com/GreyRook/gown.js/issues/)

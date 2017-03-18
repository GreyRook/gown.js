TODO next
=========
Most important for now are bugfixes, take a look at the [Issue tracker](https://github.com/GreyRook/gown.js/issues/), especially the [examples that are not working](https://github.com/GreyRook/gown.js/issues/95).

 - create Miller List example (as requested on github)

 - create bootstrap-theme for basic buttons.

 - minWidth/minHeight for themes.

 - update themes and test all components with current theming (add scalemode for theming)

 - POM integration: provide registerPOMElements-function (see https://github.com/GreyRook/POM/issues/10 )

 - mouse wheel support

 - other themes from feathers (metalworks-mobile, topcoat-light, minimal, ...)

TODO
======
This list is not ordered by priority nor does it contain any promise that those items will be implemented.

 - better and more detailed documentation!

 - mouse wheel support

 - Refactor to ES6

 - Better Testing

   - Browserstack integration for tests

   - better testing using js-imagediff and grunt ([like EaselJS does](http://blog.createjs.com/unit-tests-in-easeljs-preloadjs/))

   - more (unit) tests/better coverage

     - test Application

     - test Scrollable, Slider and SliderData

     - test ScrollBar, ScrollThumb, List and ScrollContainer

     - test InputControl and InputWrapper

 - How-To tutorial and beginners documentation!

 - create new examples-side (see [gown-examples](https://brean.github.io/gown-examples/) for the old one).

 - benchmarking capabilities and performance optimization

 - handle if gown.js gets imported before pixi (?)

 - disabled-state for controls

 - more controls (and examples) for:

   - Label (not needed - just use PIXI.Text?)

   - RadioBox

   - Toggle

   - DOMComponent

   - List (Item Renderer)

     - PickerList

       - Select (drop-down list for desktop)

   - Table

   - Gauge (extension?)

   - charts (extension?)

     - line chart

     - pie chart

     - bar chart

   - NumericStepper

   - ProgressBar

   - ScaleTool (to change width/height of a control - extension?)

   - ScrollContainer (sth. with the same API as feathers)

   - Separator/Movable Divider

   - View navigation (extension?)

     - Tabs

     - Pills

     - Breadcrumbs

     - Pagination

   - Responsive Components

     - Burger Menu & Menu Bar

     - Grid System ( Like [Bootstrap Grid CSS](http://getbootstrap.com/css/#grid) )

 - Icon for TextInput and Button

 - Popup for Button (like the alt-Tooltip for HTML-Buttons)

 - Anchorlayout

 - cleanup-functions to free memory/remove event listener etc. (extend pixi destroy funtion)

   - remove events

   - remove child elements

   - destroy child elements

   - set values to "null"

 - more examples:

   - ToggleButton

   - component explorer ([like Feathers UI](http://feathersui.com/examples/components-explorer/))

   - scrolling

 - Screen & Window management

   - Default Dialogs

     - confirm

     - alert/ok

     - prompt/input

 - Screen transitions

 - Animations (transition animations - see feathers -> motion -> transition ?)

 - Drag-and-Drop support (see [PIXI.draggalbe](https://github.com/SebastianNette/PIXI.draggable) )

 - Gestue helper (pitch-zoom)

 - evaluate cocoonjs support

 - UI Designer

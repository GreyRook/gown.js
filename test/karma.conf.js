module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath : '../',

        frameworks : ['jasmine'],

        // list of files / patterns to load in the browser
        files : [
            'lib/pixi.dev.js',

            'src/Intro.js',
            'src/PixiUi.js',
            'src/skin/Theme.js',
            'src/shapes/Shape.js',
            'src/shapes/Ellipse.js',
            'src/shapes/Diamond.js',
            'src/shapes/Rect.js',
            'src/util/ScaleContainer.js',
            'src/layout/ViewPortBounds.js',
            'src/layout/Layout.js',
            'src/layout/LayoutAlignment.js',
            'src/layout/HorizontalLayout.js',
            'src/layout/VerticalLayout.js',
            'src/layout/TiledLayout.js',
            'src/layout/TiledRowsLayout.js',
            'src/layout/TiledColumnsLayout.js',

            'src/core/Control.js',
            'src/controls/Button.js',
            'src/controls/ToggleButton.js',
            'src/controls/LayoutGroup.js',

            'src/controls/ScrollArea.js',
            'src/controls/ScrollBar.js',
            'src/controls/ScrollThumb.js',
            'src/Outro.js',

            'themes/*.js',
            'test/src/*.js',
            'test/spec/**/*.js',
            {pattern: 'test/**/*.png', watched: false, included: false, served: true},
            {pattern: 'themes/assets/aeon/*', watched: false, included: false, served: true}
            // 'test/functional/**/*.js',
        ],

        // list of files to exclude
        //exclude : [],

        // use dolts reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress', 'junit', 'teamcity'
        // CLI --reporters progress
        reporters : ['spec', 'coverage'],

        // web server port
        // CLI --port 9876
        port : 9876,

        // cli runner port
        // CLI --runner-port 9100
        runnerPort : 9100,

        // enable / disable colors in the output (reporters and logs)
        // CLI --colors --no-colors
        colors : true,

        // level of logging
        // possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
        // CLI --log-level debug
        logLevel : config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        // CLI --auto-watch --no-auto-watch
        autoWatch : false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        browsers : ['Firefox'],

        // If browser does not capture in given timeout [ms], kill it
        // CLI --capture-timeout 60000
        captureTimeout : 60000,

        // Auto run tests on start (when browsers are captured) and exit
        // CLI --single-run --no-single-run
        singleRun : true,

        // report which specs are slower than 500ms
        // CLI --report-slower-than 500
        reportSlowerThan : 500,

        preprocessors : {
            'src/*/*.js': ['coverage']
        },

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-coverage',
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-spec-reporter'
        ]
    });
};

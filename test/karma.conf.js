var cover = require('browserify-istanbul');

module.exports = function(config) {
    config.set({
        basePath : '../',
        frameworks: ['browserify', 'chai', 'jasmine'],

        files: [
            'lib/pixi.js',
            'src/index.js',
            'src/**/*.js',
            'themes/*.js',
            'test/src/*.js',
            'test/setup.js',
            'test/unit/*.test.js',
            {pattern: 'test/img/*.png', watched: false, included: false, served: true},
            {pattern: 'themes/assets/aeon/*', watched: false, included: false, served: true}
        ],
        proxies:  {
            '/test/img/': '/base/test/img/',
            '/themes/': '/base/themes/'
        },
        browserify: {
            debug: true,
            extensions: [".js"],
            configure: function(bundle){
                bundle.on('prebundle', function(){
                    bundle
                        .transform(cover);
                });
            }
        },
        // list of files to exclude
        //exclude : [],

        // use dolts reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress', 'junit', 'teamcity'
        // CLI --reporters progress
        reporters : ['spec', 'coverage', 'progress'],

        'coverageReporter': {
            'type' : 'html'
        },

        // enable / disable colors in the output (reporters and logs)
        // CLI --colors --no-colors
        colors : true,

        // level of logging
        // possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
        // CLI --log-level debug
        logLevel : config.LOG_INFO,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        // CLI --browsers Chrome,Firefox,Safari
        browsers: ['Chrome'],

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
            'src/index.js': ['browserify'],
            'src/**/*.js': ['browserify']
        },

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-coverage',
            'karma-jasmine',
            'karma-chai',
            'karma-browserify',
            'karma-phantomjs-launcher',
            'karma-spec-reporter'
        ]
    });
};

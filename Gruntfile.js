module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadTasks('tasks');

    var srcFiles = [
            '<%= dirs.src %>/Intro.js',
            '<%= dirs.src %>/PixiUi.js',
            '<%= dirs.src %>/util/position.js',
            '<%= dirs.src %>/skin/Theme.js',
            '<%= dirs.src %>/shapes/Shape.js',
            '<%= dirs.src %>/shapes/Ellipse.js',
            '<%= dirs.src %>/shapes/Diamond.js',
            '<%= dirs.src %>/shapes/Line.js',
            '<%= dirs.src %>/shapes/Rect.js',
            '<%= dirs.src %>/util/ScaleContainer.js',
            '<%= dirs.src %>/util/InputWrapper.js',
            '<%= dirs.src %>/layout/ViewPortBounds.js',
            '<%= dirs.src %>/layout/Layout.js',
            '<%= dirs.src %>/layout/LayoutAlignment.js',
            '<%= dirs.src %>/layout/HorizontalLayout.js',
            '<%= dirs.src %>/layout/VerticalLayout.js',
            '<%= dirs.src %>/layout/TiledLayout.js',
            '<%= dirs.src %>/layout/TiledRowsLayout.js',
            '<%= dirs.src %>/layout/TiledColumnsLayout.js',

            '<%= dirs.src %>/core/Control.js',
            '<%= dirs.src %>/core/Skinable.js',
            '<%= dirs.src %>/controls/Application.js',
            '<%= dirs.src %>/controls/Button.js',
            '<%= dirs.src %>/controls/InputControl.js',
            '<%= dirs.src %>/controls/TextInput.js',
            '<%= dirs.src %>/controls/ToggleButton.js',
            '<%= dirs.src %>/controls/LayoutGroup.js',

            '<%= dirs.src %>/util/SliderData.js',
            '<%= dirs.src %>/controls/ScrollArea.js',
            '<%= dirs.src %>/controls/ScrollThumb.js',
            '<%= dirs.src %>/controls/Scrollable.js',
            '<%= dirs.src %>/controls/Slider.js',
            '<%= dirs.src %>/controls/ScrollBar.js',
            '<%= dirs.src %>/Outro.js'
        ],
        banner = [
            '/**',
            ' * @license',
            ' * <%= pkg.name %> - v<%= pkg.version %>',
            ' * Copyright (c) 2015, Andreas Bresser',
            ' * <%= pkg.homepage %>',
            ' *',
            ' * Compiled: <%= grunt.template.today("yyyy-mm-dd") %>',
            ' *',
            ' * <%= pkg.name %> is licensed under the <%= pkg.license %> License.',
            ' * <%= pkg.licenseUrl %>',
            ' */',
            ''
        ].join('\n');

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        dirs: {
            build: 'bin',
            docs: 'docs',
            src: 'src',
            test: 'test'
        },
        files: {
            srcBlob: '<%= dirs.src %>/**/*.js',
            testBlob: '<%= dirs.test %>/**/*.js',
            testConf: '<%= dirs.test %>/karma.conf.js',
            build: '<%= dirs.build %>/pixi_ui.dev.js',
            buildMin: '<%= dirs.build %>/pixi_ui.js'
        },
        concat: {
            options: {
                banner: banner
            },
            dist: {
                src: srcFiles,
                dest: '<%= files.build %>'
            }
        },
        /* jshint -W106 */
        concat_sourcemap: {
            dev: {
                files: {
                    '<%= files.build %>': srcFiles
                },
                options: {
                    sourceRoot: '../'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: './.jshintrc'
            },
            source: {
                src: srcFiles.concat('Gruntfile.js'),
                options: {
                    ignores: '<%= dirs.src %>/**/{Intro,Outro,PixiUi}.js'
                }
            },
            test: {
                src: ['<%= files.testBlob %>'],
                options: {
                    ignores: '<%= dirs.test %>/lib/resemble.js',
                    jshintrc: undefined, //don't use jshintrc for tests
                    expr: true,
                    undef: false,
                    camelcase: false
                }
            }
        },
        uglify: {
            options: {
                banner: banner
            },
            dist: {
                src: '<%= files.build %>',
                dest: '<%= files.buildMin %>'
            }
        },
        connect: {
            test: {
                options: {
                    port: grunt.option('port-test') || 9002,
                    base: './',
                    keepalive: true
                }
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                logo: '<%= pkg.logo %>',
                options: {
                    paths: '<%= dirs.src %>',
                    outdir: '<%= dirs.docs %>'
                }
            }
        },
        //Watches and builds for _development_ (source maps)
        watch: {
            scripts: {
                files: ['<%= dirs.src %>/**/*.js'],
                tasks: ['concat_sourcemap'],
                options: {
                    spawn: false
                }
            }
        },
        karma: {
            unit: {
                configFile: '<%= files.testConf %>',
                // browsers: ['Chrome'],
                singleRun: true
            }
        }
    });

    grunt.registerTask('build', ['jshint:source', 'concat', 'uglify']);
    grunt.registerTask('build-debug', ['concat_sourcemap', 'uglify']);

    grunt.registerTask('test', ['concat', 'jshint:test', 'karma']);

    grunt.registerTask('docs', ['yuidoc']);
    grunt.registerTask('travis', ['build', 'test']);

    grunt.registerTask('default', ['build', 'test']);

    grunt.registerTask('debug-watch', ['concat_sourcemap', 'watch:debug']);
};

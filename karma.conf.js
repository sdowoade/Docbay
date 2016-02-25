// Karma configuration
// Generated on Fri Jan 29 2016 17:52:18 GMT+0100 (WAT)
'use strict';
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/lib/angular/angular.min.js',
      'public/lib/angular-ui-router/release/angular-ui-router.min.js',
      'public/lib/angular-aria/angular-aria.min.js',
      'public/lib/angular-route/angular-route.min.js',
      'public/lib/angular-animate/angular-animate.min.js',
      'public/lib/angular-mocks/angular-mocks.js',
      'public/lib/angular-material/angular-material.min.js',
      'public/lib/angular-resource/angular-resource.min.js',
      'public/lib/rangy/rangy-core.js',
      'public/lib/rangy/rangy-selectionsaverestore.js',
      'public/lib/textAngular/dist/textAngular-sanitize.min.js',
      'public/lib/textAngular/dist/textAngular.min.js',
      'public/lib/angular-loading-bar/build/loading-bar.js',
      'public/js/application.js',
      'tests/fend/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors:
    // https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'public/js/application.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl',
    // 'coverage', 'spec', 'failed'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage', 'progress', 'coveralls'],


    // web server port
    port: 3000,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE ||
    // config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file
    // and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser
    // launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    coverageReporter: {
      // specify a common output directory
      dir: 'coverage',
      reporters: [
        // reporters not supporting the `file` property
        {
          type: 'html',
          subdir: 'report-html'
        }, {
          type: 'lcov',
          subdir: 'report-lcov'
        },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        {
          type: 'cobertura',
          subdir: '.',
          file: 'cobertura.txt'
        }, {
          type: 'lcovonly',
          subdir: '.',
          file: 'report-lcovonly.txt'
        }, {
          type: 'teamcity',
          subdir: '.',
          file: 'teamcity.txt'
        }, {
          type: 'text',
          subdir: '.',
          file: 'text.txt'
        }, {
          type: 'text-summary',
          subdir: '.',
          file: 'text-summary.txt'
        },
      ]
    },

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
